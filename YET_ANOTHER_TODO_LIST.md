### Front end
- [ ] sync button
    - [ ] tie in with online/offline events
    - [ ] write function to sync stuff after deciding on master/source of truth
        - this will just be a copy of the tables(`Dexie`)
- [ ] add tag
    - [ ] fix the upload meta image dimension getter async issue
    - [ ] add the canvas resize, not entirely sure what for... maybe don't need it since can resize on server side
        - guess can be useful for reducing client storage
- [ ] finish tag info
    - [ ] need to figure out a good way to structure the dynamic form that also can easily map the values
        - [ ] store into `Dexie`
- [ ] finish the delete process(tie into prompt)
- [ ] after remote server set up, re-enable token-protected routes again

### Back end
- [ ] Login
    - set up remote, systemd persist node server to disribute token
- [ ] copy the table structure from `Dexie` on server side
- [ ] write the sync-related APIs

### Sync
- [ ] add user_id field to tables in remote side so client side data is separate
    this allows the user to not login initially and be able to use the app, client side does not require user id
- [ ] make a full demo account where it has the spreadsheet data synced so anyone signing into app as that user will pull down that new data

### Misc
- [ ] test on iphone somehow, browserstack is expensive af
    - use lighthouse to confirm can pin to Apple devices