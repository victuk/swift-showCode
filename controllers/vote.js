const { studentElection } = require('../models/createElection');
var { register } = require("../models/register");

async function vote(req, res) {
    const {electionGenID, candidateID} = req.body;

    const voterId = req.decoded.id;

    const votersDetails = await register.findById(req.decoded.id);

    const candidateDetails = await register.findById(candidateID);

    

    const electionDetails = await studentElection.findOne({electionGenID});

    let candidates = electionDetails.contestants;
    

    let voters = electionDetails.adminApprovedVoters;

    let eligibleVoter = false;

    let foundCandidate = false;

    if(!candidateDetails) {
        res.json({successful: false, message: "Candidate dosen't exist"});
    } else {
        if(req.decoded.user.suspended) {
            res.json({successful: true, message: "You can\'t vote because you are suspended"});
        }
        voters.forEach(voter => {
            if(votersDetails.email == voter.email && votersDetails.regNumber == voter.regNumber) {
                eligibleVoter = true;
            }
        });
    
        candidates.forEach(candidate => {
            if(candidateDetails.email == candidate.email && candidateDetails.regNumber == candidate.regNumber) {
                foundCandidate = true;
            }
        });

        if(eligibleVoter) {
            res.json({
                successful: true,
                message: 'Congratulations, you\'ve voted',
                eligibleVoter,
                foundCandidate,
                voterID: req.decoded.id,
                candidateID: candidateID,
                electionID: electionDetails._id
        });
        } else {
            res.json({successful: false, message: "You can't vote"});
        }
    
        
    }

    
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

module.exports = { vote, getElectionByGenId };