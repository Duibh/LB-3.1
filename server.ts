const express = require('express');
const file = require('file-system');
const fs = require('fs');
const cors = require('cors');
const fluent_ffmpeg = require('fluent-ffmpeg');
let mergedVideo = fluent_ffmpeg();
const multer = require("multer");

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, 'uploads/')

    },

    filename(req, file, callback): void {

        callback(null, file.originalname);

    }

});

const upload = multer({storage: storage});

const gm = require("gm").subClass({

    imageMagick: true

});
const content = [];
const app = express();

app.use(cors());

//Sinlge Image Upload
app.post('/api/files/optimize', upload.single('file'), (req, res) => {
    gm(req.file.path)

        .resize(720)

        .write('uploads/small_' + req.file.filename, (err) => {

            console.log(err);

        });

    gm(req.file.path)

        .resize(1280)

        .write('uploads/medium_' + req.file.filename, (err) => {

            console.log(err);

        });

    gm(req.file.path)

        .resize(2044)

        .write('uploads/big_' + req.file.filename, (err) => {

            console.log(err);

        });

    res.status(200).json({success: true});

});
// Multiple Image Uploads
app.post('/api/files/multiple/optimize', upload.single('file'), (req, res) => {
    app.post('/api/files/optimize', upload.single('file'), (req, res) => {
        gm(req.file.path)

            .resize(720)

            .write('uploads/small_' + req.file.filename, (err) => {

                console.log(err);

            });

        gm(req.file.path)

            .resize(1280)

            .write('uploads/medium_' + req.file.filename, (err) => {

                console.log(err);

            });

        gm(req.file.path)

            .resize(2044)

            .write('uploads/big_' + req.file.filename, (err) => {

                console.log(err);

            });

        res.status(200).json({success: true});

    });
});
const storage2 = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, 'uploads/videos/tmp')

    },

    filename(req, file, callback): void {

        callback(null, file.originalname);

    }

});

const upload2 = multer({storage: storage2});

// Video Upload
app.post('/api/videos', upload2.single('file'), function (req, res) {
    res.status(200).json({succsess: true});
});


// Video Megre
app.get('/api/videos/merge', function (req, res) {
    fs.readdir('uploads/videos/tmp', function (err, videos) {
        if (!err) {
            let videoNames = fs.readdirSync('./uploads/videos/tmp/');
            videoNames.forEach(function (videoName) {
                mergedVideo = mergedVideo.addInput('./uploads/videos/tmp/' + videoName);
            });

            mergedVideo.mergeToFile('./uploads/videos/zusammengefügt.mp4', './uploads/')
                .on('error', function (err) {
                    console.log('Error' + err.message);
                })
                .on('end', function () {
                    console.log('Finished!');
                });
            res.json({files: videos});
        } else {
            res.status(400).send();
        }
    });
});

app.use(express.static('uploads'));
app.use(express.static('dist/M152-Projekt-Frontend'));
//Ausgabe Images
app.get('/api/files', function (req, res) {
    fs.readdir('uploads', function (err, images) {
        res.json({files: images});
    });
});

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist//M152-Projekt-Frontend/index.html');
});

app.listen(process.env.PORT || 4000, function () {

    console.log('Your node js server is running');

});
