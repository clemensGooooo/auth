const express = require('express');
const { shop } = require('../controllers/schema/mongodb');
const { hasRole } = require('../controllers/login/checkRoles')
const router = express.Router();
const uploadController = require("../controllers/shop/uploadControllers");


router.post("/multiple-upload",
    uploadController.uploadImages,
    uploadController.resizeImages,
    uploadController.getResult
);

router.route("/fetchdata").get(function(req, res) {
    try {
        shop.find({}, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });
    } catch {
        res.status(401).sendFile("/home/clemens/Dokumente/auth/web/401.html");
    }
});

router.post("/buy", (req, res) => {
    console.log(req.body);
    res.send("Perfect !")
})

router.get('/test', (req, res) => {
    if (hasRole(req.authorization, "user", "c") == true) {
        try {
            res.status(200).send("Hi");
        } catch {
            res.status(401).sendFile("/home/clemens/Dokumente/auth/web/401.html");
        }
    } else {
        res.status(401).sendFile("/home/clemens/Dokumente/auth/web/401.html");
    }
})

module.exports = router;