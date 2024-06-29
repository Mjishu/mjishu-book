const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    auhor: {type:Schema.Types.ObjectId, ref:"User", required:true},
    message: {type:String, required:true},
},{timestamps:true});

module.exports = mongoose.model("Comment", CommentSchema)
