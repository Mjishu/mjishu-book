const Post = require("../models/post");

exports.post_create = async(req,res)=>{
    const newPost = new Post({
        author:req.user._id,
        message: req.body.message,
        image: req.body.image || ""
    })
    await newPost.save();
    console.log(newPost);
    res.json({message:"success"})
};

exports.post_update = async(req,res)=>{
    res.json({message:"updating post"})
};

exports.find_one = async(req,res)=>{
    res.json({message: "finding one post"})
};

exports.find_all = async(req,res) => {
    res.json({message:"finding all posts"})
};

exports.post_delete = async(req,res)=>{
    res.json({message:"deleting a post"})
};

exports.current_user_posts = async(req,res) => {
    res.json({message:"finding the messages of the current logged in user"})
};
