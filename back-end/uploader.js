// this is just some demo code to get through basics
require('dotenv').config()
const AWS = require('aws-sdk');
const bucketName = process.env.AWS_S3_NAME;
AWS.config.update({region: process.env.AWS_S3_REGION});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

/**
 * Upload image
 */
const uploadParams = {Bucket: bucketName, Key: '', Body: ''};
const file = './test-files/78Mf1Dy.jpg';

// Configure the file stream and obtain the upload parameters
const fs = require('fs');
const fileStream = fs.createReadStream(file);
fileStream.on('error', function(err) {
  console.log('File Error', err);
});
uploadParams.Body = fileStream;
const path = require('path');
uploadParams.Key = path.basename(file);

// call S3 to retrieve upload file to specified bucket
const uploadImage = () => {
    s3.upload (uploadParams, function (err, data) {
        if (err) {
          console.log("Error", err);
        } if (data) {
          console.log("Upload Success", data.Location);
        }
      });
};

const listImages = () => {

};

const listTagImages = () => {

}

const listAddressTagImages = () => {
    
}