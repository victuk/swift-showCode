var express = require("express");
var router = express.Router();
// var allSchema = require('../models/allSchema');
// var passport = require('passport');
var wardrobeSchema = require("../models/wardrobe");
var regUser = require("../models/register");
const authLogin = require("../auth/loginAuth");
var axios = require("axios");
// const hasAccess = require('../auth/accessControl');
// const isRestricted = require('../auth/isRestricted');

// var cloudinary = require('cloudinary').v2;

router.get("/try-ml", async function (req, res) {
  try {
    let response = await axios.post(
      "https://cloth-prediction-algorithm.herokuapp.com/identify-picture",
      {
        picture:
          "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-1029520080.jpg",
      }
    );
    console.log(response);
    res.send(response);
  } catch (error) {
    console.log("error");
    res.send(error);
  }
});

router.get("/checkgender", authLogin, async function(req, res) {
  const gender = await regUser.findById(req.decoded.id, 'gender');
  res.json({gender});
});

router.get("/clothes", authLogin, async function (req, res) {
  const allClothes = await wardrobeSchema.wardrobe.find(
    { ownerId: req.decoded.id },
    ""
  );
  res.json(allClothes);
});

router.post("/clothe", authLogin, async function (req, res) {
  // return console.log(req.body);
  // let { clotheType, picture, publicId } = req.body
    let response = await axios.post(
      "https://cloth-prediction-algorithm.herokuapp.com/identify-picture",
      {
        picture: req.body.picture
      }
    );
    console.log(response.data);
 
  var clotheType = response.data.pictureType;
  var picture = req.body.picture;
  var publicId = req.body.publicId;
  let ownerId = req.decoded.id;

  let newWearClothes = new wardrobeSchema.wardrobe({
    clotheType,
    picture,
    publicId,
    ownerId,
    createDate: Date.now(),
    updateDate: Date.now(),
  });

  newWearClothes.save(function (err, savedWear) {
    if (err) {
      return console.log(err);
    }
    res.json({ status: true, savedWear });
  });
});

router.get("/clothe/:type", authLogin, async function (req, res) {
  const specificClothe = await wardrobeSchema.wardrobe.find(
    {ownerId: req.decoded.id, clotheType: req.params.type},
    ""
  );
  res.json(specificClothe);
});

router.delete("/clothe/:id", authLogin, async function (req, res) {
  const deletedClothe = await wardrobeSchema.wardrobe.findByIdAndDelete(
    req.params.id,
    ""
  );
  res.json({
    success: true,
    deleted: deletedClothe,
  });
});

router.post("/feedback", async function (req, res) {
  let newName = new wardrobeSchema.feedback({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  });

  newName.save(function (err, savedFeedback) {
    if (err) return console.log(err);
    res.json(savedFeedback);
  });
});

module.exports = router;
