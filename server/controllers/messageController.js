const Message = require("../models/message");

exports.message_create = async(req,res)=>{
    try{
    const newMessage = new Message({
        author: req.user._id,
        recipient: req.body.id,
    })
        await newMessage.save()
        res.json({message:"success"})
    }catch(error){res.status(500).json({message:`there was an error creating message: ${error}`})}
};

exports.find_user_messages = async(req,res)=>{
    const id = req.params.userid;
    const foundMessages = await Message.find({
        $or:[{author:id},{recipient:id}]
    }).populate("author recipient").exec();
    res.json(foundMessages);
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
    const id = req.body.id;
    const author = new ObjectId(req.body.author);
    try{
        const newMessage ={author: author, timestamp: Date.now(), message:req.body.message};
        console.log(newMessage);

        const updatedMessage = Message.updateOne({_id:id}, {$push :{body:newMessage}});

        if(updatedMessage.matchCount === 0){
            throw new Error(`no matching message was found`)
        };
        res.json({message:"success"})
    }catch(err){res.status(500).json({message:`error adding message: ${err}`})}
};

exports.message_open = async(req,res)=>{
    const id = req.body.id;
    try{
        const messageFound = Message.findyById(id).populate("author recipient body.author");

        if(!messageFound){res.status(400).json({message: `Message does not exist`})}

        res.json(messageFound)
    }catch(err){res.status(500).json({message:`error opening message ${err}`})}
}

