var express = require('express');
var router = express.Router();
const { forgotPassword, resetPassword } = require('../controllers/forgotResetPassword');

router.post('/forgotPassword', forgotPassword);

router.post('/resetPassword/:token', resetPassword);


module.exports = router;