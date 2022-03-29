var express = require('express');
var router = express.Router();
let { registerSchoolAdmins, registerSubSchoolAdmins, registerVoters, verifyEmail } = require('../controllers/register');


router.post('/schooladmin', registerSchoolAdmins);

router.post('/schooladmin/:creatorId', registerSubSchoolAdmins);

router.post('/voters', registerVoters);

router.post('/verifyemail/:verifyToken', verifyEmail);





module.exports = router;
