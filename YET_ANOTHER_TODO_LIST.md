### Front end
- [x] update schema so forms are not based on columns in tables
    - thought is to use "serialization" or at least match by `name:value` pairs at least
    - then use the dynamic form generation by an object structure and map the values
- [ ] sync button
    - [x] tie in with online/offline events
    - [ ] write function to sync stuff after deciding on master/source of truth
        - this will just be a copy of the tables(`Dexie`)
        - I'm just gonna go with:
            - if empty(client) pull down
            - if not empty(client) replace remote(per user)
- [ ] add tag
    - [x] fix the upload meta image dimension getter async issue
    - [ ] Extra: add the canvas resize, not entirely sure what for... maybe don't need it since can resize on server side
        - guess can be useful for reducing client storage
- [ ] finish tag info
    - [ ] Extra: need to figure out a good way to structure the dynamic form that also can easily map the values
        - [x] store into `Dexie`
- [x] finish the delete process(tie into prompt)
- [ ] after remote server set up, re-enable token-protected routes again

### Back end
- [ ] Login
    - set up remote, systemd persist node server to disribute token
- [ ] copy the table structure from `Dexie` on server side
- [ ] write the sync-related APIs

### Sync
- [x] add user_id field to tables in remote side so client side data is separate
    this allows the user to not login initially and be able to use the app, client side does not require user id
- [ ] make a full demo account where it has the spreadsheet data synced so anyone signing into app as that user will pull down that new data
- [ ] check that sync still successfully calls back when you navigate to another page while processing sync

### Misc
- [ ] test on iphone somehow, browserstack is expensive af
    - use lighthouse to confirm can pin to Apple devices
- [ ] split the repo
    - after deploying by git I realized how you should not have the front/back end together in the same repo
- [ ] look into [persistence](https://dexie.org/docs/StorageManager) regarding being able to gauge available storage. Apparently in Chrome it's 50% of user's storage which should be enough.
- [ ] add gear icon on main page(addresses) to [delete all cache data](https://stackoverflow.com/questions/56972246/how-to-update-reactjs-based-pwa-to-the-new-version) so local app syncs code with remote update

### Demoable
- [ ] hit sync on certain account, pulls all remote info and populates client app
- [ ] confirm `seed-database.js` stil works after finalizing table schemas

### Stuff to look into
- [ ] state management of delete tag workflow eg. processing status(dithered) of delete button/failures
- [ ] the logout button doesn't really make sense as you're never really "logged out" regarding being able to use the app, you need to login to sync as the remote side will deny your requests without a valid token
- [ ] deleting files by filename could be bad... since it deletes multiple if same file uploaded more than once
- [ ] consider not using base64 as a medium to transfer images back and forth between client/api
    - I guess this is convention actually, storage should use `BLOB` though eg. `mediumblob`
- [ ] can't remove from upload once selected for upload
- [ ] when you get logged out in process of uploading goes into `catch` error of `uploadImages`
    - added fix for this based on [this](https://github.com/axios/axios/issues/960), needed actual response not string
- [ ] unmounted state update errors particularly on taginfo/ownerInfo sometimes fires
    - happens on empty sync too
- [ ] update axios calls to follow param format eg. url, payload, config(headers)
    - I tried it the third parameter doesn't show up in req
- [ ] add way to clear all data on app
    - [maybe related](https://medium.com/progressive-web-apps/pwa-create-a-new-update-available-notification-using-service-workers-18be9168d717) for updating code
- [ ] take out all console logs except errors
- [ ] fix double promises i.e. promise inside async, generally make sure these actually make sense/work
    - don't have to use async wrapper around promise i.e. remove async
- [ ] sync pagination
- [ ] the deployment stuff it's janky the deployment process regarding base paths and files to be deployed

### Extra
- [ ] cache requested uploads when redirecting to upload for token
    - shouldn't be hard like saving locally

### Finalize
- [ ] update remote database API code
- [ ] sync tables
- [ ] make demo accounts
- [ ] populate one account fully
- [ ] persist node
- [ ] misc testing eg. see if tag text search works, I think I put it in before
- [ ] clean up(console logs, mark down files)
- [ ] split repo so easier to deploy
- [ ] check light house
- [ ] throw err breaks server
- [ ] file upload doesn't work in Safari
- [ ] add to home screen doesn't show up in Safari still from what I was told
- [ ] write console logs
- [ ] systemd mysql not working or something not working
- [x] figure out how to empty Dexie on logout
    - use `Dexie.delete()` seems to work well, sync pulls down last sync data
- [ ] how to clear js chunks, probably from service worker
- [ ] responsive issues in ios eg. gap between base and bottom of navbar
- [ ] stuff takes a while to load, try scaling down images(use thumbnails)
    - generate client side probably since possible won't upload for a while
    - consider adding global spinners per page when stuff is loading
- [ ] I think `MariaDB` formatted the date time differently on retur/broke stuff hence that `indexOf ... join` fix

### Post demo
- [ ] fixes in slack about Tag Info form changes
- [ ] add the canvas client side rescale and check/speed up sync/avoid large images if that matters
- [ ] consider adding spinners for loading
- [ ] add dither to logout


### Slack tasks
- [ ] On Tag Info: For date of picture and date of abatement - is it possible to add a drop down calendar to select the date? If not, that's totally fine
- [ ] On Tag Info: for vacant property and land bank property - change "Other" option to "Unknown"
- [ ] On Tag Info: On Surface options - remove "Bare" from Bare Brick or Stone, Bare Concrete, Bare Wood
- [ ] On Tag Info: Options for Need other code enforcement? - delete "Bare brick or stone" and "glass" and add "Trash"
- [ ] On Tag Info: Add Type of Property with options for Commercial, Residential, Public

### Speed improvements
- [ ] use blob over base64 locally
    - maybe means can pull directly from db as blog vs. converting back to base64
- [ ] update worfklow so that local storage(Dexie-IndexedDB) is only accessed once or twice and load results into memory eg. state variables for fast access

### More
- [ ] cancelling camera file upload process leaves `Use Camera` button in unusable state, have to back out eg. hit `Cancel` and come back to be able to upload again
- [ ] cache clearing works when done manually, the automatic way needs to be tested/determine when to run
    - not sure currently if the time based version is working or not
    - interesting it really works, should put in get request to make sure code exists