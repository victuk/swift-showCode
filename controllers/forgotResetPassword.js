const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');

const { emailService, emailUser, emailPassword } = process.env;

var transporter = nodemailer.createTransport({
    service: emailService,
    auth: {
      user: emailUser,
      pass: emailPassword
    }
  });

async function forgotPassword(req, res) {
    let emailUser = await regUser.findOne({email: req.body.email}, 'fullName email');
  if(!emailUser) {
    res.status(404).json({success: false, message: 'No user with this email'});
  } else {
    console.log(emailUser);
    const token = jwt.sign(emailUser._id.toString(), process.env.forgetPasswordKey, {
      expiresIn: 5000
    });

    var mailOptions = {
      from: 'Swift Vote <no-reply@swiftvote.com>',
      to: emailUser.email,
      subject: 'Swift Vote - Reset Password',
      html: `
      <div style="padding: 20px">
          <h1 style="background-color: blue; white: color: white;">Wearz</h1>
          Click the reset password button to reset the password
            <div>
                <a href="${process.env.frontendUrl}/reset-password.html?token=${token}">Reset password</a>
            </div>

            <div>Or copy the link and paste on your browser ${process.env.frontendUrl}/reset-password.html?token=${token}</div>
          
          <style>
                div, a {
                  padding: 20px 10px;
                }
          </style>
      </div>
      `
    };

    transporter.sendMail(mailOptions);

    res.status(200).json({success: true, message: 'Email Sent!'});
  }
}

async function resetPassword(req, res) {
    try {
        let decryptedToken = jwt.verify(req.body.key, process.env.forgetPasswordKey);
        // console.log();
        console.log(decryptedToken);
        console.log(req.body.key);
        // res.json(decryptedToken);
        let salt = await bcryptjs.genSalt(10);
        let hashedPassword = await bcryptjs.hash(req.body.newPassword, salt);
        console.log(hashedPassword);
        regUser.findByIdAndUpdate(decryptedToken, {
            password: hashedPassword
        }, function(err, user) {
            if(err) {
            return console.log(err);
            } else if (!user) {
                res.json({success: false, message: "User does not exist"});
            }
            console.log(user);
            res.json({success: true, user});
  });
    } catch (error) {
        console.log(error);
        res.json({success: false, message: 'invalid token'});
    }
    
  
}

module.exports = { forgotPassword, resetPassword };