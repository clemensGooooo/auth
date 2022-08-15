const getAppCookies = require('../cookies/cookiesParse');
const { user } = require('../schema/mongodb');
const userData = require('./userData');

const authorization = (req, res, next) => {
    if (req.authentication == true) {

        try {
            const cookies = getAppCookies(req);
            let y = cookies["token"];
            let value = userData().find(val => val.token === y);
            let docs = {
                name: value.name,
                roles: value.roles
            }
            req.authorization = docs;
            next();
        } catch {
            // console.log(req.url)
            if (req.url == "/login" || req.url == "/img/background.JPG") {
                next();
            } else {
                res.status(401).send('<meta http-equiv="refresh" content="0.01; URL=/">');
            }
        }
    } else {
        next();
    }
}

module.exports = authorization;