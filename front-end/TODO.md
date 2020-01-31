### Upload from client to Node to AWS
- [ ] get Node Express server up
- [ ] design initial db schema
- [ ] structure app
- [ ] start building pages

### PWA Offline MVP
This proves that PWA can work offline regarding storing photos temporarily without access to file system and using the offline/online event to then upload the photos that are being stored as strings in IndexedDB.
- [ ] basic test interface
    - [x] loads camera
    - [x] takes picture
    - [x] turn to string(base64 src from file input)
        - [ ] send back for file stream upload?...
    - [x] using Dexie(IndexedDB wrapper)
        - [x] store photo
        - [x] load photo from base64
    - [x] use the offline/online sync to make request with photo as payload to remote site
    - [ ] test pwa(install)
        - [x] needs domain
        - [x] needs ssl
        - [ ] fix icon requirements - not an issue kept originals for now
        - [ ] test in emulated iPhone on services like Browserstack
            - [ ] test that can pin
            - [ ] if possible test the whole offline/online thing (online/offline events)
            - [ ] camera probably useless but could preload it with info for testing

### Additional tasks from MVP above
- ability to take multiple pictures at once/present/keep track
- clean up inconsistency between photo or image naming
- need a loading thing for the initial local storage setup
- add way to empty database(Dexie)


### Pages to build
- [ ] Login/Register
- [ ] View addresses/search
    - [ ] create address popup
- [ ] View Address
    - [ ] add tag
        - [ ] camera
        - [ ] upload
        - [ ] upload later(offline)
            - guessing reference to photos in file system
    - [ ] delete tag
        - [ ] display
        - [ ] delete with prompt
- [ ] Owner info
    - [ ] Building info
- [ ] Tag info
    - [ ] tag info

### Legal stuff
- [ ] look into licensing eg. Apache vs. MIT, etc...