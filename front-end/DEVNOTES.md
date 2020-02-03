##### General app structure
- login/register
- look up address/see recently used
- create address
- add tag(to address)
    - camera
    - upload
    - upload later
    - cancel
- delete tag
    - view tags(by address)
        - prompt before delete
- what is owner? building owner?
    - must be regarding payment
- tag info
    - fields
- db relation
    - same tag can appear in multiple places(address)
    - so one grouping method is by tag

navigate by top and bottom menus

##### 02/02/2020
Did not touch any remote stuff at all(non-dev). The app has "full userflow" for the most part but some things need some tweaks.

##### 01/30/2020
I'm deciding to use MySQL instead of Postgres for now because I had problems with systemd in the past with db permissions(wouldn't write despite no errors)
Also since this is not-for-profit I think the whole licensing stuff is fine
Should be able to switch back and forward except the minor difference in syntax I've experienced

##### 01/29/2020
So... use Chrome in iOS haha... Safari is limiting. Once it's pulled as PWA from Chrome then the storage limit is much larger for offline storage. Maybe need to keep track of size of files.

##### 01/28/2020
Today I'm just going to structure the app as I see it from the UI mockup.
I'm also going to tackle some of the hardest/unknowns right away.
The S3 thing seems straight forward/I use Boto with S3 but node seems like you just install their SDK.
Other thing that's hard for me(haven't done yet) is the full flow of Node/bcrypt pass hash and JWT regeneration/refresh.
Then just use that for middleware in the routes.
I have the reverse geocode and csv generation too down that's not bad.