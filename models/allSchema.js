const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./register');
const UserSchema = mongoose.model('User',User.User).Schema;

const notes = new Schema({
    title: String,
    body: String,
    ownerId: String,
    createDate: Date
});

const noteSchema = mongoose.model("notes", notes);
module.exports.noteSchema = noteSchema;
