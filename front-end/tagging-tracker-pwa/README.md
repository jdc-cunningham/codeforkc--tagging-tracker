### About
#### local file storage
This app uses [dexie.js IndexedDB wrapper](https://github.com/dfahlander/Dexie.js/) to store the images as strings for offline use. Then when back online again, the photos are uploaded to a Node API that then goes to AWS S3. The backend has image resizing so for display of thumbnails those are tiny files.

**note** that has an ISC license, something about telling what it's using, guess add an about/info somewhere.

The size of files locally(on device) are tracked so if there is a space issue, can let user know to upload or delete some images. This issue should be avoided by using Chrome to install the PWA(Add to home)

**note** Chrome has bigger local file storage(IndexedDB) vs. Safari

### dependencies
* node
* npm

### install
* clone this repo
* run npm install which should install all the dependencies needed

### Stack
The front end is built with `create-react-app`, it's all ReactJS with SCSS. All functional components and hooks using plain state/props. `dexie.js` is just for storing the images unless they're uploaded right away.

### Auth
Intending to use JWT with the Node backend. No free sign up yet, will be added though with Mailgun for emails and all that. Some demo accounts will be generated initially.

### Deployment
run `npm run build` to generate static files then upload to a static host

Built with create-react-app