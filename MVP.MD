### Tasks
- [ ] test online/offline behavior on deployed app

### Online/offline workflow
- have to be online to login, if no login can access stuff locally/on device... I guess that's fine?
    - but user info vulnerable
    - so the offline workflow is not completely offline just preventing images from uploading(bandwidth)?
- for now will build with original thought of "offline capability is with regard to storing pictures locally"
  - "you can't" login if you don't have a remote connection(many native apps flat out don't work without internet connection)
    - it's not impossible, just not sure how you would architect that eg. copy locally a database of hashes/verify against that but more than likely what would actualy happen is the app is meant to work without auth and you use internet to sync data/back up, however storage limitation would be an issue eventually native or not
    - you would login to interface with the remote api

#### local/s3 storage workflow
- use local images to render(pre-upload and generally)
- when uploaded to s3, replace sources in local db with remote thumbnails(so they're cached/no loading by image for base64)

### Note
- when API doesn't match client side, does client side have priorty eg. client deletes address... guess that could be a direct request to API

### Want
- [ ] add online/offline button toggling for sync/upload

### Extra
- [ ] add gear icon for settings on top right navbar
- [ ] add in Google auto complete for address search, not hard concern is cost
    - should it be optional/assistive
- [ ] recaptcha to login, for now crazy url should be fine
- [ ] import colors eg. "blue" over manual hex
- [ ] align pictures better
- [ ] generate database from scratch(node)
- [ ] add schema generators eg. "migration"
- [ ] figure out max connectionLimit for MySQL has math regarding RAM/buffer/etc...
- [ ] add in way to register accounts, I think may need email(mailgun) for email validation
- [ ] add pin to locate self/reverse geocode to get address not sure if available offline, the navigation part(get current lat/lng
- [ ] refresh token(will logout in 30 minutes currently), tie it to route change maybe
- [ ] figure out how to dynamically set the proxy based on environment, don't need one for deployment or maybe will since not a monolith/front end is separate from backend
- [ ] rest of address eg. state/zip or just limited to KS?