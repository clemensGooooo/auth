const express = require('express');
const router = express.Router();
const ytdl = require('ytdl-core');
const fs = require("fs")
const mp3 = require("youtube-mp3-downloader")
const ffmpeg = require("ffmpeg-static");
const path = require("path")



router.get('/mp4', (req, res) => {
    var url = req.query.url;
    // console.log(url);
    let x = url.split("=");
    ytdl.getInfo(x[1]).then(info => {
        // console.log('title:', info.videoDetails.title);
        // console.log('uploaded by:', info.videoDetails.author.name);
        let name = info.videoDetails.title
            .replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, ' ')
            .replace(/^(-)+|(-)+$/g, '')
            .replace(/’/g, "'")
        // console.log(name);
        try {
            res.header("Content-Disposition", `attachment; filename =${name}.mp4`);
            ytdl(url, { format: 'mp4', quality: "lowest" }).pipe(res);

        } catch (err) { // console.log(err); 
        }
    });
});

router.get('/mp3', (req, res) => {
    try {
        var url = req.query.url;
        // console.log(url);
        const yd = new mp3({
            ffmpegPath: ffmpeg,
            outputPath: './download/',
            youtubeVideoQuality: 'highest'
        })
        var x;
        if (url.includes("watch") == true) {
            x = url.split("=");

        } else {
            x = url.split(".be/")
        }
        yd.download(x[1], x[1] + ".mp3")

        yd.on("finished", function (err, data) {
            let name = data.videoTitle
                .replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, ' ')
                .replace(/^(-)+|(-)+$/g, '')
                .replace(/’/g, "'")
            // console.log(data);
            res.header("Content-Disposition", `attachment; filename = ${name}.mp3 `);
            res.sendFile(path.join(__dirname, '../download/', x[1] + ".mp3"));

            setTimeout(() => {
                fs.unlink("./download/" + x[1] + ".mp3", (err) => {
                    // console.log(err);
                    return;
                })
            }, 2000)

        });
        yd.on("progress", function (progress) {
            // console.log(JSON.stringify(progress));
        });
    } catch (err) { console.log(err); }
});

module.exports = router;