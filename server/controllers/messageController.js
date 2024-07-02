const Message = require("../models/message");
const {ObjectId } = require("mongodb")

exports.message_create = async(req,res)=>{
    try{
        const newMessage = new Message({
            users:[req.user._id, req.body.id]
    })
        await newMessage.save()
        res.json({message:"success",id:newMessage._id})
    }catch(error){res.status(500).json({message:`there was an error creating message: ${error}`})}
};

exports.find_user_messages = async(req,res)=>{
    const id = req.params.userid;
    try{
        const foundMessages = await Message.find({users:id}).populate("users").exec();
        res.json(foundMessages);
    }catch(error){res.status(500).json({message:`error finding messages ${error}`})}
};

exports.find_all = async(req,res) =>{ //idk if i need this one because it doesnt make sense to get every message
    res.json({message: "finding all messages"})
};

exports.message_delete = async(req,res)=>{
    const id = req.params.id
    try{
        Message.findByIdAndDelete(id);
        res.json({message:"success"})
    }catch(err){res.status(500).json({message:`error deleting message: ${err}`})}
};

exports.message_add = async(req,res)=>{
    const id = req.params.id;
    const author = new ObjectId(req.body.author);
    try{
        const newMessage ={author: author, timestamp: Date.now(), message:req.body.message};

        const updatedMessage = await Message.updateOne({_id:id}, {$push :{body:newMessage}});

        if(updatedMessage.matchCount === 0){
            throw new Error(`no matching message was found`)
        };
        res.json({message:"success"})
    }catch(err){res.status(500).json({message:`error adding message: ${err}`})}
};

exports.message_open = async(req,res)=>{
    const id = req.params.id;
    try{
        const messageFound = await Message.findById(id).populate("users body.author");

        if(!messageFound){res.status(400).json({message: `Message does not exist`})}

        res.json(messageFound)
    }catch(err){res.status(500).json({message:`error opening message ${err}`})}
}

