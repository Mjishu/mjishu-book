const Message = require("../models/message");

exports.message_create = async(req,res)=>{
    res.json({message:"creating a message"})
};

exports.find_user_messages = async(req,res)=>{
    res.json({message: "finding a certain message"})
};

exports.find_all = async(req,res) =>{ //idk if i need this one because it doesnt make sense to get every message
    res.json({message: "finding all messages"})
};

exports.message_delete = async(req,res)=>{
    res.json({message:"deleting a message"})
};

exports.message_add = async(req,res)=>{
    res.json({message: "adding to the messages in message.body"})
};

exports.message_open = async(req,res)=>{
    res.json({message:"opening a message"})
}

