//user.model.js
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

   password: {
      type: String,
      required: [true, "password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
);

userSchema.pre("save", async function (next) {
  //here we use normal function instead of arrow function because of arrow function doesnot hold the current context in "this" keyword. here pre is the mogoose hook which is execute before the save method. this is like a middleware which is execute whenever password is changes before save in the database.
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);  //this method is execute while the password is changes before save in the database
  next();
});

//in mongoose we can inject the custom methods to it just like that middleware
// The userSchema in your Mongoose setup plays a crucial role in defining instance methods, such as isPasswordCorrect.

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
  //In the context of instance methods, this refers to the specific instance of the user document. This is crucial because it allows the method to access instance-specific properties, such as this.password, which contains the hashed password for that particular user.
};

userSchema.methods.generateAccessToken = function () {  //here in the context of instance method this refers to the specific instance of the user document and we can access the instance specific properties. and here we addded the method to the userSchema so that we can access this method to the user instance.
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,  
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
