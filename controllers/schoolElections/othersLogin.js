// Login for voters and other people.
const cryptoSecret = process.env.cryptoSecret;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let jwtSecretKey = process.env.secretkey;

async function votersSubadminContestantLogin(req, res) {
    const {loginID, password} = req.body;

    let decryptedObj = CryptoJS.AES.decrypt(loginID, cryptoSecret);
    const data = CryptoJS.enc.Utf8.stringify(decryptedObj)
    const parsedObj = JSON.parse(data);
    
    const passwordMatch = await bcrypt.compare(password, parsedObj.password);

    if(passwordMatch) {
        const token = jwt.sign({email: parsedObj.email, userDetails: parsedObj.userDetails, role: parsedObj.role, electionID: parsedObj.electionID}, jwtSecretKey);
        res.json({ successful: true, token, email: parsedObj.email, role: parsedObj.role });
    } else {
        res.json({successful: false, message: 'Passwords don\'t match'});
    }
}