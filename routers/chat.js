const express = require('express');
const { chatData, chatList } = require('../controllers/schema/mongodb');
const { hasRole } = require('../controllers/login/checkRoles')
const router = express.Router();
const { checkIfChatExists } = require("../controllers/chat/chatCheck")
router.route("/fetchchatItems").get(function (req, res) {
    try {
        res.send("Dont work now");
    } catch {
        res.status(401).sendFile("/home/clemens/Dokumente/auth/web/401.html");
    }
});

router.post("/createChat", (req, res) => {
    try {
        // need name,users, create id
        var { name, users } = req.query;
        var chatId = Math.floor(Math.random() * 1000000000000) + 1;
        var newChat = [{ name: name, users: JSON.parse(users), id: chatId }];
        // console.log(newChat);
        chatList.insertMany(newChat, function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send("Success")
            }
        });
    } catch {
        res.status(401).sendFile("/home/clemens/Dokumente/auth/web/401.html");
    }
})

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
                                        res.status(200).send("Success !")
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
router.get("/getMessages", (req, res) => {
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


module.exports = router;