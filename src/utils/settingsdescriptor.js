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

const VALUE_TO_REPR = {
    "auto_hide.time_lapse": {
        "5": "5 s",
        "10": "10 s",
        "30": "30 s",
        "60": "1 min",
        "300": "5 min"
    },
    "control_bar.position": {
        "one": "Left upper corner",
        "two": "Right upper corner"
    },
    "search_bar.auto_hide": {
        "1": "Show",
        "0": "Hide",
        "0.7": "Opacity 0.7",
        "0.5": "Opacity 0.5",
        "0.3": "Opacity 0.3"
    },
    "search_bar.vertical_align": {
        "one": "1/4",
        "two": "2/4",
        "three": "3/4",
        "four": "4/4"
    },
    "clock.auto_hide": {
        "1": "Show",
        "0": "Hide",
        "0.7": "Opacity 0.7",
        "0.5": "Opacity 0.5",
        "0.3": "Opacity 0.3"
    },
    "clock.position": {
        "one": "Left upper corner",
        "two": "Right upper corner",
        "three": "Right lower corner",
        "four": "Left lower corner"
    },
    "switch_wallpaper.when_switch": {
        "Only on Page Visit": "Only on Page Visit",
        "10": "Every 10 seconds",
        "60": "Every 1 minute",
        "120": "Every 2 minutes",
        "300": "Every 5 minutes",
        "600": "Every 10 minutes",
        "1800": "Every 30 minutes",
        "3600": "Every hour"
    }
}

const REPR_TO_VALUE = {
    "auto_hide.time_lapse": {
        "5 s": 5,
        "10 s": 10,
        "30 s": 30,
        "1 min": 60,
        "5 min": 300
    },
    "control_bar.position": {
        "Left upper corner": "one",
        "Right upper corner": "two"
    },
    "search_bar.auto_hide": {
        "Show": 1,
        "Hide": 0,
        "Opacity 0.7": 0.7,
        "Opacity 0.5": 0.5,
        "Opacity 0.3": 0.3
    },
    "search_bar.vertical_align": {
        "1/4": "one",
        "2/4": "two",
        "3/4": "three",
        "4/4": "four"
    },
    "clock.auto_hide": {
        "Show": 1,
        "Hide": 0,
        "Opacity 0.7": 0.7,
        "Opacity 0.5": 0.5,
        "Opacity 0.3": 0.3
    },
    "clock.position": {
        "Left upper corner": "one",
        "Right upper corner": "two",
        "Right lower corner": "three",
        "Left lower corner": "four"
    },
    "switch_wallpaper.when_switch": {
        "Only on Page Visit": "Only on Page Visit",
        "Every 10 seconds": 10,
        "Every 1 minute": 60,
        "Every 2 minutes": 120,
        "Every 5 minutes": 300,
        "Every 10 minutes": 600,
        "Every 30 minutes": 1800,
        "Every hour": 3600
    }
}

export default {
    SETTINGS_DESCRIPTOR: SETTINGS_DESCRIPTOR, 
    REPR_TO_VALUE: REPR_TO_VALUE,
    VALUE_TO_REPR: VALUE_TO_REPR};