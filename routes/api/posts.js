const express=require('express');
const Post = require('../../schema/PostSchema');

const User = require('../../schema/UserSchema');
const router=express.Router();

router.get("/api/posts", async(req, res, next) => {
    const results= await getPosts({});
    res.status(200).send(results);
})


router.get("/api/posts/:id", async(req, res, next) => {
    
    const postId = req.params.id;

    let postData = await getPosts({ _id: postId });
    postData = postData[0];

    let results = {
        postData: postData
    }

    if(postData.replyTo !== undefined) {
        results.replyTo = postData.replyTo;
    }

    results.replies = await getPosts({ replyTo: postId });

    res.status(200).send(results);
})


router.post('/api/posts',async(req,res)=>{

    if(!req.body.content){
        console.log("content not");
        return res.status(404)
    }

    
    const postData={
        content:req.body.content,
    
        postedBy:req.session.user
    }

    if(req.body.replyTo) {
        postData.replyTo = req.body.replyTo;
    }

    Post.create(postData)
    .then(newPost=>{
        User.populate(newPost,{path:"postedBy"})
        .then(neewPost=>{

            res.status(201).send(neewPost)})
            .catch(error=>{
                console.log(error);
        
            })
    })
    .catch(error=>{
        console.log(error);

    })
    
})


router.put('/api/posts/:id/likes',async(req,res)=>{
    const postid = req.params.id;

    const userid = req.session.user._id;

    const isLiked = req.session.user.likes && req.session.user.likes.includes(postid);
    
    const option =isLiked ? "$pull" : "$addToSet";

        


    req.session.user = await User.findByIdAndUpdate(userid, { [option]: { likes: postid } }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
    


    const postData =await Post.findByIdAndUpdate(postid ,{ [option] :{ likes: userid }},{new :true})
    .catch( error =>{
        console.log(error);
        res.sendStatus(400);
    })
  
    
    
    res.status(201).send(postData)
    
})


router.post('/api/posts/:id/retweet', async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.session.user._id;

    // Try and delete retweet
    const deletedPost = await Post.findOneAndDelete({ postedBy: userId, retweetData: postId })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    const option = deletedPost != null ? "$pull" : "$addToSet";

    const repost = deletedPost;

    if (repost == null) {
        const repost = await Post.create({ postedBy: userId, retweetData: postId })
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        })
    }

    // Insert user like
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { retweets: postId } }, { new: true })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    // Insert post like
    const post = await Post.findByIdAndUpdate(postId, { [option]: { retweetUsers: userId } }, { new: true })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })


    res.status(200).send(post)
})

router.delete("/api/posts/:id", (req, res, next) => {
    Post.findByIdAndDelete(req.params.id)
    .then(() => res.sendStatus(202))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})
async function getPosts(filter) {
    let results = await Post.find(filter)
    .populate("postedBy")
    .populate("retweetData")
    .populate("replyTo")
    .sort({ "createdAt": -1 })
    .catch(error => console.log(error))
     results =await User.populate(results, { path: "replyTo.postedBy"});
     
     results= await User.populate(results, { path: "retweetData.postedBy"});
    
     return results
    
}


module.exports=router
