const express = require('express');
const router = express.Router();
const { chatData, chatList, chatUserPreferences } = require('../controllers/schema/mongodb');
const { hasRole } = require('../controllers/login/checkRoles')
const { checkIfChatExists, checkIfUserExistsInProfile } = require("../controllers/chat/chatCheck")
const fileUpload = require('express-fileupload');
const { createNewChatIcon, createChatInDatabase,
    sendFileSave, sendFileDatabase } = require('../controllers/chat/chat');
const fs = require("fs")
const api = require("../controllers/chat/api")

router.use(fileUpload())
router.post('/createChat', createNewChatIcon, createChatInDatabase)

router.route("/fetchchatItems").get(function (req, res) {
    try {
        res.send("Dont work now");
    } catch {
        res.status(401).sendFile("/home/clemens/Dokumente/auth/web/401.html");
    }
});

router.post("/deleteChat", (req, res) => {
    try {
        var { id } = req.query;
        chatList.find({ id: id }, function (err, result) {
            if (err) {
                res.send(err);
            } else {
                if (result.length == 1) {
                    if (result[0].users.includes(req.authorization.name)) {
                        // console.log("He can delete this chat !")
                        chatList.deleteMany({ id: id }, (err2, result2) => {
                            if (err2) {
                                res.send(err);
                            } else {
                                chatData.deleteMany({ id: id }, (err3, result3) => {
                                    if (err3) {
                                        res.send(err);
                                    } else {
                                        if (result[0].img != null && result[0].img != undefined &&
                                            result[0].img != "") {
                                            fs.unlink("web/chat/upload/" + result[0].img, (err) => {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    res.status(200).send("Success")
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        })
                    } else {
                        res.status(400).send("No chat to delete !")
                    }
                } else {
                    res.status(400).send("No chat to delete !")
                }
            }
        });
    } catch (err) {
        console.error(err);
    }
})

router.post("/deleteHistory", (req, res) => {
    try {
        var { id } = req.query;
        chatList.find({ id: id }, function (err, result) {
            if (err) {
                res.send(err);
            } else {
                if (result.length == 1) {
                    if (result[0].users.includes(req.authorization.name)) {
                        // console.log("He can delete this history !")
                        chatData.deleteMany({ id: id }, (err2, result2) => {
                            if (err2) {
                                res.send(err);
                            } else {
                                res.status(200).send("Success !")
                            }
                        })

                    } else {
                        res.status(400).send("No chat to delete !")
                    }
                } else {
                    res.status(400).send("No chat to delete !")
                }
            }
        });
    } catch (err) {
        console.error(err);
    }
})

router.post("/deleteMessage", (req, res) => {
    try {
        var { id, messageID } = req.query;
        chatList.find({ id: id }, function (err, result) {
            if (err) {
                res.send(err);
            } else {
                if (result.length == 1) {
                    if (result[0].users.includes(req.authorization.name)) {
                        // console.log("He can delete this history !")
                        chatData.deleteOne({ _id: messageID }, (err2, result2) => {
                            if (err2) {
                                res.send(err);
                            } else {
                                res.status(200).send("Success !")
                            }
                        })

                    } else {
                        res.status(400).send("No chat to delete !")
                    }
                } else {
                    res.status(400).send("No chat to delete !")
                }
            }
        });
    } catch (err) {
        console.error(err);
    }
})

router.post("/sendMessage", (req, res) => {
    try {
        var { id, user, ip, text } = req.query;
        var newMessage = [{
            id: id,
            text: text,
            user: user,
            ip: ip,
            time: Date.now()
        }];
        // console.log(newMessage);
        checkIfChatExists(id).then((state) => {
            if (true == state) {
                chatData.insertMany(newMessage, function (err, result) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.status(200).send("Success")
                    }
                });
            }
        })
    } catch (err) {
        res.send("Sorry internal server error !")
        console.error(err);
    }
})

router.post("/sendFile",
    sendFileSave,
    sendFileDatabase);

router.get("/getMessages", (req, res) => {
    var { id } = req.query;
    checkIfChatExists(id).then((state) => {
        if (true == state) {
            chatData.find({ id: id }, function (err, result) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(result.reverse());
                }
            }).sort('-time').limit(4);
        }
    });
});

router.get("/getAllMessages", (req, res) => {
    var { id } = req.query;
    checkIfChatExists(id).then((state) => {
        if (true == state) {
            chatData.find({ id: id }, function (err, result) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(result);
                }
            });
        }
    });
});

router.get("/getChats", (req, res) => {
    try {
        var { user } = req.query;
        // console.log(user);
        chatList.find({
            $expr: {
                $in: [user, "$users"]
            }
        },
            (err, result) => {
                if (err) {
                    res.status(201).send(err);
                } else {
                    res.send(result);
                }
            });
    } catch (err) {
        console.error(err);
    }
});
router.use("/api", api);

router.post("/setSettings", (req, res, next) => {
    try {
        const { user, name, profile } = req.body;
        checkIfUserExistsInProfile(user).then((value) => {
            if (value === false) {
                var preferences = [{
                    userName: user,
                    name: "",
                    img: "",
                    profile: ""
                }]
                if (name != undefined)
                    preferences[0].name = name;
                if (req.files != undefined)
                    if (req.files.File.size < 50369528)
                        if (req.files)
                            if (req.files.File != undefined)
                                preferences.img = Math.floor(Math.random() * 1000000000000) + 1
                                    + req.files.File.name;
                if (profile != undefined)
                    preferences[0].profile = profile

                chatUserPreferences.insertMany(preferences, () => {
                    if (preferences.img != value[0].img)
                        req.files.File.mv(`web/chat/user/` + preferences.img, (err) => {
                            if (err) {
                                res.status(400).send(err);
                            } else {
                                res.status(200).send("Success")
                            }
                        })
                })
            } else {
                var preferences = {
                    userName: user,
                    name: value[0].name,
                    img: value[0].img,
                    profile: value[0].profile
                }
                if (name != undefined)
                    preferences.name = name;
                if (req.files != undefined)
                    if (req.files.File.size < 50369528)
                        if (req.files)
                            if (req.files.File != undefined)
                                preferences.img = Math.floor(Math.random() * 1000000000000) + 1
                                    + req.files.File.name;
                if (profile != undefined)
                    preferences.profile = profile

                chatUserPreferences.updateOne(preferences, () => {
                    if (preferences.img != value[0].img)
                        req.files.File.mv(`web/chat/user/` + preferences.img, (err) => {
                            if (err) {
                                res.status(400).send(err);
                            } else {
                                if (value[0].img != "")
                                    fs.unlink("web/chat/user/" + value[0].img, (err) => {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            res.status(200).send("Success")
                                        }
                                    })
                            }
                        })
                })
            }
        })
    } catch (error) {
        console.error(error);
    }
});

router.post("/settings", (req, res) => {
    const { user } = req.body;
    chatUserPreferences.findOne({ user: user }, (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(result)
        }
    })
})
module.exports = router;
