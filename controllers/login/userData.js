const { user } = require('../schema/mongodb')
const values = [];
// returns an object with the cookies' name as keys
var data = [];

user.find({}, (err, docs) => {
    if (err) { console.log(err) } else {
        data = [...docs];
    }
});

const userData = () => {
    return data;
}

module.exports = userData;