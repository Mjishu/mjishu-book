const User = require("../models/user");
const passport = require("passport");
require("dotenv").config();
const {body,validationResult} = require("express-validator");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
exports.user_create = async(req,res)=> {
    try{
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password: req.body.password
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
    const userData ={
        username: req.body.username,
        email:req.body.email
    }
    await User.findByIdAndUpdate(req.params.id,userData)
    res.json({message:"success"})
};

exports.user_delete = async(req,res)=>{
    const id = req.params.id;
    try{
        await User.findByIdAndDelete(id)
    }catch(error){res.status(500).json({message:`error deleting user ${error}`})}
};

exports.user_current = async(req,res) => {
    try{
        if(!req.user){
            return res.status(401).json({message:"none"})
        }
        res.json(req.user);
    }catch(error){res.status(500).json({message:`error fetching current user ${error}`})}
}

exports.user_sign_in = async(req,res,next)=>{
    try{
        passport.authenticate("local", (err,user,info) =>{ //i dont think its making the call?
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
