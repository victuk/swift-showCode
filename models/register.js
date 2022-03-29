const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RegisterSchoolAdminSchema = new Schema({
    schoolName: String,
    surName: String,
    initials: String,
    phoneNumber: String,
    schoolRole: String,
    schoolEmail: String,
    numberOfAdmins: Number,
    electionType: String,
    creator: Boolean,
    creatorId: String,
    electionTitle: String,
    adminId: String,
    electoralType: {
        type: String,
        enum: ['firstPassThePost', 'plurality']
    },
    pollAccess: {
        type: String,
        enum: ['openAccessPool', 'closedAccessPool']
    },
    duration: String,
    email: String,
    picture: String,
    publicId: String,
    skinType: String,
    gender: String,
    emailVerified: Boolean,
    suspended: Boolean,
    password: String,
    role: String
});

const register = mongoose.model('User', RegisterSchoolAdminSchema);



module.exports = { register };















// const RegisterSchema = new Schema({
//     fullName: String,
//     email: String,
//     picture: String,
//     publicId: String,
//     skinType: String,
//     gender: String,
//     password: String,
//     role: String
// });

// const User = mongoose.model('User', RegisterSchema);
// module.exports = User;

