const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wardrobeSchema = new Schema({
    clotheType: String,
    picture: String,
    publicId: String,
    ownerId: String,
    createDate: Date,
    updateDate: Date
});

const wardrobe = mongoose.model("wardrobe", wardrobeSchema);
module.exports.wardrobe = wardrobe;

const feedbackSchema = new Schema({
    name: String,
    email: String,
    message: String,
    createDate: Date
});

const feedback = mongoose.model("feedback", feedbackSchema);
module.exports.feedback = feedback;