# EventProtocol

This file concludes a list of known events used with the EventHandler  


## ``blurall``

Will be send if auto_hide activates

```json
{
    "blur": [true/false]
}
```


## ``skip_image``

Skips the current background image, also unlockes the current lock state

```json
{ }
```


## ``settings_window_state``

Will be send to open/close the settings panel

```json
{
    "opened": [true/false]
}
```


## `import_window_state`

Will be send to open/close the import settings window

```json
{
    "opened": [true/false]
}
```


## `export_window_state`

Wil be send to open/close the import settings window

```json
{
    "opened": [true/false]
}
```


## ``url_add_window_state``

Is being send when user clicks on "+" (Add Image) (Settings -> Playlists, last element)

```json
{
    "opened": [true, false]
}
```


## ``full_screen_image_window_state``

Is being send when user clicks on the fullscreen icon on any image (Settings -> Playlists)

```json
{
    "url": "none if the window should close else the url of the image to display"
}
```


## ``playlist_refresh``

If the Image Playlist needs to be refreshed (e.g. when a new image gets added)

```json
No Data
```


## ``select_image``

If a specific image should be selected (e.g. when clicking on an image in the playlist settings view)

```json
{
    "idx": "the new index of the image being seleceted"
}
```


## ``set.<id>``

If an option entry gets updated via Settings class, this will be called

```json
{
    "value": "new value",
    "sender": "optional, to avoid circular events"
}