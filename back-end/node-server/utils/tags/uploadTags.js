require('dotenv').config()

// import s3 stuff from module later
const AWS = require('aws-sdk');
const bucketName = process.env.AWS_S3_NAME;
AWS.config.update({region: process.env.AWS_S3_REGION});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

const uploadTags = (req, res) => {
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
                        res.status(200).send('Upload completed');
                    }
                }
            });
        }
    }
}

module.exports = {
    uploadTags
}