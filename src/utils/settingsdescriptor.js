const SETTINGS_DESCRIPTOR = [
    {
        "name": "Auto Hide",
        "id": "auto_hide",
        "option": {
            "type": "toggle",
            "default": true
        },
        "content": [
            {
                "name": "Time Lapse",
                "id": "time_lapse",
                "type": "dropdown",
                "values": [
                    "5 s", "10 s", "30 s", "1 min", "5 min"
                ]
            }
        ]
    },
    {
        "name": "Control Bar",
        "id": "control_bar",
        "option": {
            "type": null
        },
        "content": [
            {
                "name": "Positioning",
                "id": "position",
                "type": "dropdown",
                "values": [
                    "Right upper corner", "Left upper corner"
                ]
            }
        ]
    },
    {
        "name": "Search Bar",
        "id": "search_bar",
        "option": {
            "type": "toggle",
            "default": true
        },
        "content": [
            {
                "name": "Search Engine",
                "id": "search_engine",
                "type": "dropdown",
                "values": [
                    "Google", "Bing", "Yahoo", "DuckDuckGo", "Baidu", "Ask", "WolframAlpha"
                ]
            },
            {
                "name": "Preferred Language",
                "id": "preferred_language",
                "type": "dropdown",
                "values": [
                    "Auto", "German", "English", "Japanese"
                ]
            },
            {
                "name": "Open With",
                "id": "open_with",
                "type": "dropdown",
                "values": [
                    "Current Tab", "New Tab"
                ]
            },
            {
                "name": "When Autohiding",
                "id": "auto_hide",
                "type": "dropdown",
                "values": [
                    "Show", "Hide", "Opacity 0.7", "Opacity 0.5", "Opacity 0.3"
                ]
            },
            {
                "name": "Vertical Alignment",
                "id": "vertical_align",
                "type": "dropdown",
                "values": [
                    "1/4", "2/4", "3/4", "4/4"
                ]
            }
        ]
    },
    {
        "name": "Clock",
        "id": "clock",
        "option": {
            "type": "toggle",
            "default": true
        },
        "content": [
            {
                "name": "Time Zone",
                "id": "time_zone",
                "type": "dropdown",
                "values": [
                    "Auto", "UTC", "UTC+01", "UTC+02", "UTC-01", "UTC-02"
                ]
            },
            {
                "name": "Time Format",
                "id": "time_format",
                "type": "dropdown",
                "values": [
                    "24h", "12h"
                ]
            },
            {
                "name": "When Autohiding",
                "id": "auto_hide",
                "type": "dropdown",
                "values": [
                    "Show", "Hide", "Opacity 0.7", "Opacity 0.5", "Opacity 0.3"
                ]
            },
            {
                "name": "Positioning",
                "id": "position",
                "type": "dropdown",
                "values": [
                    "Left lower corner", "Right lower corner", "Right upper corner", "Left upper corner"
                ]
            }
        ]
    },
    {
        "name": "Switch Wallpaper",
        "id": "switch_wallpaper",
        "option": {
            "type": "toggle",
            "default": true
        },
        "content": [
            {
                "name": "When to switch",
                "id": "when_switch",
                "type": "dropdown",
                "values": [
                    "Only on Page Visit",
                    "Every 10 seconds",
                    "Every 1 minute", "Every 2 minutes", "Every 5 minutes", "Every 10 minutes", "Every 30 minutes", 
                    "Every hour"
                ]
            },
            {
                "name": "Playlist Order",
                "id": "playlist_order",
                "type": "dropdown",
                "values": [
                    "Ordered",
                    "Shuffled"
                ]
            }
        ]
    },
    {
        "name": "Language",
        "id": "language",
        "option": {
            "type": null
        },
        "content": [
            {
                "name": "Current Language",
                "id": "current_language",
                "type": "dropdown",
                "values": [
                    "English"
                ]
            }
        ]
    }
]

export default SETTINGS_DESCRIPTOR;