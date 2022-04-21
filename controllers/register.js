var { register } = require("../models/register");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
require("dotenv").config();
const {
  getUserByEmail,
  createUser,
  generateOtp,
  transporter,
} = require("../utils/userUtil");

let randomUUID = require('crypto');

let regSecretKey = process.env.registerSecretKey;

function registerSchoolAdmins(req, res) {
  const {
    schoolName,
    surName,
    otherNames,
    gender,
    phoneNumber,
    schoolRole,
    email,
    password
  } = req.body;

  if (
    schoolName &&
    surName &&
    otherNames &&
    gender &&
    phoneNumber &&
    schoolRole &&
    password &&
    email
  ) {
    const newUser = new register({
      schoolName,
      surName,
      otherNames,
      phoneNumber,
      schoolRole,
      email,
      gender,
      publicId: null,
      picture: null,
      password,
      emailVerified: false,
      suspended: false,
      role: "schoolAdmin",
      createDate: Date.now(),
      modifyDate: Date.now()
    });


    getUserByEmail(email, (err, user) => {
      if (err) {
        console.log(err);
      }
      if (!user) {
        createUser(newUser, function (error, user) {
          if (error) {
            res.status(422).json({
              message: "Something went wrong!",
            });
          }
          let otp = generateOtp();
          let payload = { id: user._id, email: user.email, otp };

          const regToken = jwt.sign(payload, regSecretKey, {
            expiresIn: 5000,
          });

          var mailOptions = {
            from: "Swift Vote <no-reply@swiftvote.com>",
            to: user.email,
            subject: "Swift Vote - Admin Verification Code",
            html: `
            <div style="padding: 20px">
                <h1 style="background-color: blue; white: color: white;">Swift Vote OTP</h1>
                Your OTP is:
                  <div>
                  <h2>${otp}</h2>
                  <div> Register Token: ${regToken} </div>
                  <div>
                  Send this register token and the otp as registration body
                  </div>
                  </div>
                <style>
                      div, a {
                        padding: 20px 10px;
                      }
                </style>
            </div>
            `,
          };

          transporter.sendMail(mailOptions);

          res.json({ successful: true, message: "ok", user, regToken });
        });
      } else {
        res.json({ successful: false, message: "This email is already used" });
      }
    });
  } else {
    res.json({
      successful: false,
      message: "Your input details are not complete.",
    });
  }
}

function registerVoters(req, res) {
  const { email, surName, otherNames, regNumber, department, gender, password } = req.body;

  const uniqueId = randomUUID.randomUUID().split('').filter(letter => {return letter != '-'}).join("");

  if (email && surName && otherNames && regNumber && gender && password) {
    const newUser = new register({
      surName,
      otherNames,
      email,
      picture: null,
      publicId: null,
      gender,
      regNumber,
      department,
      emailVerified: false,
      suspended: false,
      role: "voter",
      password,
      createDate: Date.now(),
      modifyDate: Date.now()
    });

    getUserByEmail(email, (err, user) => {
      if (!user) {
        createUser(newUser, function (error, user) {
          if (error) {
            res.status(422).json({
              message: "Something went wrong!",
            });
          }

          let otp = generateOtp();
          let payload = { id: user._id, email: user.email, otp };

          const regToken = jwt.sign(payload, regSecretKey, {
            expiresIn: 5000,
          });

          var mailOptions = {
            from: "Swift Vote <no-reply@swiftvote.com>",
            to: user.email,
            subject: "Swift Vote - Verification Code",
            html: `
            <div style="padding: 20px">
                <h1 style="background-color: blue; white: color: white;">Swift Vote OTP</h1>
                Your OTP is:
                  <div>
                      <h2>${otp}</h2>
                      <div> Register Token: ${regToken} </div>
                      <div>
                      Send this register token and the otp as registration body
                      </div>
                  </div>
                <style>
                      div, a {
                        padding: 20px 10px;
                      }
                      .verify-button {
                        background-color: blue;
                        color: white;
                        padding: 20px;
                        text-decoration: none;
                      }
                </style>
            </div>
            `,
          };

          transporter.sendMail(mailOptions);

          res.json({ successful: true, message: "ok", user, regToken, protocol: req.protocol, hostname: req.hostname });
        });
      } else {
        res.json({ successful: false, message: "This email is already used" });
      }
    });
  } else {
    res.json({
      successful: false,
      message: "Your input details are not complete.",
    });
  }
}

function verifyEmail(req, res) {
  const vToken = req.body.verifyToken;
  const vDigits = req.body.verifyDigits;
  jwt.verify(vToken, regSecretKey, function (err, decoded) {
    if (err) {
      return res.json({
        success: false,
        message: "Failed to authenticate token.",
      });
    } else {
      if (decoded.otp.toString() === vDigits.toString()) {
        register.findByIdAndUpdate(
          decoded.id,
          {
            emailVerified: true,
          },
          function (err, user) {
            if (err) console.log(err);
            if(user.role == 'voter') {
              var mailOptions = {
                from: "Swift Vote <no-reply@swiftvote.com>",
                to: user.email,
                subject: "Swift Vote - Email Verified",
                html: `
            <div style="padding: 20px">
                <h1 style="background-color: blue; white: color: white;">Swift Vote Login Details</h1>
                Your Email is verified. <br> Click this button to login
                #Link to voter's page to login
                  <div>
                  </div>
                <style>
                      div, a {
                        padding: 20px 10px;
                      }
                </style>
            </div>
            `,
              };
              transporter.sendMail(mailOptions);
  
            res
              .status(200)
              .json({ successful: true, message: "Email Verified", loginToken: user.creatorId });
            } else if (user.role == 'schoolAdmin') {
              var mailOptions = {
                from: "Swift Vote <no-reply@swiftvote.com>",
                to: user.email,
                subject: "Swift Vote - Email Verified",
                html: `
            <div style="padding: 20px">
                <h1 style="background-color: blue; white: color: white;">Swift Vote Login Details</h1>
                Your Email is verified.
                #Link to admin panel here
                  <div>
                  </div>
                <style>
                      div, a {
                        padding: 20px 10px;
                      }
                </style>
            </div>
            `,
              };
              transporter.sendMail(mailOptions);
  
            res
              .status(200)
              .json({ successful: true, message: "Email Verified", loginToken: user.creatorId });
            }
          }
        );
      } else {
        res
          .status(400)
          .json({ successful: false, message: "Token values don't match" });
      }
    }
  });
}

module.exports = {
  registerSchoolAdmins,
  registerVoters,
  verifyEmail
};
