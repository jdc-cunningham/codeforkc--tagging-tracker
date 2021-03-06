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

## References
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

## Deployment
You still need to install `MySQL`, which I used `MariaDB` on `Debian 10`. I believe the node `mysql2` client is just that, it's not the server itself, so you have to install MySQL on the remote server and create auth/set credentials in `.env` file. Make sure your `localhost` `MySQL` user either has all privileges or after creating a specific user for this app, to grant privilege to the database/tables created.

You will also need to run the private `createUser` function in `/utils/users` since there isn't a registration aspect to this app yet. You can just run `createUser('username','pass')` while running the node app locally.

## Deploying with Systemd
One way to deploy the node back end is through [systemd](https://www.axllent.org/docs/view/nodejs-service-with-systemd/) a service manager in `Linux`, this takes the place of running the `node` app by `node index.js` directly in terminal. If you go this route, note that when you make changes you will have to reload the daemon i.e. `systemctl daemon-reload` and then restart the service i.e. `systemctl restart nameofservice.service`.

## Potential issues
`max_packet_size` this should be at least `100MB` just to pull a number out of thin air but had a `ECONNRESET` issue appear due to a large file. The `100MB` is insane but [apparently](https://dba.stackexchange.com/questions/45665/what-max-allowed-packet-is-big-enough-and-why-do-i-need-to-change-it) it's fine with a max of `1GB`. It is important to keep in mind that a `base64` file grows significantly eg. an original `~4MB` file jumps to over `10MB` when converted to `base64`.

Check in `MYSQL CLI` with `SHOW VARIABLES LIKE `max_allowed_packet`;`
Update with `SET GLOBAL max_allowed_packet=value_in_bytes;`
Note: the variable shown by the `SHOW...` command will not change, I think because they're not the same e.g. `GLOBAL`. But if you were running into the `ECONNRESET` issue it's probably fixed now, try it. The other alternative is the connection being [terminated](https://stackoverflow.com/questions/22900931/mysql-giving-read-econnreset-error-after-idle-time-on-node-js-server/22906189#22906189) too early but I checked(in Windows 10) and it was set to the default of `28800`.