const express = require('express');
const { get } = require('express/lib/request');
const { json } = require('express/lib/response');
const res = require('express/lib/response');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { hasRole } = require('../controllers/login/checkRoles');

global.config = require('./config');
const getAppCookies = require('../controllers/cookies/cookiesParse')
const { user, roles } = require('../controllers/schema/mongodb');

const makeToken = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

// without rights you can enter that function
router.post('/auth', (req, res) => {
    const { email, pwd } = req.body;
    user.findOne({ email: email }, (err, docs) => {
        if (err) {
            console.log(err)
        } else {
            return docs;
        }
    }).clone().then(findUser => {
        // if the psw is correct
        if (req.headers.cookie != undefined) {
            const x = getAppCookies(req);
            if (x["CookieBy"] != undefined && x["CookieBy"] != "") {
                if (email == findUser.email) {
                    if (pwd == findUser.pwd && findUser.deaktivated == false) {
                        return res.cookie('token', findUser.token, {
                            maxAge: 20000000000,
                            httpOnly: true,
                        }).status(200)
                            .send('<meta http-equiv="refresh" content="0.01; URL=/">');

                    } else {
                        res.status(412).sendFile('/home/clemens/Dokumente/auth/web/issue.html');
                    }
                }
            } else {
                res.status(200).send('<meta http-equiv="refresh" content="0.01; URL=/">');
            }
        } else {
            res.status(200).send('<meta http-equiv="refresh" content="0.01; URL=/">');
        }

    }).catch(err => {
        console.error(err);
        res.status(401).sendFile('/home/clemens/Dokumente/auth/web/401.html');
    });
});


router.post('/newUser', (req, res) => {
    if (hasRole(req.authorization, "user", "c") == true) {
        try {
            const { name, email, pwd } = req.body;
            const token = makeToken(70);
            const rolesHere = req.body.roles;
            var data = [
                { name: name, email: email, pwd: pwd, roles: rolesHere, token: token, deaktivated: false }
            ]
            user.insertMany(data, function (err, result) {
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
})

router.delete('/deleteUser', (req, res) => {
    if (hasRole(req.authorization, "user", "d") == true) {
        try {
            user.deleteOne({ email: req.body.email }).then(() => {
                res.status(200).send("Perfect !");
            });
        } catch {
            res.status(401).send("Error !");
        }
    }
});
///////////////////////////////////////////////////////////////////////
router.put('/updatePWD', (req, res) => {
    try {
        user.updateOne({ email: req.body.email }, { pwd: req.body.pwd }).then(() => {
            res.status(200).send("Perfect !");
        });
    } catch {
        res.status(401).send("Error !");
    }
});

router.post('/updateAble', (req, res) => {
    user.findOne({
        email: req.body.email
    },
        (err, result) => {
            if (err) {
                res.send(err);
            } else {
                // overwrite pwd for secure
                result.pwd = "----";
                if (hasRole(req.authorization, result.roles[0], "u") == true) {
                    user.updateOne({ email: req.body.email }, { deaktivated: req.body.deaktivate }, function (err, result) {
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
})

router.route("/fetchdata").get(function (req, res) {
    try {
        user.find({}, function (err, result) {
            if (err) {
                res.send(err);
            } else {
                // overwrite pwd for secure
                result.forEach(element => {
                    element.pwd = "----";
                });
                res.send(result);
            }
        });
    } catch {
        res.status(401).sendFile("/home/clemens/Dokumente/auth/web/401.html");
    }

});

router.route("/fetchdataUser").get(function (req, res) {
    try {
        user.findOne({
            token: req.cookiesUsed
        },
            (err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    // overwrite pwd for secure
                    result.pwd = "----";
                    res.send(result);
                }
            });
    } catch {
        res.status(401).sendFile("/home/clemens/Dokumente/auth/web/401.html");
    }

});

router.route("/fetchRoles").get((req, res) => {
    if (hasRole(req.authorization, "owner", "r") == true) {
        try {
            roles.find({}, function (err, result) {
                if (err) {
                    res.send(err);
                } else {
                    // overwrite pwd for secure
                    result.forEach(element => {
                        element.pwd = "----";
                    });
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

router.post('/newRole', (req, res) => {
    if (hasRole(req.authorization, "owner", "c") == true) {
        try {
            const { name, notices, otherRoles } = req.body;
            var data = [
                { name: name, notices: notices, includes: otherRoles }
            ]
            roles.insertMany(data, function (err, result) {
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
})

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.sendStatus(200);
});
module.exports = router;