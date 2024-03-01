const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const ejs = require("ejs");
const path = require("path");
const { OtpModel } = require("../Models");
const ApiError = require("../utils/ApiError");

dotenv.config();

// SendMailWithTemplate("suraj@gmail.com", "suraj", 123456)
// RegisterOtp({ email: "surajsurajkumar@yopmail.com" });

const SendMailWithTemplate = async (mail, name, otp) => {
  try {
    // Construct the correct path to the email template file
    const templatePath = path.join(__dirname, "../views/EmailTemplate.ejs");

    const data = await ejs.renderFile(templatePath, {
      name,
      otp,
    });

    // console.log(data);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      // secure: true, // use SSL
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: mail,
      subject: "Email Verification",
      html: data,
    };
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent successfully:", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const RegisterOtp = async (emaildata) => {
  const character =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const characterLength = character.length;
  for (let i = 0; i < 6; i++) {
    result += character.charAt(Math.floor(Math.random() * characterLength));
  }
  console.log(result.slice(0, 6));

  const { email } = emaildata;
  const data = await OtpModel.create({
    otp: result,
    email,
  });
  console.log(data);
  return data;
};

const OtpVerification = async (otpdata) => {
  const { otp } = otpdata;

  const data = await OtpModel.findOne({ otp });

  data.isVerified = true;
  await data.save();

  return data;
};
// OtpVerification({ otp: " LAI9yz" });

// SendMailWithTemplate("surajsurajkumar@yopmail.com", "suraj", 123456);

module.exports = { SendMailWithTemplate, RegisterOtp, OtpVerification };
