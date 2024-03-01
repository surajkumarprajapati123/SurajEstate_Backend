const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../Models");
require("dotenv").config();
const google = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res.cookie("token", token, { httpOnly: true }).status(200).json(rest);
    } else {
      const generatePassword = Math.random().toString(36).slice(-8);
      const hashPassword = await bcrypt.hash(generatePassword, 10);
      const username = req.body.name
        ? req.body.name.split(" ").join("")
        : "suraj" + Math.random().toString(36).slice(-4);
      const newUser = new UserModel({
        username,
        email: req.body.email,
        password: hashPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("token", token, { httpOnly: true })
        .status(200)
        .json({ ...rest });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { google };
