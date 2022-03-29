const User = require('../models/register');

function isRestricted(req, res, next) {
    User.findById(req.decoded.id, 'status', (err, user) => {
        if (err) {
            return console.log(err);
        }
        if (user.status == 'restricted') {
            res.json({
                success: false,
                message: "Restricted, confirm your email address."
            });
        } else {
            next();
        }
        
    });
}



module.exports = isRestricted;