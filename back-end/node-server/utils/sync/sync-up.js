require('dotenv').config()
const { getUserIdFromToken } = require('../users/userFunctions');
const { pool } = require('./../../utils/db/dbConnect');
const { getDateTime } = require('./../../utils/datetime/functions');
const { uploadToS3 } = require('./../../utils/s3/uploadTag');

// import s3 stuff from module later
const AWS = require('aws-sdk');
const bucketName = process.env.AWS_S3_NAME;
AWS.config.update({region: process.env.AWS_S3_REGION});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

/**
 * The sync process goes like this:
 * create a sync_id which is just an auto incremented id(from sync_history table)
 * this is tied to the user_id
 * then the rows inserted into various tables use this sync_id.
 * Pulling down uses most recent(timestamp) and groups by that sync_id from sync_history
 */

// I suppose it is possible to steal a sync_id on accident eg. race condition but it doesn't really matter
// since it's just a unique reference
const getSyncId = async (userId) => {
    return new Promise(resolve => {
        // turn image into binary from base64
        pool.query(
            `INSERT INTO sync_history SET user_id = ?, sync_timestamp = ?`,
            [userId, getDateTime()], // no sync id on uploads
            (err, res) => {
                if (err) {
                    console.log('getSyncId', err);
                    resolve(false);
                } else {
                    console.log(res);
                    resolve(res.insertId);
                }
            }
        );
    });
}

const insertAddresses = (userId, syncId, addresses) => {
    return new Promise(resolve => {
        let insertErr = false;
        for (let i = 0; i < addresses.length; i++) {
            if (insertErr) {
                break; // may be pointless
            }

            const addressRow = addresses[i];

            // insert
            pool.query(
                `INSERT INTO addresses SET user_id = ?, address = ?, lat = ?, lng = ?, created = ?, updated = ?, sync_id = ?`,
                [userId, addressRow.address, addressRow.lat, addressRow.lng, addressRow.created, addressRow.updated, syncId],
                (err, qres) => {
                    if (err) {
                        console.log('insert address', err);
                        insertErr = true;
                        resolve(false);
                    } else {
                        if (i === addresses.length - 1) {
                            resolve(true);
                        }
                    }
                }
            );
        }
    });
}

/**
 * TODO: This should use a job queue not upload to s3 synchronously
 */
const insertTags = async (userId, syncId, tags) => {
    let insertErr = false;
    for (let i = 0; i < tags.length; i++) {
        if (insertErr) {
            break; // may be pointless
        }

        const tagRow = tags[i];

        // insert to s3
        // this should be part of the module
        const buff = new Buffer.from(tagRow.src.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        const uploadParams = {
            Bucket: bucketName,
            Key: userId + '_' + tagRow.fileName, // this could be bad since there can be spaces in file names, although public display doesn't matter i.e. S3
            Body: buff,
            ACL: 'public-read',
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg'
        };

        const s3PublicUrl = await uploadToS3(s3, uploadParams);

        // insert
        // this structure does not exactly match Dexie i.e. Dexie has the extra fileName column used for deletion on client side
        pool.query(
            `INSERT INTO tags SET user_id = ?, address_id = ?, src = ?, thumbnail_src = ?,  public_s3_url= ?, meta = ?, sync_id = ?`,
            [userId, tagRow.addressId, buff, "", s3PublicUrl, JSON.stringify(tagRow.meta), syncId],
            (err, qres) => {
                if (err) {
                    console.log('insert address', err);
                    insertErr = true;
                    throw Error(false);
                } else {
                    if (i === tags.length - 1) {
                        return true;
                    }
                }
            }
        );
    }
}

const syncUp = async (req, res) => {
    // somehow req.token is available though sent from body
    const userId = await getUserIdFromToken(req.token);
    if (userId) {
        const syncId = await getSyncId(userId);
        const dataToSync = req.body.bundledData;
        let syncErr = false;

        if (typeof dataToSync.addresses !== "undefined") {
            syncErr = await insertAddresses(userId, syncId, dataToSync.addresses);
        }

        if (typeof dataToSync.tags !== "undefined") {
            syncErr = await insertTags(userId, syncId, dataToSync.tags);
        }

        if (typeof dataToSync.ownerInfo !== "undefined") {

        }

        if (typeof dataToSync.tagInfo !== "undefined") {

        }

        if (syncErr) {
            res.status(400).send('Sync failed');
        } else {
            res.status(201).send('Sync successful');
        }
    } else {
        res.status(403);
    }
}

module.exports = {
    syncUp
}