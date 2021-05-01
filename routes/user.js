const express = require('express');
const User = require('../models/User.js'); // User schema
const Admin = require('../models/Admins.js');
const router = express.Router();

// route to sign in users
router.post("/signin", async function (req, res, next) {

    const uid = req.body.uid;
    let userRecord = await User.findOne({ UserId: uid });
    if (userRecord == undefined) {
        const user = new User({
            UserId: uid,
            UserName: req.body.userName,
            Email: req.body.email,
            IsAdmin: false,
            Score: 0
        });
        const r = await user.save();
        console.log(r);
        res.send({ message: "User registered." });
    } else {
        res.send({ message: "User signed in." });
    }

});

// router to sign in admin
router.post("/adminsignin", async function (req, res, next) {
    const uid = req.body.uid;
    let userRecord = await Admin.findOne({ UserId: uid });
    if (userRecord == undefined) {
        res.status(403).send({ message: "UID not recorded." });
    } else {
        res.status(200).send({ message: "Admin signed in." });
    }
});

module.exports = router;