const Comment = require("../models/comment");
const {ObjectId} = require("mongodb")

exports.comment_create = async(req,res) => {
    const postid = new ObjectId(req.params.postid)
    try{
        if(req.user._id != req.body.id){return res.status(404).json({message:`not the right user?`})}
        const newComment = new Comment({
            message:req.body.message,
            author:req.body.id,
            post:postid
        })
        await newComment.save();
        res.json({message:"success"})
    }
    catch(error){res.status(500).json({message:`there was an error creating a comment: ${error}`})}
};

exports.comment_update = async(req,res) => {
    try{
        if(req.user._id != req.body.id){return res.status(404).json({message:`not the right user?`})}
        const newComment = {
            message: req.body.message,
        }
        const updatedComment = await Comment.findByIdAndUpdate(req.params.id);

        if(!updatedComment){return res.status(404).json({message:`comment was not found`})}
    }
    catch(error){res.status(500).json({message:`there was an error creating a comment: ${error}`})}
};

exports.comment_delete = async(req,res) => {
    try{
        if(req.user._id != req.body.id){return res.status(404).json({message:`not the right user?`})}
        const deletedComment = await Comment.findByIdAndDelete(req.params.id)

        if(!deletedComment){return res.status(404).json({message: `comment was not found`})}
    }
    catch(error){res.status(500).json({message:`there was an error creating a comment: ${error}`})}
};

exports.find_comments = async(req,res) =>{ //returns an error? maybe client side?
    postId = req.params.postid
    try{
        const foundComments = await Comment.find({post:postId}).populate("author").exec()//says author not in schema

        if(!foundComments){return res.status(404).json({message:`comments not found`})}

        res.json(foundComments)
    }
    catch(error){res.status(500).json({message:`there was an error creating a comment: ${error}`})}
};
