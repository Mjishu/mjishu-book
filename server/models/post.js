const  mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    message:String,
    image:{
        url:{type:String},
        id:{type:String}
    },
    likes:[{type:Schema.Types.ObjectId, ref:"User"}],
    author:{type:Schema.Types.ObjectId, ref:"User", required:true}
},{timestamps:true})

module.exports = mongoose.model("Post", PostSchema)
