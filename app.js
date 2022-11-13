const express = require('express');
const app =express();
const middleware =require("./middleware");
PORT =3000;

const server =app.listen(PORT,()=>console.log(`run server ${PORT}`))


app.set("view engine","pug");

app.set("views" ,"views");
app.use(express.static('public'));


//Routs

const loginrouts =require("./routes/loginroutes.js");

app.use("/",loginrouts);
const payload={
    pagetitle:"home"
}
app.get("/",middleware.requirelogin,(req,res,next)=>{
    res.status(201).render("home",payload)
})