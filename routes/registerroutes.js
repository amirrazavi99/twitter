const express=require('express');



const router=express.Router();


router.get('/register',(req,res)=>{
  
    res.render("register")
})

router.post('/register',(req,res)=>{

    const firstname =req.body.firstname.trim();
    const lastname =req.body.lastname.trim();
    const username =req.body.username.trim();
    const email =req.body.email.trim();
    const password =req.body.password.trim();

    const payload =req.body

    if(firstname && lastname && username && email && password){

    }else{
        payload.errorMassage="make sure each fied has value"
        res.status(200).render("register",payload)
    }
 
})
module.exports=router