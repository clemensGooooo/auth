const multer = require("multer");
const sharp = require("sharp");
const { shop } = require('../schema/mongodb');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
    }
};
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});
const uploadFiles = upload.array("images", 10);
const uploadImages = (req, res, next) => {
    uploadFiles(req, res, err => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_UNEXPECTED_FILE") {
                return res.send("Too many files to upload.");
            }
        } else if (err) {
            return res.send(err);
        }
        next();
    });
};
const resizeImages = async(req, res, next) => {
    if (!req.files) return next();
    req.body.images = [];
    await Promise.all(
        req.files.map(async file => {
            const filename = file.originalname.replace(/\..+$/, "");
            const newFilename = `bezkoder-${filename}-${Date.now()}.jpeg`;
            await sharp(file.buffer)
                .resize(1280, 640)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(`web/shop/upload/${newFilename}`);
            req.body.images.push(newFilename);
        })
    );
    next();
};
const getResult = async(req, res) => {
    if (req.body.images.length <= 0) {
        return res.send(`You must select at least 1 image.`);
    }
    const images = req.body.images
        .map(image => "" + image + "")
        .join("");
    var rand = Math.floor(Math.random() * 10000000000) + 1;
    const data = [{
        id: rand,
        image: images,
        name: req.body.name,
        price: req.body.price,
        text: req.body.info,
        time: Date.now()
    }];
    shop.insertMany(data, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log("Success")
        }
    });
    console.log(data);

    return res.status(200).send('<meta http-equiv="refresh" content="0.01; URL=/shop">');
};
module.exports = {
    uploadImages: uploadImages,
    resizeImages: resizeImages,
    getResult: getResult
};