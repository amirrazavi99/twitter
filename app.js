const bodyParser = require('body-parser');
const express = require('express');
const app =express();
const middleware =require("./middleware");
const mongoose=require("./database.js");
const session =require("express-session")
require('dotenv').config();



app.use(express.urlencoded());

app.use(session({
    secret:"secretkey",
    resave: true,
    saveUninitialized: false,

}))

PORT =process.env.PORT

const server =app.listen(PORT,()=>console.log(`run server ${PORT}`))


app.set("view engine","pug");

app.set("views" ,"views");
app.use(express.static('public'));


//Routs

const loginrouts =require("./routes/loginroutes.js");
const registerrouts =require("./routes/registerroutes.js");
const logoutrouts =require("./routes/logout.js");
const postPagerouts =require("./routes/postroutes.js");

//api posts


const postrouts =require("./routes/api/posts.js");

//connect datbase
const database = require('./database');

app.use("/",loginrouts);
app.use("/",registerrouts);
app.use("/",logoutrouts);
app.use("/",postrouts);
app.use("/", middleware.requirelogin ,postPagerouts);





app.get("/", middleware.requirelogin ,(req , res , next)=>{
    const payload={
        pagetitle:"Home",
        userLoggedIn: req.session.user,
        userLoggedInreq: JSON.stringify(req.session.user)
    }

    res.status(201).render("home",payload)
})
