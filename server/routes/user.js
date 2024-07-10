const express = require("express");
const router = express.Router();
const passport = require("passport")

const userController = require("../controllers/userController");

//need to add one for login

router.post("/create", userController.user_create);

router.get("/current", userController.user_current);

router.get("/find", userController.find_all);

router.get("/find/:id", userController.find_one);

router.put("/find/:id/update", userController.user_update);

router.delete("/find/:id/delete", userController.user_delete);

router.post("/sign-in", userController.user_sign_in);

router.get("/logout", userController.user_sign_out);

router.post("/find/:id/follow", userController.user_following);

router.post("/find/:id/unfollow", userController.user_unfollowing)

//github
router.get("/github", userController.githubAuth);

router.get("/github/callback",
    userController.githubAuthCallback,
    userController.githubCallback
)

module.exports = router;
