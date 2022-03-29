var express = require('express');
var router = express.Router();
var regUser = require('../models/register');




router.post('/', function (req, res) {
    if (req.body.email &&
        req.body.firstName &&
        req.body.lastName &&
        req.body.companyName &&
        req.body.nextOfKin &&
        req.body.gender &&
        req.body.password &&
        req.body.role &&
        req.body.location) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const gender = req.body.gender;
    const companyName = req.body.companyName;
    const email = req.body.email;
    const nextOfKin = req.body.nextOfKin;
    const password = req.body.password;
    const role = req.body.role;
    const location = req.body.location;

    const newUser = new regUser({
        firstName,
        lastName,
        companyName,
        gender,
        nextOfKin,
        email,
        password,
        role,
        location,
        profilePicture: 'default',
        status: 'active',
        favouriteCompanies: [],
        createDate: Date.now()
    });

    regUser.getUserByEmail(email, (err, user) => {
        if (!user) {
            regUser.createUser(newUser, function (error, user) {
                if (error) {
                    res.status(422).json({
                        message: 'Something went wrong!'
                    })
                }
                res.json({ message: 'ok', user });
            });
        } else {
            res.json({message: "This email is already used"});
        }
    });


} else {
    res.json({message: 'Your input details are not complete.'});
}

});

module.exports = router;
