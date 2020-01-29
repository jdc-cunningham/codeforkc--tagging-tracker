### AWS S3
You will need the access_key_id and secret_access_key, currently I own the bucket being used. The access_key_id and secret_access_key go inside the credentials file(no extension)
These should be in your respective locations depending on platform(Windows or Linux):
* C:\Users\USER_NAME\.aws\credentials
* ~/.aws/credentials

#### credentials file structure:
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