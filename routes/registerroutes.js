const express=require('express');
const User=require('../schema/UserSchema')


const router=express.Router();


router.get('/register',(req,res)=>{
  
    res.render("register")
})

router.post('/register',async(req,res)=>{

    const firstname =req.body.firstName;
    const lastname =req.body.lastName;
    const username =req.body.userName;
    const email =req.body.email;
    const password =req.body.password;

    const payload =req.body

    if(firstname && lastname && username && email && password){
        const user =await User.findOne({
            $or :[
            {email :email},
            {userName : username}
        ]})
        .catch((error)=>{
            console.log(error);
            error.errorMassage="something not wrong";
            res.render("register",payload);
        })

        if(user== null){

            const data =req.body;

            User.create(data)
            .then((createuser)=>{
                console.log(createuser);
            })
        }else{
            if(email==user.email){
                console.log("email");
            }else{
                console.log("paswordusername");
            }
        }
   

    }else{
        payload.errorMassage="make sure each fied has value"
        res.status(200).render("register",payload)
    }
 
})
module.exports=router