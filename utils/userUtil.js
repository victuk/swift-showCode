const bcryptjs = require('bcryptjs');
var nodemailer = require('nodemailer');
const { register } = require('../models/register');
require('dotenv').config();

const { emailService, emailUser, emailPassword } = process.env;

var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    // service: emailService,
    port: 465,
    secure: true,
    auth: {
      user: emailUser,
      pass: emailPassword
    }
  });

// verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to send e-mails");
    }
  });

const createUser = (newUser, callback) => {
    bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(newUser.password, salt, (error, hash) => {
            // store the hashed password
            const newUserResource = newUser;
            newUserResource.password = hash;
            newUserResource.save(callback);
        });
    });
};

const getUserByEmail = (email, callback) => {
    const query = { email };
    register.findOne(query, callback);
};

const getUserByUserId = (userId, callback) => {
    const query = { userId };
    register.findOne(query, callback);
};

const comparePassword = (candidatePassword, hash, callback) => {
    bcryptjs.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
};

const generateRandomString = (len = 24) => {
    var crypto = require("crypto");
    var id = crypto.randomBytes(len).toString('hex');
    return id;
}

const generateOtp = () => {
    let oneTimePassword = Math.floor(100000 + Math.random() * 900000);
    return oneTimePassword;
}

module.exports = { createUser, getUserByEmail, getUserByUserId, comparePassword, generateRandomString, generateOtp, transporter };