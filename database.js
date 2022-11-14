const mongoose=require('mongoose');
const DB ="mongodb://localhost:27017";
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