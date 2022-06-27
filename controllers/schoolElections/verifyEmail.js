const CryptoJS = require("crypto-js");
const { register } = require("../../models/register");
const cryptoSecret = process.env.cryptoSecret;
const jwt = require("jsonwebtoken");
require('dotenv').config();
let jwtSecretKey = process.env.secretkey;
// function verify(req, res) {
//     let ciphertext = req.body.ciphertext;
//     let bytes  = CryptoJS.AES.decrypt(ciphertext, cryptoSecret);
//     let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

//     console.log(decryptedData);
// }

function verifyEmail(req, res) {
    const {ciphertext} = req.body;
    let decryptedObj = CryptoJS.AES.decrypt(ciphertext, cryptoSecret);
    const data = CryptoJS.enc.Utf8.stringify(decryptedObj)
    const parsedObj = JSON.parse(data);
    register.findByIdAndUpdate(parsedObj.id, {emailVerified: true}, function(err, docs) {
      if(err) console.log(err);

      const payload = { id: docs.id, role: docs.role};
        const token = jwt.sign(payload, jwtSecretKey, {
            expiresIn: '24h'
        });
        res.json({ successful: true, token, email: docs.email, role: docs.role });
    
    });
  }

  module.exports = {
    verifyEmail
}
