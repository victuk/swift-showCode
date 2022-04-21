const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const universalRegister = new Schema({
    schoolName: String,
    surName: String,
    otherNames: String,
    phoneNumber: String,
    schoolRole: String,
    schoolEmail: String,
    publicId: String,
    email: String,
    picture: String,
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    regNumber: String,
    emailVerified: Boolean,
    suspended: Boolean,
    password: String,
    role: String,
    createDate: Date,
    modifyDate: Date
});

const register = mongoose.model('User', universalRegister);



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

