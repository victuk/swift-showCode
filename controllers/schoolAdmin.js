const { studentElection } = require("../models/createElection");
const { register } = require("../models/register");
const { transporter } = require("../utils/userUtil");

const { generateRandomString } = require("../utils/userUtil");

function createElection(req, res) {
  const {
    electionTitle,
    electoralType,
    schoolEmail,
    pollAccess,
    duration
  } = req.body;

  if (
    electionTitle &&
    electoralType &&
    pollAccess &&
    schoolEmail &&
    pollAccess &&
    duration
  ) {
    const newStudentElection = new studentElection({
      electionTitle,
      adminId: req.decoded.id,
      electoralType,
      pollAccess,
      duration,
      electionStatus: "active",
      electionGenID: generateRandomString(12),
      subAdmins: [],
      contestants: [],
      adminApprovedVoters: [],
      schoolEmail,
      verifiedElection: false,
      createDate: Date.now(),
      modifyDate: Date.now(),
    });

    newStudentElection.save((err, newElection) => {
      if (err) console.log(err);
      res
        .status(200)
        .json({
          successful: true,
          message: "Election Created Successfully",
          electionGenID: newElection.electionGenID,
        });
    });
  } else {
    res.json({ successful: false, message: "Your inputs are not complete" });
  }
}

async function electionHistory(req, res) {
  const allElections = studentElection.find(
    { adminId: req.decoded.id, electionStatus: "concluded" },
    ""
  );
  res.json({ successful: true, message: "ok", allElections });
}

async function shareElectionLinkToSubAdmins(req, res) {
  const { adminEmails, electionGenID } = req.body;

  const electionDetails = await studentElection.find(
    { electionGenID },
    "electionTitle adminId duration"
  );

  const adminDetails = await register.findById(
    electionDetails.adminId,
    "schoolName surName otherNames"
  );

  adminEmails.forEach((adminEmail) => {
    var mailOptions = {
      from: "Swift Vote <no-reply@swiftvote.com>",
      to: adminEmail,
      subject: "Swift Vote - Admin request link",
      html: `
        <div style="padding: 20px">
            <h1 style="background-color: blue; white: color: white;">Swift Vote</h1>
            You have been invited by ${adminDetails.surName}, ${
        adminDetails.otherNames
      } at ${adminDetails.schoolName} to 
            participate as an admin in "${electionDetails.electionTitle}" ${
        electionDetails.electionTitle.includes("election") ? "." : "election."
      } 
              <div>
              Use the link below to participate in the election as an admin: <br />
              Generated election ID: ${electionGenID} <br />
            # Here can be a link to a admin form with a field for email.
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
  });

  res.json({ successful: true, message: "ok" });
}

async function shareElectionLinkToCandidate(req, res) {
  const { candidateEmails, electionGenID } = req.body;

  const electionDetails = await studentElection.find(
    { electionGenID },
    "electionTitle adminId duration"
  );

  const adminDetails = await register.findById(
    electionDetails.adminId,
    "schoolName surName otherNames"
  );

  candidateEmails.forEach((candidateEmail) => {
    var mailOptions = {
      from: "Swift Vote <no-reply@swiftvote.com>",
      to: candidateEmail,
      subject: "Swift Vote - Admin request link",
      html: `
        <div style="padding: 20px">
            <h1 style="background-color: blue; white: color: white;">Swift Vote</h1>
            You have been invited by ${adminDetails.surName}, ${
        adminDetails.otherNames
      } at ${adminDetails.schoolName} to 
            participate as an admin in "${electionDetails.electionTitle}" ${
        electionDetails.electionTitle.includes("election") ? "." : "election."
      } 
              <div>
                  Use the link below to participate in the election as a candidate: <br />
                  Generated election ID: ${electionGenID} <br />
                # Here can be a link to a candidate form with a field for email.
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
  });

  res.json({ successful: true, message: "ok" });
}

async function addApprovedVoters(req, res) {
  // const { approvedVotersList, electionId } = req.body;

  const { approvedVotersList, electionId } = req.body;
  
  const electionDetails = await studentElection.findById(electionId, 'electionTitle electionGenID adminId');
  const adminDetails = await register.findById(electionDetails.adminId, 'surName otherNames schoolName');

  const re = /election/ig;
  
  // Approved voters email and regNumber
  studentElection.findByIdAndUpdate(electionId, {
    adminApprovedVoters: approvedVotersList,
  }, function (err, u) {
    if(err) console.log(err);
  });

  approvedVotersList.forEach(async (approvedVoter) => {
    
    let voterDetail = await register.findOne(
      { email: approvedVoter.email },
      "email regNumber"
    );

    if (!voterDetail) {
      var mailOptions = {
        from: "Swift Vote <no-reply@swiftvote.com>",
        to: approvedVoter.email,
        subject: "Swift Vote - Vote Invitation",
        html: `
    <div style="padding: 20px">
        <h1 style="background-color: blue; white: color: white;">Swift Vote</h1>
        You have been invited by ${adminDetails.surName}, ${
          adminDetails.otherNames
        } at ${adminDetails.schoolName} to 
        vote in "${electionDetails.electionTitle}" ${
          re.test(electionDetails.electionTitle) ? "." : "election."
        } 
          <div>
          Steps to vote:<br>
          1. Create a voters account for yourself #link to create account <br />
          2. Login to your mobile app
          3. Click this link to view and vote for your favourite contestant: #link and election ID here ${electionDetails.electionGenID} <br />
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
        to: approvedVoter.email,
        subject: "Swift Vote - Admin request link",
        html: `
    <div style="padding: 20px">
        <h1 style="background-color: blue; white: color: white;">Swift Vote</h1>
        You have been invited by ${adminDetails.surName}, ${
          adminDetails.otherNames
        } at ${adminDetails.schoolName} to 
        vote in "${electionDetails.electionTitle}" ${
          re.test(electionDetails.electionTitle) ? "." : "election."
        } 
          <div>
          Steps to vote:<br>
          1. Log in to the mobile app if you've not logged in...
          Use the link below to view and vote for your favourite contestant: <br /> #link and election ID: ${electionDetails.electionGenID}
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

  res.json({ successful: true, message: "Voters added" });
}

function getApprovedVotersList(req, res) {
  const { electionId } = req.body;
  createElection.findById(
    electionId,
    "electionTitle schoolEmail adminApprovedVoters"
  );
}

function getContestantsList(req, res) {
  const { electionId } = req.body;
  createElection.findById(electionId, "electionTitle schoolEmail contestants");
}

function getSubAdminsList(req, res) {
  const { electionId } = req.body;
  createElection.findById(electionId, "electionTitle schoolEmail subAdmins");
}

async function getSchoolAdminProfile(req, res) {
  const schoolAdminId = req.decoded.id;
  const schoolAdminProfileDetail = await register.findById(schoolAdminId, 'surName otherNames phoneNumber email gender picture schoolRole');
  res.json({
    successful: true,
    schoolAdminProfileDetail
  });
}

function changeProfile(req, res) {
  const {
    schoolName,
    surName,
    otherNames,
    gender,
    phoneNumber,
    schoolRole,
    email
  } = req.body;
  register.findByIdAndUpdate(req.decoded.id, {
    schoolName,
    surName,
    otherNames,
    gender,
    phoneNumber,
    schoolRole,
    email
  }, function(error, response) {
    if(error) throw error;
    res.json({successful: true, message: 'ok'});
  });
}

function changeProfilePicture(req, res) {
  const { picture } = req.body;
  register.findByIdAndUpdate(req.decoded.id, {
    picture
  }, function(error, response) {
    if(error) throw error;
    res.json({successful: true, message: 'ok'});
  });
}

async function getElectionByGenId(req, res) {
  const { electionGenID } = req.body;
  try {
      const electionDetails = register.findOne({electionGenID});
      res.json({successful: true, electionDetails });
  } catch (error) {
      console.log(error);
      res.json({successful: false, message: "an error occurred"});
  }
}

module.exports = {
  createElection,
  shareElectionLinkToSubAdmins,
  shareElectionLinkToCandidate,
  electionHistory,
  addApprovedVoters,
  getApprovedVotersList,
  getContestantsList,
  getSubAdminsList,
  getSchoolAdminProfile,
  changeProfile,
  changeProfilePicture,
  getElectionByGenId
};
