require('dotenv').config()
const bcrypt = require('bcrypt');
const saltRounds = 15;
const jwt = require('jsonwebtoken');

const loginUser = (req, res, pool) => {
    // get these from post params
    const username = "test";
    const password = "test";
    let passwordHash;
    
    pool.query(
        `SELECT password_hash FROM users WHERE username = ?`,
        [username],
        (err, res) => {
            if (err) {
                // res.status(401).send('Failed to login');
                console.log('select hash err', err);
            } else {
                if (res.length && typeof res[0].password_hash !== "undefined") {
                    passwordHash = res[0].password_hash;
                    console.log('1', passwordHash);
                    comparePasswords(password, passwordHash);
                } else {
                    // res.status(401).send('Failed to login');
                    console.log('err');
                    return false;
                }
            }
        }
    );
}

const comparePasswords = (password, passwordHash) => {
    bcrypt.compare(password, passwordHash, (err, res) => {
        if (err) {
            // res.status(401).send('Failed to login');
            console.log('bcrypt compare', err);
            return false;
        }

        console.log('valid');
        jwt.sign({user: username}, process.env.JWT_SECRET_KEY, {expiresIn: "15m"}, (err,token) => {
            console.log(token);
            res.json({
                token
            });
        });
    });
}



