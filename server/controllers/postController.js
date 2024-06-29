const Post = require("../models/post");

exports.create_post = async(req,res)=>{
    res.json({message:"Creating post"})
};

exports.update_post = async(req,res)=>{
    res.json({message:"updating post"})
};

exports.find_one = async(req,res)=>{
    res.json({message: "finding one post"})
};

exports.find_all = async(req,res) => {
    res.json({message:"finding all posts"})
};

exports.delete_post = async(req,res)=>{
    res.json({message:"deleting a post"})
};

exports.current_user_posts = async(req,res) => {
    res.json({message:"finding the messages of the current logged in user"})
};

