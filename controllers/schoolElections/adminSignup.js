const { register } = require("../../models/register");
const CryptoJS = require("crypto-js");
const cryptoSecret = process.env.cryptoSecret;

const {
getUserByEmail,
createUser,
transporter,
} = require("../../utils/userUtil");

function adminSignUp(req, res) {
    // console.log(req.body);
    // res.send("Hello");

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

          let payload = { id: user._id, email: user.email };

          var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(payload), cryptoSecret).toString();

          console.log(ciphertext);

          var mailOptions = {
            from: "Swift Vote <no-reply@swiftvote.com>",
            to: user.email,
            subject: "Swift Vote - Admin Verification Code",
            html: `
            <div style="padding: 20px">
                <h1 style="background-color: blue; white: color: white;">Swift Vote OTP</h1>
                Your OTP is:
                  <div>
                  <a href="${ciphertext}">Verify Email</a>
                  <div>If the button is not working you can click this link to verify your email:</div>
                  <div> Register Token: ${ciphertext} </div>
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

          res.json({ successful: true, message: "ok", ciphertext });
        });
      } else {
        res.json({ successful: false, message: "This email is already used" });
      }
    });

}



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

            let payload = { id: user._id, email: user.email };

            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(payload), cryptoSecret).toString();
  
            console.log(ciphertext);
  
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
                    <a href="${ciphertext}">Verify Email</a>
                    <div>If the button is not working you can click this link to verify your email:</div>
                    <div> Register Token: ${ciphertext} </div>
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

module.exports = {
    adminSignUp
}