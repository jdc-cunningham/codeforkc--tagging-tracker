const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // get auth header value
    const bearerHeader = req.body.headers['Authorization'];
    // check if bearer undefined
    if (typeof bearerHeader !== 'undefined') {
        // split at the space
        const bearerToken = bearerHeader.split(" ")[1];
        // set the token
        req.token = bearerToken;
        // next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}

module.exports = {
    verifyToken
};