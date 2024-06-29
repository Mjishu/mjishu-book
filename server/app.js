const express = require("express");
require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
