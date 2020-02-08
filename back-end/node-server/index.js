require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const app = express();
const port = 5000;
const { createUser, deleteUser } = require('./utils/users/userFunctions');
const { loginUser } = require('./utils/auth/authFunctions');
const { verifyToken } = require('./utils/middleware/jwt');
const { testAuth } = require('./utils/misc/testAuth');
const { addAddress } = require('./utils/address/add');
const { getRecentAddresses } = require('./utils/address/get');

// import s3 stuff from module later
const AWS = require('aws-sdk');
const bucketName = process.env.AWS_S3_NAME;
AWS.config.update({region: process.env.AWS_S3_REGION});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

// CORs
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json({
    limit: '200mb' // payload too large error due to base64
}));
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

// middleware for handling mutli-part data
app.use(fileUpload());

// temporary
app.get('/', (req, res) => {
    res.status(200).send('App running');
});

app.get('/get-recent-addresses', getRecentAddresses);

app.post('/login-user', loginUser);
// app.post('/add-address', verifyToken, addAddress);
app.post('/add-address', addAddress); // dev disable auth

app.post('/upload-tag', (req, res) => {
    const imagesToUpload = req.body.images;

    // https://stackoverflow.com/questions/7511321/uploading-base64-encoded-image-to-amazon-s3-via-node-js
    if (imagesToUpload.length) {
        let uploadErr = false;

        for (let i = 0; i < imagesToUpload.length; i++) {
            if (uploadErr) {
                break;
                res.status(400).send('Failed to upload images');
            }

            // plain Buffer is depricated/need to specify size in case secret info released
            const image = imagesToUpload[i];
            const buf = new Buffer.from(image.src.replace(/^data:image\/\w+;base64,/, ""), 'base64', image.src.length);
            const uploadParams = {
                Bucket: bucketName,
                Key: image.fileName,
                Body: buf,
                ACL: 'public-read',
                ContentEncoding: 'base64',
                ContentType: 'image/jpeg'
            };

            s3.upload(uploadParams, function (err, data) {
                if (err) {
                    console.log("Error", err);
                    uploadErr = true;
                } if (data) {
                    console.log("Upload Success", data.Location);
                    if (i === imagesToUpload.length - 1) {
                        res.status(200).send('Upload attempt');
                    }
                }
            });
        }
    }
});

app.listen(port, () => {
    console.log(`App running... on port ${port}`);
});