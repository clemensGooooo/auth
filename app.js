// web connection
const express = require('express')
const app = express();

// var bodyParser = require("body-parser");

// routers for the routers
const auth = require('./routers/auth')
const logger = require('./routers/logger');
const productManagement = require('./routers/productManagement');
const shop = require('./routers/shop');
const youtube = require('./routers/youtube');
const chat = require('./routers/chat')
const administaration = require("./routers/administaration")
const cors = require("cors")

// controller for the good login
const authentication = require('./controllers/login/authentication');
const authorization = require('./controllers/login/authorization');

app.use(cors({ origin: true, credentials: true, methods: 'GET,PUT,POST,OPTIONS', allowedHeaders: 'Content-Type,Authorization' }));

// log connection, and ""
app.use([authentication, authorization]);
app.use(express.urlencoded({ extended: false }));

// use web part and json
app.use(express.json());
app.use(express.static('./web'));
app.use('/login', auth);
app.use('/logger', logger);
app.use('/productManagement', productManagement);
app.use('/shopper', shop);
app.use('/youtube', youtube);
app.use('/chat', chat);
app.use('/administration', administaration);

// start the webservice on port :5000
app.listen(5000, () => {
    console.log("Server listen to port 5000...");
})
