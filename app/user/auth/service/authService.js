"use strict";
const Promise = require("bluebird");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const ES = require("../../../base/error/errorService");
const User = require("../storage/model/User");
const UserStorage = require("../storage/UserStorage");
const UserValidator = require("../storage/validation/UserValidator");
const userStorage = new UserStorage({
  Model: User,
  CustomValidator: UserValidator,
});
const userPopulation = require("../storage/populate/userPopulation");
const emailSender = process.env.MAILER_EMAIL_ID;
const emailPass = process.env.MAILER_PASSWORD;

const signup = (param, file) => {
  const salt = 10;
  const secretNumber = Math.random().toString(36).substring(2, 20);
  const verificationString = Math.random().toString(36).substring(2, 40);
  let userImage;
  if (file) {
    userImage = file.path;
  } else {
    userImage = null;
  }
  return userStorage
    .store(
      {
        firstName: param.firstName,
        lastName: param.lastName,
        email: param.email,
        secretNumber: secretNumber,
        userImage: userImage,
        phoneNumber: param.phoneNumber,
        password: bcrypt.hashSync(param.password, salt),
      },
      null,
      userPopulation.find
    )

    .then((user) => {
      const token = authToken(user);
      return Promise.resolve({ token: token, user });
    });
};

const login = (param) => {
  var email = param.email.toLowerCase();
  return User.findOne({ email: email })
    .populate(userPopulation.find)
    .then((user) => {
      if (
        user &&
        bcrypt.compareSync(param.password, user.password) &&
        user.suspend == false
      ) {
        const token = authToken(user);
        return Promise.resolve({ token: token, user: user });
      } else {
        return Promise.reject(ES.authError("Authentication Failed"));
      }
    });
};

const authToken = (user) => {
  return jwt.sign(
    {
      email: user.email,
      _id: user._id,
      role: user.role,
      secretNumber: user.secretNumber,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: process.env.TOKEN_EXPIRY_TIME,
    }
  );
};

const randStr = (len) => {
  let s = "";
  while (s.length < len)
    s += Math.random()
      .toString(36)
      .substr(2, len - s.length);
  return s;
};

module.exports = {
  signup,
  login,
  authToken,
};
