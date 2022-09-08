const express = require("express")
const router = express.Router();
const { cookies } = require("../controllers/schema/mongodb");

router.post("/userInfos", (req, res) => {
    var data = [
        req.body
    ]
    data[0].time = Date.now()
    // console.log(data);
    cookies.insertMany(data, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

module.exports = router;