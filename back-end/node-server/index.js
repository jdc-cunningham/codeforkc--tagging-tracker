const express = require('express');
const app = express();
const port = 5000;
const { createUser, deleteUser } = require('./utils/users/userFunctions');
const { loginUser } = require('./utils/auth/authFunctions');
const { verifyToken } = require('./utils/middleware/jwt');
const { testAuth } = require('./utils/misc/testAuth');

// CORs
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.status(200).send('App running');
});

// user stuff
app.post('/login-user', loginUser);

// photos stuff


// deleteUser(pool, 2);
// createUser(pool, 'test', 'test');
// loginUser("", "", pool);

app.post('/test-auth', verifyToken, testAuth);

app.listen(port, () => {
    console.log(`App running... on port ${port}`);
});