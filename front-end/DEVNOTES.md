##### 01/28/2020
Today I'm just going to structure the app as I see it from the UI mockup.
I'm also going to tackle some of the hardest/unknowns right away.
The S3 thing seems straight forward/I use Boto with S3 but node seems like you just install their SDK.
Other thing that's hard for me(haven't done yet) is the full flow of Node/bcrypt pass hash and JWT regeneration/refresh.
Then just use that for middleware in the routes.
I have the reverse geocode and csv generation too down that's not bad.

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