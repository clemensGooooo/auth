const getAppCookies = require('../cookies/cookiesParse');
const { user } = require('../schema/mongodb')

// authentificate
const authentication = (req, res, next) => {
    try {
        // use a controller to get the cookies
        const cookies = getAppCookies(req);
        if (cookies["token"] == undefined) {
            // if you don't have a token
            if (req.url == "/login.html" || req.url == "/login/auth" ||
                req.url == "/img/background.JPG" || req.url == "/img/unauthorized.jpeg" ||
                req.url == "/logger/userInfos") {
                req.authentication = false;
                next();
            } else {
                res.status(409).send('<meta http-equiv="refresh" content="0.01; URL=/login.html">');
            }
        } else {
            req.cookiesUsed = cookies["token"];
            // find the token in the database

            user.findOne({ token: cookies["token"] }, (err, docs) => {
                if (err) { console.log(err) } else { return docs; }
            }).clone().then(picedUser => {
                // if authentification is true
                if (picedUser.deaktivated == false) {
                    req.authentication = true;
                    next();
                } else if (req.url == "/login/logout") {
                    next();
                } else {
                    res.status(412).sendFile(__dirname + 'web/issue.html');
                }
            }).catch(err => {
                console.error(err);
            });

        }
    } catch {
        // if you don't have a token
        if (req.url == "/login.html" || req.url == "/login/auth" || req.url == "/img/background.JPG" ||
            req.url == "/img/unauthorized.jpeg" || req.url == "/logger/userInfos" ||
            req.url == "/shop" || req.url == "/shopper/fetchdata" ||
            req.url == "/img/unauthorized.jpeg" || req.url == "/logger/userInfos" ||
            req.url.startsWith("/shop") == true || req.url == "/shopper/buy" ||
            req.url == "/img/50x65-Robot.png") {
            req.authentication = false;
            next();
        } else {
            res.status(401).send('<meta http-equiv="refresh" content="0.01; URL=/login.html">');
        }
    }
}
module.exports = authentication;