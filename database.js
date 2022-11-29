const mongoose=require('mongoose');
require('dotenv').config();
const DB =process.env.DB;
class database{
    constructor(){
        this.connect();
    }

    connect(){
        mongoose.connect(DB, { useNewUrlParser: false, useUnifiedTopology: false })
        .then(()=>{
                console.log("database connection seccussfull" );
        }).catch((err)=>{
        console.log("database connection " + err);
        })

    }
}
module.exports= new database();