### About

### Notes:
* Disable proxy when building for deployment
    * Proxy is used for local API testing, set in `package.json`
* Refreshing will remove your token since it's held in state, not local/session storage or cookie
* There is no refresh token currently, expiration is 15m

### Install
Assumes you have node installed locally and `npx`
Everything should just install

### Run
`npm start` or `yarn start` which ever one you have