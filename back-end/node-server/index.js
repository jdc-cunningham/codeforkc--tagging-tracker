require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const app = express();
const port = 5000;
const { loginUser } = require('./utils/auth/authFunctions');
const { verifyToken } = require('./utils/middleware/jwt');
const { uploadTags } = require('./utils/tags/uploadTags');
const { syncUp } = require('./utils/sync/sync-up'); // sync here eg. client pushing up

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

// routes
app.post('/login-user', loginUser);
app.post('/upload-tag', verifyToken, uploadTags);
app.post('/sync-up', verifyToken, syncUp); // these names are terrible

app.listen(port, () => {
    console.log(`App running... on port ${port}`);
});