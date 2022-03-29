var express = require('express');
var router = express.Router();
const { createElection } = require('../controllers/schoolAdmin');

router.post('/create-election', createElection);

module.exports = router;