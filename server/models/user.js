const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const sha256 = require("js-sha256");

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

    const address = String(user.email).trim().toLowerCase();
    const emailHash = sha256(address)

    const hash = await bcrypt.hash(this.password,10);
    this.password = hash;

    this.details.pfp.url = `https://www.gravatar.com/avatar/${emailHash}`; //this doesnt show email profile? just random logo
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
