const { register } = require('../models/register');

function isRestricted(req, res, next) {
    register.findById(req.decoded.id, 'status', (err, user) => {
        if (err) {
            return console.log(err);
        }
        else if (user.emailVerified == false) {
            res.json({
                success: false,
                message: "Restricted, confirm your email address."
            });
        }
        else if (user.suspended == true) {
            res.json({
                success: false,
                message: "You have been suspended from voting."
            });
        }
        else {
            next();
        }
        
    });
}



module.exports = isRestricted;