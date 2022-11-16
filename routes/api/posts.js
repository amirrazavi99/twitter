const express=require('express');
const Post = require('../../schema/PostSchema');
const User = require('../../schema/UserSchema');

const router=express.Router();

router.get('/api/posts',(req,res)=>{

})


router.post('/api/posts',(req,res)=>{

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
        
         res.status(201).send(newPost)
    })
    .catch(error=>{
        console.log(error);

    })
    
})




module.exports=router