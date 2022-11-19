const express=require('express');
const User = require('../schema/UserSchema');
const bcrypt =require("bcrypt")


const router=express.Router();


router.get('/login',(req,res)=>{
    res.render("login")
})

router.post("/login",async(req,res)=>{
    const payload =req.body
    if(req.body.logusername && req.body.logpassword){
        const user =await User.findOne({
            $or: [
                { userName:req.body.logusername },
                { email:req.body.email }
              ]
        })
       .catch((erorr)=>{r
            console.log(erorr);
            payload.erorrMassage="somting went find";
            res.status(200).render("login",payload)
        })
      
        if(user !=null){
            const result = await bcrypt.compare(req.body.logpassword, user.password)
            
            if(result == true){
                console.log(user);
                req.session.user=user;
                return res.redirect("/")
            }else{
                payload.erorrMassage="password is wrong";
                return res.status(200).render("login",payload)

            }
        }else{
            payload.erorrMassage="username is wrong";
            return res.status(200).render("login",payload)


        }
    }

})
module.exports=router