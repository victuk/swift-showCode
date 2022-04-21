var express = require('express');
var router = express.Router();
const { vote, getElectionByGenId } = require('../controllers/vote');
let authLogin = require('../auth/loginAuth');



router.post('/vote', authLogin, vote);

router.get('/election', getElectionByGenId);

module.exports = router;
