const Post = require("../models/post");

exports.post_create = async(req,res)=>{
    const newPost = new Post({
        author:req.user._id,
        message: req.body.message,
        image: req.body.image
    })
    await newPost.save();
    res.json({message:"success"})
};

exports.post_update = async(req,res)=>{
    const postDetails = {
        message:req.body.message, 
        image:req.body.image,
    }
    const updatedPost = await Post.findByIdAndUpdate(req.params.id,postDetails);
    res.json({message:"success"})
};

exports.find_one = async(req,res)=>{
    const id = req.params.id;
    const postFound = await Post.findById(id).populate("author likes").exec();
    res.json(postFound)
};

exports.find_all = async(req,res) => {
    const allPosts = await Post.find({}).populate("author likes").exec();
    res.json(allPosts);
};

exports.post_delete = async(req,res)=>{
    const id = req.params.id;
    await Post.findByIdAndDelete(id)
    res.json({message:"success"})
};

exports.current_user_posts = async(req,res) => {
    const userId = req.params.id;
    const userPosts = await Post.find({author:userId}).populate("author likes").exec();
    res.json(userPosts);
};
