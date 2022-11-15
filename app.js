const bodyParser = require('body-parser');
const express = require('express');
const app =express();
const middleware =require("./middleware");
const mongoose=require("./database.js");
const session =require("express-session")



app.use(express.urlencoded());

app.use(session({
    secret:"secretkey",
    resave: true,
    saveUninitialized: false,

}))

PORT =3000;

const server =app.listen(PORT,()=>console.log(`run server ${PORT}`))


app.set("view engine","pug");

app.set("views" ,"views");
app.use(express.static('public'));


//Routs

const loginrouts =require("./routes/loginroutes.js");
const registerrouts =require("./routes/registerroutes.js");
const database = require('./database');

app.use("/",loginrouts);
app.use("/",registerrouts);




app.get("/", middleware.requirelogin ,(req , res , next)=>{
    const payload={
        pagetitle:"home",
        userLogin: req.session.user
    }

    res.status(201).render("home",payload)
})
