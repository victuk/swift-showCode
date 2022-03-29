const User = require('../models/register');
// const Blog = require('../models/Blogs');

const theroles = {
    voter: "voter",
    admin: "admin",
    schoolAdmin: "schoolAdmin"
}

// function hasAccess(req, res, next){

//         Blog.findById(req.params.id, function(error, blog) {
//             if(error) {console.log(error)}

//             if(req.decoded.id == blog.userID) {
//                 next();
//             } else {
//                 User.findById(req.decoded.id, function(error, user) {
//                     if(error) {res.send('Error = ' + error)}
//                     if(user.role == theroles.admin) {
//                         next();
//                     } else {
//                         res.send('You are forbidden from taking this action');
//                     }
//                 })
//             }
//         })


// }


const hasAccess = {
    everyone (req, res, next) {
        next();
        // if (req.decoded.role == theroles.admin ||
        //     req.decoded.role == theroles.driver ||
        //     req.decoded.role == theroles.staff ||
        //     req.decoded.role == theroles.user ) {
                
        //     } else {
        //         res.json({
        //             success: false,
        //             message: "Not Authorized"
        //         });
        //     }
    },
    staffAndAdmin (req, res, next) {
        if (req.decoded.role == theroles.staff ||
            req.decoded.role == theroles.admin) {
                next();
            } else {
                res.json({
                    success: false,
                    message: "Not Authorized"
                });
            }
    },
    managerAndAdmin (req, res, next) {
        if (req.decoded.role == theroles.manager ||
            req.decoded.role == theroles.admin) {
                next();
            } else {
                res.json({
                    success: false,
                    message: "Not Authorized"
                });
            }
    },
    adminOnly (req, res, next) {
        if (req.decoded.role == theroles.admin) {
                next();
                
            } else {
                res.json({
                    success: false,
                    message: "Not Authorized"
                });
            }
    },
    staffOnly (req, res, next) {
        if (req.decoded.role == theroles.staff) {
                next();
            } else {
                res.json({
                    success: false,
                    message: "Not Authorized"
                });
            }
    },
    driverOnly (req, res, next) {
        if (req.decoded.role == theroles.driver) {
                next();
            } else {
                res.json({
                    success: false,
                    message: "Not Authorized"
                });
            }
    },
    userOnly (req, res, next) {
        if (req.decoded.role == theroles.user) {
                next();
            } else {
                res.json({
                    success: false,
                    message: "Not Authorized"
                });
            }
    },

}

module.exports = hasAccess;
module.exports.theroles = theroles;
