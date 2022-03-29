const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentElectionSchema = new Schema({
    electionTitle: String,
    adminId: String,
    electoralType: String,
    pollAccess: String,
    duration: String,
    password: String,
    createDate: Date
});

const studentElection = mongoose.model("studentElections", studentElectionSchema);


module.exports = { studentElection };