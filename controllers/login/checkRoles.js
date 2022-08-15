const { resurce } = require('../schema/mongodb.js');
let rights = {};
resurce.findOne({}, ((err, result) => { rights = result }));


const hasRole = (authorization, which, toDo) => {
    try {
        let s = JSON.stringify(rights);
        let t = JSON.parse(s);
        let person1;
        if (which == "owner") person1 = t.owner;
        if (which == "admin") person1 = t.user;
        if (which == "user" || which == "worker") person1 = t.user;
        let person2;
        for (let x = 0; x < authorization.roles.length; x++) {
            const element = authorization.roles[x];
            if (element == "owner") {
                person2 = person1.owner;
                break;
            };
            if (element == "admin") {
                person2 = person1.admin;
            };
            if (element == "user") {
                person2 = person1.user;
            };
        }
        if (Array.isArray(person2) == true) {
            for (let x = 0; x < person2.length; x++) {
                const element = person2[x];
                if (element == toDo) {
                    return true;
                }
            }
            return false;
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = { hasRole };