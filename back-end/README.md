## About
The back-end is primarily used for auth(JWT) and syncing. The data sync eg. the address/tag-info/owner-info tables are held in `MySQL` and photos are stored in S3.

## Dependencies
* Node, MySQL, AWS S3 Bucket(optional -- up to you)

## Local Dev
You can use `npm run server` if you have `nodemon` installed to develop or just `node index.js`
You should have it installed as it's part of the dependencies

## Installation
Assuming you have node/npm installed, you should be able to install all the dependencies as they're in `package.json` through `npm install`. Then run the backend with `node index.js` or `nodemon server`

The backend for dev is hosted on `localhost:5000` this only matters because the PWA react app is mapped to it through the proxy in the PWA's `package.json`

## AWS S3
You will need the `access_key_id` and `secret_access_key`, currently I own the bucket being used. The `access_key_id` and `secret_access_key` go inside the credentials file(no extension)
These should be in your respective locations depending on platform(Windows or Linux):
* `C:\Users\USER_NAME\.aws\credentials`
* `~/.aws/credentials`

### credentials file structure:
```
[default]
aws_access_key_id = <YOUR_ACCESS_KEY_ID>
aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>
```

The node `aws-sdk` package will try to read/find that file. I just made that file from VS code, didn't even bother with the AWS CLI stuff.

### References
#### AWS S3 - assumes you have access to a bucket
[Creating IAM user](https://aws.amazon.com/premiumsupport/knowledge-center/create-access-key/) - getting access-secret key(I used console eg. web interface)
[JS SDK demo code](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html) - like upload/list buckets/etc...
[Big list of demo commands](https://github.com/awsdocs/aws-doc-sdk-examples/tree/master/javascript/example_code/s3) - eg. CRUD

## Node Auth
I am using `jsonwebtoken` and storing it either in app state or localStorage since the XSS thing is generally mitigated against with ReactJS. Also I read that ReactJS can't access `httpWebOnly` token... csrf issues... it's a tough subject, arguments for both cases/depends on client too. The one concern with app state(in-memory) is you can refresh the app. It's built as a SPA so there are no hard routes eg. refresh

Reading on this
* [link 1](https://stackoverflow.com/questions/44133536/is-it-safe-to-store-a-jwt-in-localstorage-with-reactjs)
* [link 2](https://stackoverflow.com/questions/20504846/why-is-it-common-to-put-csrf-prevention-tokens-in-cookies)
* [link 3](https://security.stackexchange.com/questions/179498/is-it-safe-to-store-a-jwt-in-sessionstorage)