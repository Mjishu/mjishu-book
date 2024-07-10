const User = require("../models/user");
const passport = require("passport");
require("dotenv").config();
const {body,validationResult} = require("express-validator");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const cloudinary = require("cloudinary").v2

exports.user_create = async(req,res)=> {
    try{
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password: req.body.password,
            details:{
                pfp:{
                    url: "",
                }
            }
        })
        await newUser.save();
        res.json({message:"success"})
    }catch(error){
        res.status(500).json({message: `error creating new user ${error}`})
    }
};

exports.find_all = async(req,res)=> {
    try{
        const foundUsers = await User.find({_id: {$ne:req.user._id}}).populate('followers following').exec()
        res.json(foundUsers)
    }catch(error){res.status(500).json({message:`Error fetching messages: ${error}`})}
};

exports.find_one = async(req,res)=>{
    const id = req.params.id
    try{
        const foundUser = await User.findById(id).populate("followers following").exec()
        res.json(foundUser)
    }catch(error){res.status(500).json({message:`error fetching user ${error}`})}
};

exports.user_update = async(req,res)=>{
    id = req.params.id;
    if(id != req.user._id){return res.status(500).json({message:"Wrong user"})}
    const user = await User.findById(id).exec();
    if(user.details.pfp.id){
        cloudinary.uploader.destroy(user.details.pfp.id, (error,result) => {
            console.log(result,error)
        })
    }

    const userData ={
        username: req.body.username,
        email:req.body.email,
        details:{
            pfp:{
                url:req.body.image.url,
                id:req.body.image.id
            },
            location: req.body.location,
            bio:req.body.bio
        },
    }
    await User.findByIdAndUpdate(req.params.id,userData)
    res.json({message:"success"})
};

exports.user_delete = async(req,res)=>{
    const id = req.params.id;
    try{
        const deletedUser = await User.findByIdAndDelete(id)

        if(!deletedUser){return res.status(404).json({message:`user not found!`})}

        res.json({message:`success`})
    }catch(error){res.status(500).json({message:`error deleting user ${error}`})}
};

exports.user_current = async(req,res) => { //if i need to populate, find User by req.user._id
    try{
        if(!req.user){
            return res.status(401).json({message:"none"})
        }
        res.json(req.user);
    }catch(error){res.status(500).json({message:`error fetching current user ${error}`})}
}

exports.user_sign_in = async(req,res,next)=>{
    try{
        passport.authenticate("local", (err,user,info) =>{ 
            if(err){
                console.log(err);
                const error = new Error(`Error trying to authenticate: ${err}`);
                return next(error);
            }
            if(!user){
                console.error(`Authentication failed! ${info.message}`);
                return res.status(401).json({message:info.message});
            }
            req.logIn(user,err => {
                if(err){
                    console.log(`there was an error logging in ${err}`);
                    return next(err)
                };
                res.json({message:"success",user:req.user})
            })
        })(req,res,next);
    }catch(error){
        res.status(500).json({message:`error trying to signin: ${error}`});
        return next(error)
    }
};

exports.user_sign_out = async(req,res,next)=>{
    try{
        req.logout(err =>{
            if(err){return next(err)};
            res.json({message:"success"})
        }) 
    }catch(error){
    res.status(500).json({message:`error logging out: ${error}`})}
};

exports.user_following = async(req,res)=>{ //issue where it adds to both follower and following if you follow a person
    const followerId = req.body.id;
    const followedId = req.params.id;
    console.log(followerId, followedId)
    try{
        const [follower,followed] = await Promise.all([
            User.findById(followerId),
            User.findById(followedId)
        ])

        if(!follower || !followed){return res.status(404).json({message:`user was not found`})}
        if(follower.following.includes(followedId)){return res.status(500).json({message:`you already follow this user`})}

        const [updatedFollower, updatedFollowed] = await Promise.all([
            User.findByIdAndUpdate(
                followerId,{$push : {following:followedId}}
            ),
            User.findByIdAndUpdate(
                followedId, {$push: {followers:followerId}}
            )
        ])
    
        if(!updatedFollower || !updatedFollowed){return res.status(404).json({message:`error updating users`})}
        res.json({message:"success"})
    }catch(error){res.status(500).json({message:`error following user: ${error}`})}
}

exports.user_unfollowing = async(req,res)=>{
    const followerId = req.body.id;
    const followedId = req.params.id;
    console.log(`Profile user: ${followerId} | CurrentUser: ${req.user._id}`)
    if(req.body.id != req.user._id){return res.status(500).json({message:"You dont seem to be the right user"})}
    try{
        const follower = await User.findById(followerId);

        if(!follower.following.includes(followedId)){return res.status(500).json({message: "You dont follow this person"})}

        const [updatedFollower, updatedFollowed] = await Promise.all([
            User.findByIdAndUpdate(
                followerId,{$pull : {following:followedId}}
            ),
            User.findByIdAndUpdate(
                followedId, {$pull: {followers:followerId}}
            )
        ])
    
        if(!updatedFollower || !updatedFollowed){return res.status(404).json({message:`error updating users`})}
        res.json({message:"success"})
    }catch(error){
        res.status(500).json({message:`there was an error with following :${error}`})
    }
}

