const { chatList, chatData } = require("../schema/mongodb");

const createNewChatIcon = (req, res, next) => {
    var { users, name } = req.body, img = "";
    users = JSON.parse(users)
    if (req.files != undefined) {
        if (users.length > 0 && req.files.File.size < 2300000) {
            if (req.files) {
                // console.log(req.files);
                var file = req.files.File;
                var filename = Math.floor(Math.random() * 1000000000000) + 1;
                file.mv(`web/chat/upload/` + filename + file.name, (err) => {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        req.dataNew = { users: users, name: name, img: filename + file.name }
                        next()
                    }
                })
            }
        } else {
            res.send("Select more Users or file smaller");
            console.log("No user");
        }
    } else {
        req.dataNew = { users: users, name: name, img: "" }
        next()
    }
}

const createChatInDatabase = (req, res, next) => {
    try {
        var { users, name, img } = req.dataNew;
        // need name,users, create id
        var chatId = Math.floor(Math.random() * 1000000000000) + 1;
        var newChat = [{
            name: name,
            users: users,
            id: chatId,
            img: img
        }];
        // console.log(newChat);
        chatList.insertMany(newChat, function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send("Finish");
            }
        });
    } catch {
        res.status(401).sendFile("/home/clemens/Dokumente/auth/web/401.html");
    }
}

const sendFileSave = (req, res, next) => {
    var { user, text, id } = req.body
    if (req.files != undefined) {
        if (req.files.File.size < 50369528) {
            if (req.files) {
                var file = req.files.File;
                // console.log(file);
                var fileType = file.mimetype;
                var filename = Math.floor(Math.random() * 1000000000000) + 1;
                file.mv(`web/chat/chatFiles/` + filename + file.name, (err) => {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        req.dataNew = {
                            user: user, text: text,
                            file: `${filename}${file.name}`, id: id,
                            fileType: fileType
                        }
                        next()
                    }
                })
            }
        } else {
            res.send("File is too large.. ");
        }
    } else {
        res.send("No file selected")
    }
}

const sendFileDatabase = (req, res, next) => {
    try {
        var { user, text, id, file, fileType } = req.dataNew
        // console.log(user, text, id, file);
        var textFile = ""
        if (fileType.startsWith("image"))
            textFile = `![${text}](${file})`;
        else if (fileType.startsWith("video"))
            textFile = `?[${text}](${file})`;
        else if (fileType == "application/pdf")
            textFile = `*[${text}](${file})`;
        else
            textFile = `%[${text}](${file})`;
        if (textFile != "") {
            var send = [{
                id: id,
                user: user,
                time: Date.now(),
                text: textFile,
                ip: "19038.309"
            }];
            // console.log(send);
            chatData.insertMany(send, function (err, result) {
                if (err) {
                    res.send(err);
                } else {
                    res.send("Finish");
                }
            });
        }
    } catch {
        res.status(401).sendFile("/home/clemens/Dokumente/auth/web/401.html");
    }
}


// TODO: #1 Read all files from send and save them in local directory

module.exports = {
    createNewChatIcon: createNewChatIcon,
    createChatInDatabase: createChatInDatabase,
    sendFileSave: sendFileSave,
    sendFileDatabase: sendFileDatabase
};