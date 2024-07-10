const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username:{type:String, required:true},
    password: {type:String},
    email: {type:String},
    followers: [{type:Schema.Types.ObjectId, ref:"User"}],
    following: [{type:Schema.Types.ObjectId, ref:"User"}],
    details:{
        pfp: {
            url:String,
            id:String
        },
        bio: String,
        location: String,
    },
    ids:{
        githubId: String
    }
    
})

UserSchema.pre("save", async function(next){
    const user = this;
    
    if(user.ids && user.ids.githubId){
        return next()
    }

    const hash = await bcrypt.hash(this.password,10);
    this.password = hash;
    next()
})

UserSchema.methods.isValidPassword = async function(password){
    const user = this;

    if(user.ids && user.ids.githubId){
        return false
    }

    if(user.password){
    const compare = await bcrypt.comapre(password,user.password);
    return compare;}

    return false
}

module.exports = mongoose.model("User", UserSchema);
