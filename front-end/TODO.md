### PWA Offline MVP
This proves that PWA can work offline regarding storing photos temporarily without access to file system and using the offline/online event to then upload the photos that are being stored as strings in IndexedDB.
- [ ] basic test interface
    - [ ] loads camera
    - [ ] takes picture
    - [ ] turn to string
    - [ ] using PouchDB(IndexedDB wrappr)
        - [ ] store photo
    - [ ] use the offline/online sync to make request with photo as payload to remote site
    - [ ] test pwa(install)
        - [ ] needs domain
        - [ ] needs ssl
        - [ ] fix icon requirements
        - [ ] test in emulated iPhone on services like Browserstack
            - [ ] test that can pin
            - [ ] if possible test the whole offline/online thing
            - [ ] camera probably useless but could preload it with info for testing

### Additional tasks from MVP above
- ability to take multiple pictures at once/present/keep track


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
