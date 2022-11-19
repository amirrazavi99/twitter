const express=require('express');
const Post = require('../../schema/PostSchema');
const { populate } = require('../../schema/UserSchema');
const User = require('../../schema/UserSchema');

const router=express.Router();

router.get('/api/posts',(req,res)=>{
    Post.find()
    .populate("postedBy")
    .sort({"createdAt":-1})
    .then((results)=>{
        res.status(200).send(results)
    })
    .catch((error)=>{
        console.log(error);
        res.sendStatus(400);
    })

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

    req.session.user =await User.findByIdAndUpdate(userid ,{ [option] :{likes:postid}},{new :true})
    .catch((error)=>{
        console.log(error);
        res.sendStatus(400);
    })


    const postData =await Post.findByIdAndUpdate(postid ,{ [option] :{likes:userid}},{new :true})
    .catch((error)=>{
        console.log(error);
        res.sendStatus(400);
    })
  
    console.log(postData);
    
    res.status(201).send(postData)
    
})



module.exports=router