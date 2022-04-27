const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { register } = require('./register');

const studentElectionSchema = new Schema({
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
    electionGenID: String,
    duration: String,
    electionStatus: {
        type: String,
        enum: ['active', 'concluded', 'paused']
    },
    subAdmins: Object,
    adminApprovedVoters: Object,
    contestants: Object,
    schoolEmail: String,
    verifiedElection: Boolean,
    createDate: Date,
    modifyDate: Date
});

const studentElection = mongoose.model("studentElections", studentElectionSchema);


module.exports = { studentElection };