const Comment = require("../models/message");

exports.comment_create = async(req,res) => {
    res.json({message: "creating a comment"})
};

exports.comment_update = async(req,res) => {
    res.json({message: "updating the comment"})
};

exports.comment_delete = async(req,res) => {
    res.json({message: "deleting a comment"})
};

exports.find_comments = async(req,res) =>{
    res.json({message: "finding all comments in a post"})
};
