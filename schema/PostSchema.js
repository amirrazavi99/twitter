const mongoose= require("mongoose");

const PostSchema =new mongoose.Schema({
    content: {
        type: String,
 
    },
    postedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    pinned:{
        type:Boolean
    },
    likes:[{
        type: mongoose.Types.ObjectId,
        ref: "User",
    }],
    retweetUsers:[{
        type: mongoose.Types.ObjectId,
        ref: "User",
    }],
    retweetData:{
        type: mongoose.Types.ObjectId,
        ref: "Post",
    },
    replyTo:{
        type: mongoose.Types.ObjectId,
        ref: "Post",
    }

},
{timestamps:true})
const Post =mongoose.model("Post",PostSchema);

module.exports=Post;