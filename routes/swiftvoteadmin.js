var express = require('express');
var router = express.Router();
// var regUser = require('../models/register');




router.post('/getstats', function(req, res) {
    res.send('stats');
});

module.exports = router;
