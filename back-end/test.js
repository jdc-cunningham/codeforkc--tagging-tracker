// this is just some demo code to get through basics
require('dotenv').config()
const AWS = require('aws-sdk');
const bucketName = process.env.AWS_S3_NAME;
AWS.config.update({region: process.env.AWS_S3_REGION});
// alternatively if you want to directly passin from .env
// AWS.config.update({accessKeyId: 'mykey', secretAccessKey: 'mysecret', region: 'myregion'});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

/**
 * Upload image
 */
const uploadParams = {Bucket: bucketName, Key: '', Body: ''};
const fileName = 'DSC03059.JPG'; // Key
const file = './test-files/DSC03059.JPG'; // these files are huge on purpose

// Configure the file stream and obtain the upload parameters
const fs = require('fs');
const fileStream = fs.createReadStream(file);
fileStream.on('error', function(err) {
  console.log('File Error', err);
});
uploadParams.Body = fileStream;
const path = require('path');
uploadParams.Key = path.basename(file);
uploadParams.ACL = 'public-read';
uploadParams.ContentEncoding = 'base64';
uploadParams.ContentType = 'image/jpeg';

// call S3 to retrieve upload file to specified bucket
// have to set meta data on upload otherwise won't display/will download
// have to know file type of image eg. jpg
// also use a crazy uid or hash string for filename so hard to guess randomly
// but save pretty name in pg
const uploadImage = () => {
    s3.upload(uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        } if (data) {
            console.log("Upload Success", data.Location);
        }
      });
};

uploadImage();

// this would probably never be used
const bucketParams = {
    Bucket : bucketName,
};

const listAllImages = () => {
    s3.listObjects(bucketParams, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);
        }
    });
};

const listTagImages = () => {

}

const listAddressTagImages = () => {

}

// will rename parameters so can use ES6 eg. no matching key/val
const params = {  Bucket: bucketName, Key: fileName };
const deleteImage = () => {
    s3.deleteObject(params, function(err, data) {
        if (err) console.log(err, err.stack);  // error
        else     console.log();                 // deleted
    });
    // check if still exists
    if (imageExists(fileName)) {
        return false;
    } else {
        return true;
    }
}

const getImage = () => {
    s3.getObject(getParams, function(err, data) {
        if (err) {
            return err;
        }
        // change .toString('binary) for images
        let objectData = data.Body.toString('utf-8'); // Use the encoding necessary
    });
}

// may not be possible to search by ETag
const imageExists = async (fileName, ETag = "") => {

}

// straight up stole this code from SO but will adapt other methods if needed for async
async function getObject (bucket, objectKey) {
    try {
      const params = {
        Bucket: bucket,
        Key: objectKey
      }
  
      const data = await s3.getObject(params).promise();
      
      // for files use .toString('binary)
      return data.Body.toString('binary');
      // return data.Body.toString('utf-8');
    } catch (e) {
      throw new Error(`Could not retrieve file from S3: ${e.message}`)
    }
  }

// works returns buffer or binary
// getObject(bucketName, fileName).then((resp) => {
//     console.log(resp);
// });