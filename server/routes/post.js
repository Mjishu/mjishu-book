const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");

router.post("/create", postController.post_create);

router.get("/find/:userid", postController.current_user_posts);

router.get("find/:id", postController.find_one);

router.get("/all", postController.find_all);

router.put("/:id/update",postController.post_update);

router.delete("/:id/delete", postController.post_delete);

module.exports = router;
