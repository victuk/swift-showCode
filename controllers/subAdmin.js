const { register } = require('../models/register');
const { studentElection } = require('../models/createElection');

async function AddSubAdmin(req, res) {
    let { subAdminDetails, electionId } = req.body;

    const electionDetails = await studentElection.findById(electionId, 'electionTitle electionGenID adminId');
  const adminDetails = await register.findById(electionDetails.adminId, 'surName otherNames schoolName');

    // Subadmin detail is email
    studentElection.findById(electionId, {
        subAdmins: subAdminDetails,
      }, function (err, u) {
        if(err) console.log(err);
      });

    subAdminDetails.forEach(async (subadmin) => {
    
    let subadminDetail = await register.find(
      { email: subadmin.email },
      "surName otherNames email"
    );

    if (!subadminDetail) {
      var mailOptions = {
        from: "Swift Vote <no-reply@swiftvote.com>",
        to: subadmin.email,
        subject: "Swift Vote - Contest Invitation",
        html: `
          <div style="padding: 20px">
              <h1 style="background-color: blue; white: color: white;">Swift Vote</h1>
              Dear ${subadmin.email}, you have been invited by ${adminDetails.surName}, ${
          adminDetails.otherNames
        } at ${adminDetails.schoolName} to 
              partcipate as an admin in "${
                electionDetails.electionTitle
              }" ${
                re.test(electionDetails.electionTitle) ? "." : "election."
              }
                <div>
                Steps to vote:<br>
                1. Create a voters account for yourself using using this email you got the invitation from... Registration Link: #link to create account <br />
                2. Login to your mobile app
                3. Click this link to view number of votes you : #link and election ID here ${electionGenID} <br />
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
    } else {
      var mailOptions = {
        from: "Swift Vote <no-reply@swiftvote.com>",
        to: subadmin.email,
        subject: "Swift Vote - Admin request link",
        html: `
          <div style="padding: 20px">
              <h1 style="background-color: blue; white: color: white;">Swift Vote</h1>
              Dear ${subadminDetail.surName}, ${subadminDetail.otherNames} you have been invited by ${adminDetails.surName}, ${
          adminDetails.otherNames
        } at ${adminDetails.schoolName} to 
              partcipate as a contestant in "${
                electionDetails.electionTitle
              }" ${
                re.test(electionDetails.electionTitle) ? "." : "election."
              }
                <div>
                Use the link below to view and vote for your favourite contestant: <br /> #link and election ID: ${electionGenID}
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
    }
  });

  res
    .status(200)
    .json({ successful: true, message: "Admins added successful" });
}

async function getAllSubadmins(req, res) {
    try {
        const { electionGenID } = req.body;
        var subAdminList = [];
    
        const allsubadmins = await studentElection
          .find({ electionGenID }, "electionTitle subAdmins");
          
          allsubadmins.subAdmins.forEach(async subAdmin => {
            let subAdminDetail = await register.findOne({email: subAdmin.email}, 'surname otherNames email role gender');
            if(!subAdminDetail) {
    
                subAdminList.push({
                subAdminDetails: subAdmin,
                registered: false
              });
            } else {
              const { surname, otherNames, email, role, gender } = subAdminDetail;
              subAdminList.push({
                subAdminDetails: {
                  surname, otherNames, email, role, gender, picture
                },
                registered: true
              });
            }
          });
    
        res.json({ successful: true, message: "ok", subAdminList });
      } catch (error) {
        console.log(error);
        res.send("An error occurred");
      }

}

module.exports = { AddSubAdmin, getAllSubadmins };
