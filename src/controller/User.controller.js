const { UserModel, ListingModel, OtpModel } = require("../Models");
const { UserService, EmailService } = require("../Service");
const {
  SendMailWithTemplate,
  OtpVerification,
} = require("../Service/Email.service");
const ApiError = require("../utils/ApiError");
const ApiResponce = require("../utils/ApiResponce");
const CatchAsyc = require("../utils/catchAsync");
const bcrypt = require("bcrypt");

const Register = CatchAsyc(async (req, res) => {
  try {
    const { email } = req.body;
    // Create user
    const response = await UserService.CreateUser(req.body);
    const username = response.username;

    // Create OTP and send email
    const otpData = await EmailService.RegisterOtp({ email });
    const otp = otpData.otp;
    await SendMailWithTemplate(email, username, otp);

    // If OTP is valid, respond with user data
    const responseData = response.toObject();
    delete responseData.password;
    res.json(responseData);
  } catch (error) {
    // If OTP verification fails or any other error occurs, handle it
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

// const Verification = CatchAsyc(async (req, res) => {
//   const { otp } = req.body;
//   if (!otp) {
//     return res.status(400).json({ error: "Otp is Required" });
//   }

//   const response = await EmailService.OtpVerification({ otp });
//   console.log({ response });
//   if (!response) {
//     return res.status.json({ error: "Invalid Otp" });
//   }
//   console.log({ response });
//   res.json({ message: "Otp is verified" });
// });

const Verification = CatchAsyc(async (req, res) => {
  try {
    const { otp } = req.body;

    // Check if OTP is provided
    if (!otp) {
      return res.status(400).json({ error: "Otp is Required" });
    }

    // Perform OTP verification
    const response = await EmailService.OtpVerification({ otp });

    // Check if OTP verification succeeded
    if (!response) {
      return res.status(400).json({ error: "Invalid Otp" });
    }

    // If OTP verification succeeded, return success message
    res.json({ message: "Otp is verified" });
  } catch (error) {
    console.error(error);

    // Handle other errors
    res.status(500).json({ error: "provide valid otp" });
  }
});

const loginuser = CatchAsyc(async (req, res) => {
  try {
    // Extract email from request body
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is Required" });
    }

    const userData = await OtpModel.findOne({ email });

    console.log({ userData });
    // Check if user data is found
    if (!userData) {
      // Return error response if user is not found
      return res.status(404).json({ error: "This email is not  verified" });
    }

    // Check if email is verified
    if (!userData.isVerified) {
      // Return error response if email is not verified
      return res
        .status(403)
        .json({ error: "Email is not verified. Please verify your email" });
    }

    // Proceed with login if email is verified
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: "Password is Required" });
    }

    const response = await UserService.loginuser(req.body);
    const token = response.generateToken();

    // Set token in cookie and send user data in response
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      })
      .json(response);
  } catch (error) {
    console.error(error);

    // // Handle other errors
    // res.status(500).json({ error: "Internal Server Error" });
  }
});

const logoutUser = CatchAsyc(async (req, res) => {
  res.clearCookie("token").status(200).json({
    success: true,
    message: "User Logout Successfully",
  });
});

const Alluser = CatchAsyc(async (req, res) => {
  const responce = await UserService.Alluserlisting();
  res.json(responce);
});

const updateUser = CatchAsyc(async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(new ApiError(401, "You can only update your own account!"));

  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
      },
    },
    { new: true }
  );

  const { password, ...rest } = updatedUser._doc;

  res.status(200).json(rest);
});

const DelteUser = CatchAsyc(async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(new ApiError(401, "You can only Delete your own account!"));

  const responce = await UserService.deleteUser(req.params.id);

  // .cookie("token", "", {
  //   maxAge: 1,
  //   httpOnly: true,
  // })
  res.clearCookie("token").json(responce);
});

const GetListingformUser = CatchAsyc(async (req, res) => {
  const data = await UserService.GetListing(req.params.id);
  res.json(data);
});

const getUser = CatchAsyc(async (req, res) => {
  const data = await UserService.GetUser(req.params.id);
  res.json(data);
});

module.exports = {
  DelteUser,
  Register,
  loginuser,
  logoutUser,
  Alluser,
  updateUser,
  getUser,
  GetListingformUser,
  Verification,
};
