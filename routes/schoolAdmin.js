var express = require('express');
var router = express.Router();
const {
    createElection,
    shareElectionLinkToSubAdmins,
    shareElectionLinkToCandidate,
    electionHistory,
    addApprovedVoters,
    getApprovedVotersList
} = require('../controllers/schoolAdmin');
const { AddContestant, getAllContestants } = require('../controllers/contestant');
const { AddSubAdmin, getAllSubadmins } = require('../controllers/subAdmin');
let authLogin = require('../auth/loginAuth');

router.post('/election', authLogin, createElection);

router.post('/sharelink/subadmins', authLogin, shareElectionLinkToSubAdmins);

router.post('/sharelink/candidates', authLogin, shareElectionLinkToCandidate);

router.post('/approvedvoters', authLogin, addApprovedVoters);

router.get('/approvedvoters', authLogin, getApprovedVotersList);

router.post('/electionadmin', authLogin, AddSubAdmin);

router.post('/contestants', authLogin, AddContestant);

router.get('/contestants', authLogin, getAllContestants);

router.get('/subadmins', authLogin, getAllSubadmins);

router.get('/electionhistory', authLogin, electionHistory)


module.exports = router;