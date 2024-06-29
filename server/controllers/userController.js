const User = require("../models/user");
const passport = require("passport");
require("dotenv").config();

exports.user_create = async(req,res)=> {
    res.json({message:"Creating user"})
};

exports.find_all = async(req,res)=> {
    res.json({message: "finding all users"})
};

exports.find_one = async(req,res)=>{
    res.json({message: "finding one user"})
};

exports.user_update = async(req,res)=>{
    res.json({message:"updating a user"})
};

exports.user_delete = async(req,res)=>{
    res.json({message:"deleting a user"})
};

exports.user_current = async(req,res) => {
    res.json({message:"finding current user"})
}

exports.user_sign_in = async(req,res,next)=>{
    res.json({message:"signing in"})
};

exports.user_sign_out = async(req,res,next)=>{
    res.json({message:"signing a user out"})
};
