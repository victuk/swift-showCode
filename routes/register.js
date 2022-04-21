var express = require('express');
var router = express.Router();
let { registerSchoolAdmins, registerVoters, verifyEmail } = require('../controllers/register');


router.post('/schooladmin', registerSchoolAdmins);

router.post('/voters', registerVoters);

router.post('/verifyemail/', verifyEmail);

module.exports = router;
