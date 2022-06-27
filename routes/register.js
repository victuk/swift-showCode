var express = require('express');
var router = express.Router();
let { registerSchoolAdmins, registerVoters } = require('../controllers/register');
const { adminSignUp, } = require('../controllers/schoolElections/adminSignup');
const { verifyEmail } = require('../controllers/schoolElections/verifyEmail');

router.post('/schooladminsignup', adminSignUp);

router.post('/schooladmin', registerSchoolAdmins);

router.post('/voters', registerVoters);

router.post('/verifyemail/', verifyEmail);

module.exports = router;
