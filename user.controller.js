//user.controller.js
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); //save the refresh token to the user document.
    //The save method in Mongoose is used to persist changes made to a document in the MongoDB database.

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(
      "Something Went Wrong while generationg refresh and access token"
    );
  }
};

const registerUser = async (req, res) => {

const { fullname, email, password } = req.body;

  if (
    [fullname, email, password].some((field) => field?.trim() === "")
  ) {
    //The some() method is an iterative method, which means it calls a provided callbackFn function once for each element in an array, until the callbackFn returns a truthy value. If such an element is found, some() immediately returns true and stops iterating through the array. Otherwise, if callbackFn returns a falsy value for all elements, some() returns false.

    throw new Error("All fields are required");
  }

  const existedUser = await User.findOne({ email});

  if (existedUser) {
    throw new Error("Username or Email already exists");
  }

  const user = await User.create({
    fullname,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    //the select method is not a native JavaScript method. It's a method provided by the Mongoose library, which is a popular ORM (Object Relational Mapping) tool for MongoDB in Node.js.
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new Error("something went wrong while registering the user");
  }

  return res
    .status(201)
    .send({ msg: "User resgisterd successfully"});
};




const loginUser = async (req, res) => {

  const { email, password } = req.body;


  if (!email) {
    throw new Error("username or password is required");
  }

  //this is the database query
  const user = await User.findOne({ email });

  //here user is mine user that i make it is the instance of User

  if (!user) {
    throw new Error( "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password); //instance method to check password is valid or invalid

  if (!isPasswordValid) {
    throw new Error("invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //send cookies
  const options = {
    httpOnly: true,
    secure: true,
  }; //this help to make cookie modifiable only from server. Generally cookies can modified from both frontend and backend

  return res
    .status(200)
    .cookie("accessToken", accessToken, options) //this line of code help to save the tokens to cookie.
    .cookie("refreshToken", refreshToken, options)
    .send(
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        )
   };





const logoutUser = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,  //here new is for it return the data after updated.
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)  //this line of code helps to remove the cookie data 
    .clearCookie("refreshToken", options)
    .send( {msg:  "User logged Out Successfully"});
};

export {registerUser, loginUser, logoutUser}