const express = require('express');
const { send } = require('express/lib/response');
const router = express.Router();
const { hasRole } = require('../controllers/login/checkRoles')
const { productData } = require('../controllers/schema/mongodb');

router.route("/fetchdata").get(function(req, res) {
    if (hasRole(req.authorization, "user", "r") == true) {
        try {
            productData.find({}, function(err, result) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(result);
                }
            });
        } catch {
            res.status(401).sendFile("/home/clemens/Dokumente/auth/web/401.html");
        }
    } else {
        res.status(401).sendFile("/home/clemens/Dokumente/auth/web/401.html");
    }
});

router.post('/newProduct', (req, res) => {
    if (hasRole(req.authorization, "user", "c") == true) {
        try {
            const { name, notices, tags, pieces, price } = req.body;
            var rand = Math.floor(Math.random() * 10000000000) + 1;
            var data = [
                { id: rand, name: name, notices: notices, tags: tags, pieces: pieces, price: price, deactivated: false, time: Date.now() }
            ]
            console.log(data);
            productData.insertMany(data, function(err, result) {
                if (err) {
                    res.send(err);
                } else {
                    res.send("Success")
                }
            });
        } catch {
            res.status(401).sendFile("/home/clemens/Dokumente/auth/web/401.html");
        }
    } else {
        res.status(401).sendFile("/home/clemens/Dokumente/auth/web/401.html");
    }
})

router.delete('/deleteProduct', (req, res) => {
    if (hasRole(req.authorization, "user", "d") == true) {
        try {
            productData.deleteOne({ id: req.body.id }).then(() => {
                res.status(200).send("Perfect !");
            });
        } catch {
            res.status(401).send("Error !");
        }
    }
});

router.put('/updateProduct', (req, res) => {
    try {
        productData.findOne({
                id: req.body.id
            },
            (err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    if (hasRole(req.authorization, "user", "u") == true) {
                        productData.updateOne({ id: req.body.id }, { price: req.body.price + result.price, pieces: req.body.pieces + result.pieces }, function(err, result) {
                            if (err) {
                                console.log(err)
                            } else {
                                //console.log("Result :", result)
                            }
                        });
                        res.status(200).send("Pefect !");
                    } else {
                        res.status(401).sendFile("/home/clemens/Dokumente/auth/web/401.html");
                    }
                }
            });
    } catch {
        res.status(500), send("Error !");
    }
});
module.exports = router;