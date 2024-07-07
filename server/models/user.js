const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username:{type:String, required:true},
    password: {type:String, required:true},
    email: {type:String, required: true},
    followers: [{type:Schema.Types.ObjectId, ref:"User"}],
    following: [{type:Schema.Types.ObjectId, ref:"User"}],
    details:{
        pfp: String,
        bio: String,
        location: String,
    }
})

UserSchema.pre("save", async function(next){
    const user = this;
    const hash = await bcrypt.hash(this.password,10);
    this.password = hash;
    next()
})

UserSchema.methods.isValidPassword = async function(password){
    const user = this;
    const compare = await bcrypt.comapre(password,user.password);
    return compare;
}

module.exports = mongoose.model("User", UserSchema);
