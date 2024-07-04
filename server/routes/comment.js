const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");

router.post("/create/:postid", commentController.comment_create);

router.get("/find/post/:postid", commentController.find_comments);

router.put("/find/:id/update", commentController.comment_update);

router.delete("/find/:id/delete", commentController.comment_delete);

module.exports = router;
