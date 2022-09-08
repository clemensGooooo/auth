const express = require('express');
const router = express.Router();
const { cookies } = require('../controllers/schema/mongodb');

router.get("/getLogger", (req, res) => {
    cookies.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            var newData = result.filter((val, index, arr) => {
                return val.hacker != true
            })
            res.send(newData);
        }
    })
})
router.get("/getHackerData", (req, res) => {
    cookies.find({ hacker: true }, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

module.exports = router;