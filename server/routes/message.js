const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");

router.post("/create", messageController.message_create);

//user messages
router.get("/find/user/:userid", messageController.find_user_messages);

router.get("/all", messageController.find_all)

router.get("/find/:id", messageController.message_open)

router.post("/find/:id/update", messageController.message_add)

router.delete("/find/:id/delete", messageController.message_delete)

module.exports = router
