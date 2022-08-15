const { chatList } = require("../schema/mongodb")
const checkIfChatExists = async(id) => {
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
module.exports = { checkIfChatExists }