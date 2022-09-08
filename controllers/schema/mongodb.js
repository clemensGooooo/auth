const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/data', { useNewUrlParser: true })
const db = mongoose.connection;

db.on('error', error => console.error(error));
db.once('open', () => console.log("connected"));

// the schema of the table
const Schema = mongoose.Schema;
let user = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    pwd: {
        type: String
    },
    roles: {
        type: [String]
    },
    token: {
        type: String
    },
    deaktivated: {
        type: Boolean
    }
});

let roles = new Schema({
    name: {
        type: String
    },
    includes: {
        type: [String]
    },
    notices: {
        type: String
    }
});

let cookies = new Schema({

    sys: {
        type: String
    },
    lang: {
        type: [
            String
        ]
    },
    time: {
        type: Date
    },
    dev: {},
    mediasessons: {},
    worker: {},
    storage: {},
    webdriver: {
        type: Boolean
    },
    ip: {
        ip: {
            type: String
        },
        hostname: {
            type: String
        },
        city: {
            type: String
        },
        region: {
            type: String
        },
        country: {
            type: String
        },
        loc: {
            type: String
        },
        org: {
            type: String
        },
        postal: {
            type: String
        },
        timezone: {
            type: String
        }
    },
    hacker: {
        type: Boolean
    }

})

let resurce = new Schema({

});

let productData = new Schema({
    id: {
        type: Number
    },
    name: {
        type: String
    },
    notices: {
        type: String
    },
    tags: {
        type: String
    },
    pieces: {
        type: Number
    },
    price: {
        type: Number
    },
    deaktivated: {
        type: Boolean
    },
    time: {
        type: Date
    }
});

let shop = new Schema({
    id: {
        type: Number
    },
    image: {
        type: String
    },
    name: {
        type: String
    },
    price: {
        type: Number
    },
    text: {
        type: String
    },
    time: {
        type: Date
    }
});

let chatData = new Schema({
    id: {
        type: Number
    },
    user: {
        type: String
    },
    time: {
        type: Date
    },
    ip: {
        type: String
    },
    text: {
        type: String
    }
})

let chatList = new Schema({
    id: {
        type: Number
    },
    users: {
        type: [String]
    },
    name: {
        type: String
    },
    img: {
        type: String
    }
})
let chatUserPreferences = new Schema({
    userName: {
        type: String
    },
    name: {
        type: String
    },
    img: {
        type: String
    },
    profile: {
        type: String
    }
})

const userHere = mongoose.model("user", user);
const rolesHere = mongoose.model("roles", roles);
const resurceHere = mongoose.model("resurce", resurce);
const cookiesHere = mongoose.model("cookies", cookies);
const productDataHere = mongoose.model("productData", productData);
const shopHere = mongoose.model("shop", shop);
const chatDataHere = mongoose.model("chatData", chatData)
const chatListHere = mongoose.model("chatList", chatList)
const chatUserPreferencesHere = mongoose.model("chatUserPreferences", chatUserPreferences)
module.exports = {
    user: userHere,
    roles: rolesHere,
    resurce: resurceHere,
    cookies: cookiesHere,
    productData: productDataHere,
    shop: shopHere,
    chatData: chatDataHere,
    chatList: chatListHere,
    chatUserPreferences: chatUserPreferencesHere
};

//