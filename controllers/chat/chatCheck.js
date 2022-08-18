const { chatList, chatUserPreferences } = require("../schema/mongodb")
const checkIfChatExists = async (id) => {
    try {
        const data = await chatList.find({})
        for (let x = 0; x < data.length; x++) {
            const element = data[x];
            if (element.id == id) {
                return true;
            }
        }
        return false;

    } catch (err) {
        console.error(err);
    }
}

const checkIfUserExistsInProfile = async (userName) => {
    try {
        let x = await chatUserPreferences.find({ "userName": userName })
        if (Array.isArray(x))
            if (x.length == 0) {
                return false;
            } else {
                return x;
            }
        else return false
    } catch (err) {
        return err;
    }
}

module.exports = { checkIfChatExists, checkIfUserExistsInProfile }