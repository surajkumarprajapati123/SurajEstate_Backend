const express = require("express");
const User = require("../Models/User.model");
const auth = require("../Middleware/Auth");
const { UserController } = require("../controller");
const router = express.Router();

router.route("/signup").post(UserController.Register);
router.route("/login").post(UserController.loginuser);
router.route("/logout").post(UserController.logoutUser);
router.route("/all").get(auth, UserController.Alluser);
router.route("/update/:id").patch(auth, UserController.updateUser);
router.route("/delete/:id").delete(auth, UserController.DelteUser);
router.route("/get/:id").get(auth, UserController.getUser);
router.route("/getone/:id").get(UserController.GetListingformUser);
router.route("/otp").post(UserController.Verification);

module.exports = router;
