const { register } = require("../models/register");
const { studentElection } = require("../models/createElection");
const { transporter } = require("../utils/userUtil");

async function AddContestant(req, res) {
  let { contestantDetails, electionId } = req.body;

  const electionDetails = await studentElection.findById(electionId, 'electionTitle electionGenID adminId');
  const adminDetails = await register.findById(electionDetails.adminId, 'surName otherNames schoolName');
  const re = /election/ig;

  // Contestant details email and regNumber
  studentElection.findByIdAndUpdate(electionId, {
    contestants: contestantDetails,
  }, function (err, u) {
    if(err) console.log(err);
  });

  contestantDetails.forEach(async (contestant) => {
    
    let contestantDetail = await register.find(
      { email: contestant.email },
      "email regNumber"
    );

    if (!contestantDetail) {
      var mailOptions = {
        from: "Swift Vote <no-reply@swiftvote.com>",
        to: contestant.email,
        subject: "Swift Vote - Contest Invitation",
        html: `
          <div style="padding: 20px">
              <h1 style="background-color: blue; white: color: white;">Swift Vote</h1>
              You have been invited by ${adminDetails.surName}, ${
          adminDetails.otherNames
        } at ${adminDetails.schoolName} to 
              partcipate as a contestant in "${
                electionDetails.electionTitle
              }" ${
          re.test(electionDetails.electionTitle) ? "." : "election."
        }
                <div>
                Steps to vote:<br>
                1. Create an account for yourself using using this email you got the invitation from... Registration Link: #link to create account <br />
                2. Login to your mobile app
                3. Click this link to view number of votes you have : #link and election ID here ${electionDetails.electionGenID} <br />
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
        to: contestant.email,
        subject: "Swift Vote - Admin request link",
        html: `
          <div style="padding: 20px">
              <h1 style="background-color: blue; white: color: white;">Swift Vote</h1>
              You have been invited by ${adminDetails.surName}, ${
          adminDetails.otherNames
        } at ${adminDetails.schoolName} to 
              partcipate as a contestant in "${
                electionDetails.electionTitle
              }" ${
                re.test(electionDetails.electionTitle) ? "." : "election."
              }
                <div>
                Use the link below to view the number of votes you have: <br /> #link and election ID: ${electionDetails.electionGenID}
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
    .json({ successful: true, message: "Contestants added successful" });
}

async function getAllContestants(req, res) {
  try {
    const { electionGenID } = req.body;
    var contestantList = [];

    const allContestants = await studentElection
      .find({ electionGenID }, "electionTitle contestants");
      
      allContestants.contestants.forEach(async contestant => {
        let contestantDetail = await register.findOne({email: contestant.email}, 'surname otherNames email regNumber role gender picture');
        if(!contestantDetail) {

          contestantList.push({
            contestantDetails: contestant,
            registered: false
          });
        } else {
          const { surname, otherNames, email, regNumber, role, gender, picture } = contestantDetail;
          contestantList.push({
            contestantDetails: {
              surname, otherNames, email, regNumber, role, gender, picture
            },
            registered: true
          });
        }
      });

    res.json({ successful: true, message: "ok", contestantList });
  } catch (error) {
    console.log(error);
    res.send("An error occurred");
  }
}

module.exports = { AddContestant, getAllContestants };
