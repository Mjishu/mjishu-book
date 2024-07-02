const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    users: [{type:Schema.Types.ObjectId, ref:"User", required:true}],
    body: [{
        author: {type:Schema.Types.ObjectId, ref:"User", required:true},
        timestamp:{type:Date, default: Date.now()},
        message:{type:String ,required:true}
    }]
},{timestamps:true})

module.exports = mongoose.model("Message", MessageSchema);
