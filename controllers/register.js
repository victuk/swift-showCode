var { register } = require("../models/register");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {
  getUserByEmail,
  createUser,
  generateRandomString,
  generateOtp,
  transporter,
} = require("../utils/userUtil");

let regSecretKey = process.env.registerSecretKey;

function registerSchoolAdmins(req, res) {
  const {
    schoolName,
    surName,
    initials,
    phoneNumber,
    schoolRole,
    schoolEmail,
    numberOfAdmins,
    electionType,
    electionTitle,
  } = req.body;

  if (
    schoolName &&
    surName &&
    initials &&
    phoneNumber &&
    schoolRole &&
    schoolEmail &&
    numberOfAdmins &&
    electionType &&
    electionTitle
  ) {
    const newUser = new register({
      schoolName,
      surName,
      initials,
      phoneNumber,
      schoolRole,
      schoolEmail,
      numberOfAdmins,
      emailVerified: false,
      suspended: false,
      creator: true,
      creatorId: generateRandomString(16),
      electionType,
      electionTitle,
      role: "schoolAdmin",
      createDate: Date.now(),
    });

    getUserByEmail(schoolEmail, (err, user) => {
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
          let payload = { id: user._id, email: user.schoolEmail, otp };

          const regToken = jwt.sign(payload, regSecretKey, {
            expiresIn: 5000,
          });

          var mailOptions = {
            from: "Swift Vote <no-reply@swiftvote.com>",
            to: user.schoolEmail,
            subject: "Swift Vote - Admin Verification Code",
            html: `
            <div style="padding: 20px">
                <h1 style="background-color: blue; white: color: white;">Swift Vote OTP</h1>
                Your OTP is:
                  <div>
                      <h2>${otp}</h2>
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

function registerSubSchoolAdmins(req, res) {
  const {
    schoolName,
    surName,
    initials,
    phoneNumber,
    schoolRole,
    schoolEmail,
    electionType,
    electionTitle,
  } = req.body;

  const { creatorId } = req.params;

  if (
    schoolName &&
    surName &&
    initials &&
    phoneNumber &&
    schoolRole &&
    schoolEmail &&
    electionType &&
    electionTitle
  ) {
    const newUser = new register({
      schoolName,
      surName,
      initials,
      phoneNumber,
      schoolRole,
      schoolEmail,
      emailVerified: false,
      suspended: false,
      creator: false,
      creatorId,
      electionType,
      electionTitle,
      role: "schoolAdmin",
      createDate: Date.now(),
    });

    getUserByEmail(schoolEmail, (err, user) => {
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
          let payload = { id: user._id, email: user.schoolEmail, otp };

          const regToken = jwt.sign(payload, regSecretKey, {
            expiresIn: 5000,
          });

          var mailOptions = {
            from: "Swift Vote <no-reply@swiftvote.com>",
            to: user.schoolEmail,
            subject: "Swift Vote - Co-admin Verification Code",
            html: `
        <div style="padding: 20px">
            <h1 style="background-color: blue; white: color: white;">Swift Vote OTP</h1>
            Your OTP is:
              <div>
                  <h2>${otp}</h2>
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
  const { email, fullName, skinType, gender, password } = req.body;

  if (email && fullName && skinType && gender && password) {
    const newUser = new register({
      fullName,
      email,
      picture: "none",
      publicId: "none",
      gender,
      skinType,
      password,
      emailVerified: false,
      suspended: false,
      role: "voter",
      createDate: Date.now(),
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

          res.json({ successful: true, message: "ok", user });
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
  const vToken = req.params.verifyToken;
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

            var mailOptions = {
              from: "Swift Vote <no-reply@swiftvote.com>",
              to: user.schoolEmail,
              subject: "Swift Vote - Login Details",
              html: `
          <div style="padding: 20px">
              <h1 style="background-color: blue; white: color: white;">Swift Vote OTP</h1>
              Your Login Details are as follows:
                <div>
                    <h2>Email: ${user.schoolEmail}</h2>
                    <h2>Login ID: ${user.creatorId}</h2>
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
  verifyEmail,
  registerSubSchoolAdmins,
};
