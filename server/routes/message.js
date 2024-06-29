const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");

router.post("/create", messageController.message_create);

router.get("/find/:userid", messageController.find_user_messages);

router.get("/all", messageController.find_all)

router.get("/:id", messageController.message_open)

router.post("/:id/update", messageController.message_add)

router.delete("/:id/delete", messageController.message_delete)

module.exports = router
