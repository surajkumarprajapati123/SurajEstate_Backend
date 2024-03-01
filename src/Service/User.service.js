const { UserModel, ListingModel } = require("../Models");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcrypt");

const CreateUser = async (userbody) => {
  const { username, email, password } = userbody;
  if (!username && !email && !password) {
    throw new ApiError(404, "username,email and password is required");
  }
  if (!username) {
    throw new ApiError(404, "username is required");
  }
  if (!email && !password) {
    throw new ApiError(404, "email and password is required");
  }
  if (!username && !email) {
    throw new ApiError(404, "username and email is required");
  }
  if (!username && !password) {
    throw new ApiError(404, "username and password is required");
  }
  if (!email) {
    throw new ApiError(404, "email is required");
  }
  if (!password) {
    throw new ApiError(404, "password is required");
  }

  const user = await UserModel.findOne({ email });
  if (user) {
    throw new ApiError(404, "User already exist");
  }
  // const newpasword = await bcrypt.hash(password, 10)
  const data = await UserModel.create(userbody);

  if (!data) {
    throw new ApiError(404, "User not created");
  }

  return data;
};

const GetUser = async (id) => {
  const data = await UserModel.findById(id);
  // console.log(data);
  if (!data) {
    throw new ApiError(404, "User not found");
  }
  return data;
};

// GetUser("65d74214958ded3466e5ac5a");

const GetListing = async (id) => {
  const data = await ListingModel.find({ userRef: id });
  //
  return data;
};
const findbyemail = async (email) => {
  const data = await UserModel.findOne({ email });
  return data;
};
const loginuser = async (userdata) => {
  const { email, password } = userdata;
  const user = await UserModel.findOne({ email });

  if (!email && !password) {
    throw new ApiError(404, "Email and password is required");
  }

  if (!email) {
    throw new ApiError(404, "Email is required");
  }

  if (!password) {
    throw new ApiError(404, "Password is required");
  }
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const PasswordCorrect = await user.isPasswordCorrect(password);

  if (!PasswordCorrect) {
    throw new ApiError(404, "Password Does not  match");
  }
  return user;
};

const findUserById = async (id) => {
  const data = await UserModel.findById({ _id: id });
  return data;
};

const Alluserlisting = async () => {
  const data = await UserModel.find();
  return data;
};

const updatedUser = async (id, body) => {
  const { username, email, password } = body;

  const newpasword = await bcrypt.hash(password, 10);
  const updatedUser = await UserModel.findByIdAndUpdate(
    id,
    {
      $set: {
        username,
        email,
        password: newpasword,
      },
    },
    { new: true }
  );
  return updatedUser;
};

const deleteUser = async (id) => {
  if (!id) {
    throw new ApiError(404, "User not found");
  }
  const data = await UserModel.findByIdAndDelete({ _id: id });
  if (!data) {
    throw new ApiError(404, "User not found");
  }
  return data;
};

module.exports = {
  deleteUser,
  CreateUser,
  GetUser,
  loginuser,
  findbyemail,
  Alluserlisting,
  findUserById,
  updatedUser,
  GetListing,
};
