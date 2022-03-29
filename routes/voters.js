var express = require('express');
var router = express.Router();
const authLogin = require('../auth/loginAuth');
var regUser = require('../models/register');
const hasAccess = require('../auth/accessControl');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// secretOrPrivateKey = process.env.forgetPasswordKey;
var nodemailer = require('nodemailer');
const bcryptjs = require('bcryptjs');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ukokjnr@gmail.com',
    pass: 'zxyolhxawfumxpxh'
  }
});

/* GET users listing. */
router.get('/profile', authLogin, function(req, res) {
  regUser.findById(req.decoded.id, 'fullName email role', function(err, user) {
    if (err) {console.log(err)}
    res.json({
      success: true,
      user
    })
  });
});

router.post('/forget-password', async function(req, res) {
  let email = await regUser.findOne({email: req.body.email}, 'fullName email');
  if(!email) {
    res.json({success: false, message: 'No user with this email'});
  } else {
    console.log(email);
    const token = jwt.sign(email._id.toString(), process.env.forgetPasswordKey, {
      expiresIn: 5000
    });

    var mailOptions = {
      from: 'wearz@gmail.com',
      to: email.email,
      subject: 'Wearz - Reset Password',
      html: `
      <div style="padding: 20px">
          <h1>Wearz</h1>
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

    res.json({success: true, message: 'Email Sent!'});
  }
});

router.post('/reset-password', async function(req, res) {
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
    }
    console.log(user);
    res.json({success: true, user});
  });
  
});

router.put('/skinType', authLogin, async function(req, res) {
   let modSkinType = await regUser.findByIdAndUpdate(req.decoded.id, {
    skinType: req.body.skinType
  });

  res.json({
    success: true,
    skinType: modSkinType
  });
});



// router.post('/change-name', authLogin, async function(req, res) {
//   return console.log(req.body);
//   let newName = await regUser.findByIdAndUpdate(req.decoded.id, {
//     fullName: req.body.fullName
//   });

//   res.json({
//     success: true,
//     newName
//   });
// });









// router.put('/change-mentor-picture', authLogin, hasAccess.adminOnly, async function(req, res) {
//   let mentor = await allSchema.mentorsSchema.findById(req.body.id, '');

//   cloudinary.uploader.destroy(mentor.publicId, async function(error, result) {
//     if(error) {
//       console.log(error);
//     }

//     let newPic = await allSchema.mentorsSchema.findByIdAndUpdate(req.body.id, {
//       picture: req.body.picture,
//       publicId: req.body.publicId
//     });
//     res.json({
//       success: true,
//       newPic
//     });
//   });


// });


// router.post('/mentorship', function (req, res) {
//   const mentorshipRequest = new allSchema.mentorshipRequestSchema({
//   name: req.body.name,
//   email: req.body.email,
//   gender: req.body.gender,
//   age: req.body.age,
//   location: req.body.location,
//   phone: req.body.phone,
//   reasonForMentorship:req.body.reasonForMentorship,
//   mentorId: req.body.mentorId,
//   mentorDetail: req.body.mentorDetail,
//   status: 'unread',
//   createDate: Date.now()
//   });




//   mentorshipRequest.save(async function(err, newRequest) {
//     if (err) {
//       console.log(err);
//     }



//     var mailOptions = {
//       from: 'mentorstower@gmail.com',
//       to: 'mentorstower@gmail.com',
//       subject: 'Mentorship Request - RPF',
//       html: `
//       <div style="padding: 20px">
//           <h1>Mentorship request from ${newRequest.name}</h1>
//           <div>Name: ${newRequest.name}</div>
//           <div>Email: ${newRequest.email}</div>
//           <div>Phone: ${newRequest.phone}</div>
//           <div>Gender: ${newRequest.gender}</div>
//           <div>Reason for mentorship: ${newRequest.reasonForMentorship}</div>
//           <div>
//               <h2>Details of mentor ${newRequest.name} chose</h2>
//               <div>Surname: ${newRequest.mentorDetail.surname}</div>
//               <div>Other Names: ${newRequest.mentorDetail.firstName}</div>
//               <div>Email: ${newRequest.mentorDetail.email}</div>
//               <div>Phone: ${newRequest.mentorDetail.phone}</div>
//           </div>
//             <div>
//                 <a href="https://realitypacefoundation.netlify.app/admin/view-mentorship-request.html">View Mentor's list</a>
//             </div>

//             <div>
//                 <a href="https://realitypacefoundation.netlify.app/admin/view-mentorship-detail.html?id=${newRequest._id}">Request in dashboard</a>
//             </div>

//           <style>
//                 div, a {
//                   padding: 20px 10px;
//                 }
//           </style>
//       </div>
//       `
//     };

//     var mailOptionsTwo = {
//       from: 'mentorstower@gmail.com',
//       to: newRequest.email,
//       subject: 'Mentorship Request Sent Sucessfully - RPF',
//       html: `
//       <div style="padding: 20px">

//         <h1>Mentorship Request Received</h1>
//         <div>
//         <div>Choosen mentor detail</div>
//         <div>Surname: ${newRequest.mentorDetail.surname}</div>
//         <div>Other Names: ${newRequest.mentorDetail.firstName}</div>
//         </div>
//         <style>
//                 div {
//                   padding: 20px 10px;
//                 }
//           </style>
//       </div>
//       `
//     };

//     let sentMail = await transporter.sendMail(mailOptions);
//     let sentMailtwo = await transporter.sendMail(mailOptionsTwo);

//     console.log(newRequest);

//     res.json({
//       success: true
//     });


//   });
// });

// router.post('/mentorship-mobile', async function(req, res) {

//   let singleMentor = await allSchema.mentorsSchema.findById(req.body.mentorId, '').populate('category');

//       let mentorDetail = {
//         firstName: singleMentor.firstName,
//         surname: singleMentor.surname,
//         email: singleMentor.email,
//         phone: singleMentor.phone
//       };

//   const mentorshipRequest = new allSchema.mentorshipRequestSchema({
//     name: req.body.name,
//     email: req.body.email,
//     gender: req.body.gender,
//     age: req.body.age,
//     location: req.body.location,
//     phone: req.body.phone,
//     reasonForMentorship:req.body.reasonForMentorship,
//     mentorId: req.body.mentorId,
//     mentorDetail,
//     status: 'unread',
//     createDate: Date.now()
//     });

//     mentorshipRequest.save(async function(err, newRequest) {


//       var mailOptions = {
//         from: 'mentorstower@gmail.com',
//         to: 'mentorstower@gmail.com',
//         subject: 'Mentorship Request - RPF',
//         html: `
//         <div style="padding: 20px">
//             <h1>Mentorship request from ${req.body.name}</h1>
//             <div>Name: ${req.body.name}</div>
//             <div>Email: ${req.body.email}</div>
//             <div>Phone: ${req.body.phone}</div>
//             <div>Gender: ${req.body.gender}</div>
//             <div>Reason for mentorship: ${req.body.reasonForMentorship}</div>
//             <div>
//                 <h2>Details of mentor ${req.body.name} chose</h2>
//                 <div>Surname: ${mentorDetail.surname}</div>
//                 <div>Other Names: ${mentorDetail.firstName}</div>
//                 <div>Email: ${mentorDetail.email}</div>
//                 <div>Phone: ${mentorDetail.phone}</div>
//             </div>
//               <div>
//                   <a href="https://realitypacefoundation.netlify.app/admin/view-mentorship-request.html">View Mentor's list</a>
//               </div>

//               <div>
//                   <a href="https://realitypacefoundation.netlify.app/admin/view-mentorship-detail.html?id=${newRequest._id}">Request in dashboard</a>
//               </div>

//             <style>
//                   div, a {
//                     padding: 20px 10px;
//                   }
//             </style>
//         </div>
//         `
//       };

//       var mailOptionsTwo = {
//         from: 'mentorstower@gmail.com',
//         to: req.body.email,
//         subject: 'Mentorship Request Sent Sucessfully - RPF',
//         html: `
//         <div style="padding: 20px">

//           <h1>Mentorship Request Received</h1>
//           <div>
//           <div>Choosen mentor detail</div>
//           <div>Surname: ${mentorDetail.surname}</div>
//           <div>Other Names: ${mentorDetail.firstName}</div>
//           </div>
//           <style>
//                   div {
//                     padding: 20px 10px;
//                   }
//             </style>
//         </div>
//         `
//       };

//       let sentMail = await transporter.sendMail(mailOptions);
//       let sentMailtwo = await transporter.sendMail(mailOptionsTwo);



//   res.json({
//     success: true,
//     singleMentor
//   });

//     });
// });








module.exports = router;
