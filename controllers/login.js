var { comparePassword, getUserByUserId  } = require('../utils/userUtil');
require('dotenv').config();
const jwt = require('jsonwebtoken');
let jwtSecretKey = process.env.secretkey;

function login(req, res) {
    const { loginId, password } = req.body;
    if (loginId && password) {
        getUserByUserId(loginId, (err, user) => {
            if (!user) {
                res.json({ status: false, message: 'The user does not exist!' });
            } else {
                comparePassword(password, user.password, (error, isMatch) => {
                    if (error) throw error;
                    if (isMatch) {
                        if (user.role == 'user' || user.role == 'admin') {
                            const payload = { id: user.id, role: user.role};
                            const token = jwt.sign(payload, jwtSecretKey, {
                                expiresIn: '24h'
                            });
                            res.json({ successful: true, token, email: user.email, role: user.role });
                        }

                    } else {
                        res.status(401).json({
                            successful: false,
                            message: 'The password is incorrect!'
                        });
                    }
                });
            }
        });
    } else {
        res.json({status: false, message: 'You need to input a valid username and password.'});
    }
}



module.exports = { login };