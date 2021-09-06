# MyAnimeTab

**I'm currently rewriting the whole thing in React in a MERN style of things. MyAnimeTab may be not a browser extension anymore but just a website itself. Wait for updates!**

Custom Tab Page, made for weebs and osu! players!  
  
Over 60+ pictures picked out by hand!

## How to install

1. Install [Python 3.7+](https://www.python.org/downloads/release/python-370/) with pip
2. Download this repository by downloading the zip file or using ``git clone https://github.com/Ari24-cb24/myanimetab.git``
3. Run ``python3 setup.py`` to install required packages
4. Start the server with ``python3 server.py`` in the server folder
5. (Optional) Create a shortcut in your Startup folder, which links to server.py.
6. Open ``localhost:4444`` in your browser to access the site

## Adding own images*

1. Navigate to ``server/static/images``
2. Add your image

## Adding external URLs as images*

1. Navigate to ``server/static/resources``
2. Open ``urls.json``
3. Add a new image

## Moving widgets around*

1. Navigate to ``server/static/resources``
2. Open ``settings.json``

You will see 2 keys (currently only the time widget and the search bar),
  
``time`` and ``search-bar``  
  
the corresponding number indicates where the widget belongs to.  
Scroll down to get more information, which number does what,

\* <i> Will be implemented in the settings page </i>

## Widget list
- <a href="#Search-bar"> Search bar </a>
- <a href="#Digital-time"> Digital time </a>

<div id="Search-bar">
  <h2> Search bar </h2>
  
  - Default Position: Top-mid (2)
  - Positions:
    1. (1) Top
    2. (2) Top mid
    3. (3) bottom
  
</div>

<div id="Digital-time">
  <h2> Digital time </h2>
  
  - Default Position: Left lower corner (4)
  - Positions:
    1. (1) Left upper corner
    2. (2) Right upper corner
    3. (3) Right lower corner
    4. (4) Left lower corner
  
</div>


## Todo list

~~- Make Searchbar padding with percents not with fixed size~~  
- Create pythonw application
- Add a "block image" feature in the control panel
- Add Spotify Widget
- Add Music Visualizer
- Add Background Changer every x seconds
- Setup a Webserver
- Custom Playlists
  - Galery
- Adding an email widget
- Design settings page
  - Adding external URLs as images
  - Adding image files
  - Adding new widgets
  - Moving widgets around


### Previews

![prev-1](https://i.imgur.com/hzJJox4.png)
![prev-2](https://i.imgur.com/sMK2wqJ.png)
![prev-3](https://i.imgur.com/ePqod2K.png)
