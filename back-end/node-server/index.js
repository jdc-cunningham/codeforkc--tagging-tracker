const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
const { createUser, deleteUser } = require('./utils/users/userFunctions');
const { loginUser } = require('./utils/auth/authFunctions');
const { verifyToken } = require('./utils/middleware/jwt');
const { testAuth } = require('./utils/misc/testAuth');
const { addAddress } = require('./utils/address/add');

// CORs
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

// temporary
app.get('/', (req, res) => {
    res.status(200).send('App running');
});

app.post('/login-user', loginUser);
// app.post('/add-address', verifyToken, addAddress);
app.post('/add-address', addAddress); // dev disable auth

app.listen(port, () => {
    console.log(`App running... on port ${port}`);
});