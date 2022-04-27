let { register } = require("../models/register");
let { theroles } = require("../auth/accessControl");
let { comparePassword } = require("../utils/userUtil");

async function changeProfile(req, res) {
    const userId = req.decoded.id;
    const userDetails = await register.findById(userId);
    if(userDetails.role == theroles.voter) {
        register.findByIdAndUpdate(userId, {
            surName,
            otherNames,
            regNumber,
            department,
            faculty,
            modifyDate: Date.now()
        }, function(err, voter) {
            if(err) console.log(err);
            res.json({successful: true, message: 'Profile Update Successful'});
        });
    }
    if (userDetails.role == theroles.schoolAdmin) {
        register.findByIdAndUpdate(userId, {
            schoolName,
            surName,
            otherNames,
            phoneNumber,
            schoolRole,
            modifyDate: Date.now()
        }, function(err, voter) {
            if(err) console.log(err);
            res.json({successful: true, message: 'Profile Update Successful'});
        });
    }
}

async function changeProfilePicture(req, res) {
    const userId = req.decoded.id;
    const { picture } = req.body;
    register.findByIdAndUpdate(userId, {
        picture
    }, function(err, user) {
        if(err) console.log(err);
            res.json({successful: true, message: 'Profile Picture Update Successful'});
    });
}

async function changePassword(req, res) {
    let userId = req.decoded.id;
    let { newPassword } = req.body;

    const userDetails = await register.findById(userId);
    comparePassword(newPassword, userDetails.password, function(err, isMatch){
        if(err) console.log(err);
        if(isMatch) {
            bcryptjs.genSalt(10, (err, salt) => {
                bcryptjs.hash(newPassword, salt, (error, hash) => {
                    if(error) console.log(error);
                    register.findByIdAndUpdate(userId, {
                        password: hash
                    }, function(err, user) {
                        if(err) console.log(err);
                        res.json({successful: true, message: "Password changed successfully"});
                    });
                });
            });
        }
    });
}

module.exports = { changeProfile, changeProfilePicture, changePassword }
