const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please Enter a username"],
    },
    email: {
      type: String,
      required: [true, "Please Enter a email"],
      // trim: true,
      // match: [
      //   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      //   "Please Enter a valid Email",
      // ],
    },
    password: {
      type: String,
      required: [true, "Please Enter a password"],
      minlength: [6, "Minimum password length is 6 characters"],
    },
    otp: {
      type: String,
    },
    avatar: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    phone: {
      type: String,
      default: "+91",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    const hashedPassword = await bcrypt.hash(this.password, 10);

    this.password = hashedPassword;

    next();
  } catch (error) {
    next(error);
  }
});
UserSchema.methods.isPasswordCorrect = async function (password) {
  try {
    const isCorrect = await bcrypt.compare(password, this.password);
    console.log({ isCorrect });
    return isCorrect;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
};

UserSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
