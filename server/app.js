const createError = require('http-errors');
const path = require('path');
const http = require("http");
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
const GithubStrategy = require("passport-github2").Strategy;

const User = require("./models/user");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const Multer = require("multer");

//websocket
const {WebSocketServer} = require("ws");
const uuidv4 = require("uuid").v4

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const wsServer = new WebSocketServer({server, path:"/api/message/current-updates"})

//Mongo Connection
mongoose.set("strictQuery", "false");
let mongoDB = process.env.MONGO_URI;
let mongoUrl = process.env.MONGO_URI
if(process.env.NODE_ENV === "production"){
    mongoDB = process.env.MONGO_PROD
    mongoUrl = process.env.MONGO_PROD
}

main().catch((err)=>console.log(err));
async function main(){
    await mongoose.connect(mongoDB);
}

//cloudinary connection
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key_cloud,
    api_secret: process.env.api_secret_cloud,
    secure:true //this might make it not work bc rn its http
})

app.use(session({
    secret: process.env.SECRET_KEY, 
    resave:false, 
    saveUninitialized:false, 
    store: MongoStore.create({mongoUrl: mongoUrl
    })}))
app.use(passport.initialize());
app.use(passport.session());

//Cors
const allowedOrigins = [
    process.env.frontend_link,"http://localhost:5173"
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

//WebSocket
const url = require("url");
const Message = require("./models/message")
const connections = {};
const users = {};

async function handleMessage(bytes,  uuid){ //should return postFOund
    try{
        const message = JSON.parse(bytes.toString());
        console.log("recieved message: ",message)

        const user = users[uuid]
        const messageFound = await Message.findById(message.messageid).populate("users body.author")
        if(messageFound){
            users[uuid].currentMessageId = message.messageid
            return messageFound}
        else{
            console.log(`message not found for ${message.messageid}`);
            return null
        }
        }
    catch(error){
        console.error(`error handling message: ${error}`)
        return null}
}
function handleClose(uuid){
    console.log(`${uuid} has left`)
    delete connections[uuid]
    delete users[uuid]
}
function broadcastMessage(messageData){
    /*Object.values(connections).forEach(connection =>{
        connection.send(JSON.stringify({messageData})) //only send this to users who are in messageData.users
    })*/
    const relevantUsers = messageData.users.map(user => user.username)//sends users who are in chat

    Object.entries(connections).forEach(([uuid,connection]) =>{
        if(relevantUsers.includes(users[uuid].username)){
            connection.send(JSON.stringify({messageData})) //only send this to users who are in messageData.users
        }
    })
}

//how to get real time updates ?
    wsServer.on("connection",async(connection,request) => {
        const uuid = uuidv4();
        const {username,messageid} = url.parse(request.url,true).query
        const changeStream = Message.watch();

        changeStream.on("change", async(change) => { //look at obsidian
            if(change.documentKey._id.toString() === messageid){
                const updatedMessage = await Message.findById(messageid).populate("users body.author");
                if(updatedMessage){broadcastMessage(updatedMessage)}
                else{console.log("message doesnt exist")}
            }
        })

        connections[uuid] = connection;

        users[uuid]= { //idk what to have here? maybe make a query that sends currentUser.username?
            username:username, 
            currentMessageId:messageid
        }
        connection.on("message", async(message) => {
            const messageReturn = await handleMessage(message,uuid)
            if(messageReturn){ 
                connection.send(JSON.stringify({messageData:messageReturn}))
            }
        })
        connection.on("close", () => handleClose(uuid) )
    })

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

passport.use(new GithubStrategy({
    clientID :process.env.GITHUB_CLIENT_ID,
    clientSecret:process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `http://localhost:3000/api/user/github/callback`
},
    function(accessToken,refreshToken,profile,done){

        done(null,profile)
    }
))

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

//api router
app.get("/api/uploadform", async(req,res)=>{
    res.json(cloudinary.config())
})

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
server.listen(port, () => { 
    console.log(`Listening on port ${port}`)
})

