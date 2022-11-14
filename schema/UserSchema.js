const { MongooseModule } = require("@nestjs/mongoose");
const mongoose=require("mongoose");

const UserSchema =new mongoose.Schema({
    firstName: {
        type:String,
        trim:true,
        required:true 
    },
    lastName: {
        type:String,
        trim:true,
        required:true 
    },
    userName: {
        type:String,
        trim:true,
        required:true,
        unique:true 
    },
    email: {
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    password: {
        type:String,
        trim:true,
        required:true 
    },
    profilePic: {
        type:String,
        default: "./images/profilePic.png"
    }
},{timestamps:true})
const User =mongoose.model("User",UserSchema);

module.exports=User;