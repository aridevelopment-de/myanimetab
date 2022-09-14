## Database

Startup
- Check if indexeddb exists with the current version
    - if not: create one
- Scan through indexeddb
- Get identifier for widgets from indexeddb
    - Only have to know what type the identifier is, not which instance
    - Let the identifier be prefixed with the global widget identifier (taken from widgets.json)
        - searchbar-0
- Create instances based on user settings
- Give those instances their id as a prop

When widget added 
- Add settings

When widget removed
- Remove settings

## Todo list

* [x] Reimplement everything in react
* [x] Implement a chrome extension
* [ ] Widgets
    + [ ] Clock Widget
        - [ ] Add alarm clock
    + [ ] Spotify Widget
        - [ ] Control timestamp
        - [ ] Pause/Skip song
        - [ ] Choose playlist
        - [ ] Link the current spotify song to specific images
    + [ ] Weather Widget
        - [x] Set current location
        - [ ] See forecast up to 7 days
    + [ ] Notes widget
        - [ ] Add notes
    + [ ] Todo Widget
        - [ ] Add Todo elements
        - [ ] Check Todo elements
        - [ ] Remove them
    + [ ] Calendar widget
        - [ ] Use google/... calendar or own calendar
        - [ ] Add appointments
        - [ ] Show appointments to day
    + [ ] Anime2you widget?
        - [ ] Complete Anime/Manga/Lightnovel Feed
        - [ ] Personal feed
    + [ ] Email Widget?
        - [ ] Show inbox
        - [ ] Send emails
    + [ ] Stock Widget?
        - [ ] Show current price for bitcoin and other stocks
        - [ ] Show graph 
* [ ] Image Playlists
    + [x] ~~Gallery~~ Decided to go for no gallery to avoid traffic and for other reasons
        - [x] Implement Gallery in Settings Page
        - [x] Above list of categories
        - [x] Below images
        - [x] Load categories and images from server
        - [x] Multiple pages functionality
        - [ ] Dont use the api server to save the images but instead use online services like imgur to save them in order to avoid traffic
        - [ ] Cache images when swapping settings or opening settings
    + [ ] Image Playlist presets (?)
    + [ ] Your own playlist
        - [ ] See selected images
        - [ ] Remove images
        - [ ] Upload via url
        - [ ] Add Image via upload?
* [x] Settings Page
    + [x] Make settings saveable
    + [x] Widget "market"
* [x] Make Searchbar padding with percents not with fixed size
* [x] Add Background Changer every x seconds
