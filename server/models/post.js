const  mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    message:String,
    image:String, // idk if it should be a string or antoher thing but place holder for now
    likes:[{type:Schema.Types.ObjectId, ref:"User"}],
    author:{type:Schema.Types.ObjectId, ref:"User", required:true}
},{timestamps:true})

module.exports = mongoose.model("Post", PostSchema)
