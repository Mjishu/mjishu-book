const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const bcrypt = require("bcrypt")


const app = express();
const port = process.env.PORT || 3000;

//Mongo Connection
mongoose.set("strictQuery", "false");
const mongoDB = process.env.MONGO_URI;

main().catch((err)=>console.log(err));
async function main(){
    await mongoose.connect(mongoDB);
}

app.use(session({
        secret: process.env.SECRET_KEY, 
        resave:false, 
        saveUninitialized:false, 
        store: MongoStore.create({mongoUrl: process.env.MONGO_URI
    })}))
app.use(passport.initialize());
app.use(passport.session());

//Cors
const allowedOrigins = [
    "http://localhost:3000"
]
const corsOptions = {
    origin:allowedOrigins,
    credentials:true,
    optionSuccessStatus:200
}

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Authentication
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, done) => {
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return done(null, false, { message: "Incorrect username" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user,done)=>{
    done(null,user.id)
})

passport.deserializeUser(async (id,done)=>{
    try{
        const user = await User.findById(id);
        done(null,user);
  }catch(err){done(err)}
})

//Route Imports
const userRouter = require("./routes/user");
const messageRouter= require("./routes/message");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment")

//Calls routers
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);
app.use("/api/comments", commentRouter);
app.use("/api/post", postRouter);

//Error Handling
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
});

//Export
app.listen(port, () => { 
    console.log(`Listening on port ${port}`)
})
