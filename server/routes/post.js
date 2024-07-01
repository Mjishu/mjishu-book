const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");

router.post("/create", postController.post_create);

router.get("/find/user/:id", postController.current_user_posts);

router.get("/find/:id", postController.find_one);

router.get("/all", postController.find_all);

router.put("/find/:id/update",postController.post_update);

router.delete("/find/:id/delete", postController.post_delete);

module.exports = router;
