require('dotenv').config()
const bcrypt = require('bcrypt');
const saltRounds = 15;
const jwt = require('jsonwebtoken');
const { pool } = require('./../../utils/db/dbConnect');

const loginUser = (req, res) => {
    // get these from post params
    const username = "test";
    const password = "test";
    let passwordHash;
    
    pool.query(
        `SELECT password_hash FROM users WHERE username = ?`,
        [username],
        (err, qres) => {
            if (err) {
                // res.status(401).send('Failed to login');
                console.log('select hash err', err);
            } else {
                if (qres.length && typeof qres[0].password_hash !== "undefined") {
                    passwordHash = qres[0].password_hash;
                    comparePasswords(res, username, password, passwordHash);
                } else {
                    res.status(401).send('Failed to login');
                }
            }
        }
    );
}

const comparePasswords = (res, username, password, passwordHash) => {
    bcrypt.compare(password, passwordHash, (err, bres) => { // this is bad bres
        if (err) {
            console.log('bcrypt compare', err);
            res.status(401).send('Failed to login');
        }

        jwt.sign({user: username}, process.env.JWT_SECRET_KEY, {expiresIn: "15m"}, (err,token) => {
            if (token) {
                issueToken(res, token);
            } else {
                res.status(401).send('Failed to login');
            }
        });
    });
}

const issueToken = (res, token) => {
    console.log('it');
    if (token) {
        res.status(200).send(`${token}`);
    } else {
        res.status(401);
    }
}

module.exports = {
    loginUser
}
