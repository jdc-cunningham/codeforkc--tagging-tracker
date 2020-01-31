const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const port = 5000;

// import s3 stuff from module later
require('dotenv').config()
const AWS = require('aws-sdk');
const bucketName = process.env.AWS_S3_NAME;
AWS.config.update({region: process.env.AWS_S3_REGION});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

// CORs
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// middleware for handling mutli-part data
app.use(fileUpload());

app.post('/upload-tag', (req, res) => {
    console.log(req.files);
    // this is super ugly but just testing
    const uploadParams = {Bucket: bucketName, Key: '', Body: ''};
    uploadParams.Key = req.files.image.name;
    uploadParams.Body = req.files.image.data;
    uploadParams.ACL = 'public-read';
    uploadParams.ContentEncoding = req.files.image.encoding;
    uploadParams.ContentType = req.files.image.mimetype;

    s3.upload(uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        } if (data) {
            console.log("Upload Success", data.Location);
        }
      });
});

const bucketParams = {
    Bucket : bucketName,
};

app.get('/get-all-images', (req, res) => {
    s3.listObjects(bucketParams, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);
        }
    });
});

app.listen(port, () => {
    console.log(`App running... on port ${port}`);
});
