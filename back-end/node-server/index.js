require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const app = express();
const port = 5000;
const { loginUser } = require('./utils/auth/authFunctions');
const { verifyToken } = require('./utils/middleware/jwt');
const { testAuth } = require('./utils/misc/testAuth');
const { addAddress } = require('./utils/address/add');
const { getRecentAddresses } = require('./utils/address/get');
const { uploadTags } = require('./utils/tags/uploadTags');

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

// these were for the old design, now using sync mechanism
// app.get('/get-recent-addresses', getRecentAddresses);
// app.post('/add-address', verifyToken, addAddress);
// app.post('/add-address', addAddress); // dev disable auth

app.post('/login-user', loginUser);
app.post('/upload-tag', verifyToken, uploadTags);

app.listen(port, () => {
    console.log(`App running... on port ${port}`);
});