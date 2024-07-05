const mongoose = require("mongoose");

const Schema = mongoose.Schema; //this isnt being created in the db for some reeason

const CommentSchema = new Schema({
    author:{type:Schema.Types.ObjectId, ref:"User", required:true},
    message:{type:String, required:true},
    post:{type:Schema.Types.ObjectId, ref:"Post", required:true}
},{timestamps:true});

module.exports = mongoose.model("Comment", CommentSchema)
