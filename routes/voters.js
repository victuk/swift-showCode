var express = require('express');
var router = express.Router();
const { vote, getElectionByGenId, getVotersProfile } = require('../controllers/voters');
const { changeProfile, changeProfilePicture, changePassword } = require('../controllers/profile');
let authLogin = require('../auth/loginAuth');


router.post('/vote', authLogin, vote);

router.get('/election', getElectionByGenId);

router.get('/profile', authLogin, getVotersProfile);

router.put('/profile', authLogin, changeProfile);

router.put('/profilepicture', authLogin, changeProfilePicture);

router.get('/changepassword', authLogin, changePassword);

module.exports = router;
