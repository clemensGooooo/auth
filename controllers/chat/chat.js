const { chatList } = require("../schema/mongodb");

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

module.exports = {
    createNewChatIcon: createNewChatIcon,
    createChatInDatabase: createChatInDatabase
};