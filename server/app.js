const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session")

//Route Imports
const userRouter = require("./routes/user");
const messageRouter= require("./routes/message");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment")

const app = express();
const port = process.env.PORT || 3000;

//Mongo Connection
mongoose.set("strictQuery", "false");
const mongoDB = process.env.MONGO_URI;

main().catch((err)=>console.log(err));
async function main(){
    await mongoose.connect(mongoDB);
}

//app.use(passport.initialize());
//app.use(passport.session());

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
