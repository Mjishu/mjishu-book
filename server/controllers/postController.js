const Post = require("../models/post");
const cloudinary = require("cloudinary").v2
const Comment = require("../models/comment")

exports.post_create = async(req,res)=>{
    const newPost = new Post({
        author:req.user._id,
        message: req.body.message,
        image:{
            url: req.body.image.url,
            id:req.body.image.id
        }
    })
    await newPost.save();
    res.json({message:"success"})
};

exports.post_update = async(req,res)=>{
    //should find current post, update teh image url, and then delete the image from cloudinary
    const post = await Post.findById(req.params.id).exec();
    if(post.image.id){
        cloudinary.uploader.destroy(post.image.id, (error,result) => {
            console.log(result,error)
        })
    }
    const postDetails = {
        message:req.body.message, 
        image:{
            url: req.body.image.url,
            id:req.body.image.id
        },
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
    const postFound = await Post.findById(id).exec();
    const commentsWithId = await Comment.deleteMany({post:id});
    
    if(postFound.image.id){
        cloudinary.uploader.destroy(postFound.image.id, (error,result) => {
            console.log(result,error)
        })
    }

   await Post.findByIdAndDelete(id)

    res.json({message:"success"})
};

exports.current_user_posts = async(req,res) => {
    const userId = req.params.id;
    const userPosts = await Post.find({author:userId}).populate("author likes").exec();
    res.json(userPosts);
};

exports.post_like = async(req,res)=>{
    const postId = req.params.id;
    let id;
    if(req.user._id == req.body.id){ id = req.body.id}
    else{return res.status(400).json({message:"failed"})}
    try{ //check if id is already in likes
        const post = await Post.findById(postId);

        if(!post){return res.status(404).json({message:"no post found"})};

        if(post.likes.includes(id)){return res.json({message:"you have already liked this post"})}

        const updatedPost = await Post.updateOne({_id:postId},{$push:{likes:id}})

        if(updatedPost.matchCount ===0){throw new Error("no matching message was found")}

        res.json({message:"success"})
    }catch(error){res.status(500).json({message: `error liking post: ${error}`})}
}

exports.post_unlike = async(req,res) => {
    const postId = req.params.id;
    let id;
    //console.log(`type of req.user ${typeof req.user._id}`)//object
    //console.log(`type of body user ${typeof req.body.id}`)//string
    if(req.user._id == req.body.id){id = req.body.id}
    else{return res.status(400).json({message:"failed"})}
    try{
        const post = await Post.findById(postId);

        if(!post){return res.status(404).json({message:"no post found"})};

        if(!post.likes.includes(id)){return res.json({message: "already unliked"})}

        const updatedPost = await Post.updateOne({_id:postId}, {$pull:{likes:id}})

        if(updatedPost.modifiedCount === 0 ){return res.status(404).json({message:"No match was found"})}
        res.json({message:"success"})
    }catch(error){res.status(500).json({message:"error unliking message"})}
}
