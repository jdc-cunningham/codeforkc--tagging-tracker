### Front end
- [ ] update schema so forms are not based on columns in tables
    - thought is to use "serialization" or at least match by `name:value` pairs at least
    - then use the dynamic form generation by an object structure and map the values
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
- [ ] split the repo
    - after deploying by git I realized how you should not have the front/back end together in the same repo
- [ ] look into [persistence](https://dexie.org/docs/StorageManager) regarding being able to gauge available storage. Apparently in Chrome it's 50% of user's storage which should be enough.
- [ ] add gear icon on main page(addresses) to [delete all cache data](https://stackoverflow.com/questions/56972246/how-to-update-reactjs-based-pwa-to-the-new-version) so local app syncs code with remote update

### Demoable
- [ ] hit sync on certain account, pulls all remote info and populates client app