const SETTINGS_DESCRIPTOR = [
    {
        "name": {
            "en": "Auto Hide",
            "de": "Autmatisches Verstecken"
        },
        "id": "auto_hide",
        "option": {
            "type": "toggle",
            "default": true
        },
        "content": [
            {
                "name": {
                    "en": "Time Lapse",
                    "de": "Zeitspanne"
                },
                "id": "time_lapse",
                "type": "dropdown",
                "values": {
                    "en": ["5 s", "10 s", "30 s", "1 min", "5 min"],
                    "de": ["5 s", "10 s", "30 s", "1 min", "5 min"]
                }
            }
        ]
    },
    {
        "name": {
            "en": "Control Bar",
            "de": "Steuerungsleiste"
        },
        "id": "control_bar",
        "option": {
            "type": null
        },
        "content": [
            {
                "name": {
                    "en": "Positioning",
                    "de": "Positionierung"
                },
                "id": "position",
                "type": "dropdown",
                "values": {
                    "en": ["Right upper corner", "Left upper corner"],
                    "de": ["Rechte obere Ecke", "Linke obere Ecke"]
                }
            }
        ]
    },
    {
        "name": {
            "en": "Search Bar",
            "de": "Suchleiste"
        },
        "id": "search_bar",
        "option": {
            "type": "toggle",
            "default": true
        },
        "content": [
            {
                "name": {
                    "en": "Search Engine",
                    "de": "Suchmaschine"
                },
                "id": "search_engine",
                "type": "dropdown",
                "values": {
                    "en": ["Google", "Bing", "Ecosia", "Yahoo", "DuckDuckGo", "Baidu", "Ask", "WolframAlpha"],
                    "de": ["Google", "Bing", "Ecosia", "Yahoo", "DuckDuckGo", "Baidu", "Ask", "WolframAlpha"]
                }
            },
            {
                "name": {
                    "en": "Open With",
                    "de": "Öffne mit"
                },
                "id": "open_with",
                "type": "dropdown",
                "values": {
                    "en": ["Current Tab", "New Tab"],
                    "de": ["Aktueller Tab", "Neuer Tab"]
                }
            },
            {
                "name": {
                    "en": "When Autohiding",
                    "de": "Beim automatischen Verstecken"
                },
                "id": "auto_hide",
                "type": "dropdown",
                "values": {
                    "en": ["Show", "Hide", "Opacity 0.7", "Opacity 0.5", "Opacity 0.3"],
                    "de": ["Sichtbar", "Versteckt", "Deckkraft 0.7", "Deckkraft 0.5", "Deckkraft 0.3"]
                }
            },
            {
                "name": {
                    "en": "Vertical Alignment",
                    "de": "Vertikale Positionierung"
                },
                "id": "vertical_align",
                "type": "dropdown",
                "values": {
                    "en": ["1/4", "2/4", "3/4", "4/4"],
                    "de": ["1/4", "2/4", "3/4", "4/4"]
                }
            }
        ]
    },
    {
        "name": {
            "en": "Clock",
            "de": "Uhr"
        },
        "id": "clock",
        "option": {
            "type": "toggle",
            "default": true
        },
        "content": [
            {
                "name": {
                    "en": "Time Zone",
                    "de": "Zeitzone"
                },
                "id": "time_zone",
                "type": "dropdown",
                "values": {
                    "en": ["Auto", "UTC", "UTC+01", "UTC+02", "UTC-01", "UTC-02"],
                    "de": ["Automatisch", "UTC", "UTC+01", "UTC+02", "UTC-01", "UTC-02"]
                }
            },
            {
                "name": {
                    "en": "Time Format",
                    "de": "Zeitformat"
                },
                "id": "time_format",
                "type": "dropdown",
                "values": {
                    "en": ["24h", "12h"],
                    "de": ["24h", "12h"]
                }
            },
            {
                "name": {
                    "en": "When Autohiding",
                    "de": "Beim automatischen Verstecken"
                },
                "id": "auto_hide",
                "type": "dropdown",
                "values": {
                    "en": ["Show", "Hide", "Opacity 0.7", "Opacity 0.5", "Opacity 0.3"],
                    "de": ["Sichtbar", "Versteckt", "Deckkraft 0.7", "Deckkraft 0.5", "Deckkraft 0.3"]
                }
            },
            {
                "name": {
                    "en": "Positioning",
                    "de": "Positionierung"
                },
                "id": "position",
                "type": "dropdown",
                "values": {
                    "en": ["Left lower corner", "Right lower corner", "Right upper corner", "Left upper corner"],
                    "de": ["Linke untere Ecke", "Rechte untere Ecke", "Rechte obere Ecke", "Linke obere Ecke"]
                }
            }
        ]
    },
    {
        "name": {
            "en": "Switch Wallpaper",
            "de": "Hintergrund wechseln"
        },
        "id": "switch_wallpaper",
        "option": {
            "type": "toggle",
            "default": true
        },
        "content": [
            {
                "name": {
                    "en": "When to switch",
                    "de": "Wann gewechselt wird"
                },
                "id": "when_switch",
                "type": "dropdown",
                "values": {
                    "en": [
                        "Only on Page Visit",
                        "Every 10 seconds",
                        "Every minute", "Every 2 minutes", "Every 5 minutes", "Every 10 minutes", "Every 30 minutes", 
                        "Every hour"
                    ],
                    "de": [
                        "Beim Aufruf der Seite",
                        "Jede 10 Sekunden",
                        "Jede Minute", "Alle 2 Minuten", "Alle 5 Minuten", "Alle 10 Minuten", "Alle 30 Minuten",
                        "Jede Stunde"
                    ]
                }
            },
            {
                "name": {
                    "en": "Playlist Order",
                    "de": "Playlist Reihenfolge"
                },
                "id": "playlist_order",
                "type": "dropdown",
                "values": {
                    "en": ["Ordered", "Shuffled"],
                    "de": ["Geordnet", "Zufällig"]
                }
            }
        ]
    },
    {
        "name": {
            "en": "Language",
            "de": "Sprache"
        },
        "id": "language",
        "option": {
            "type": null
        },
        "content": [
            {
                "name": {
                    "en": "Current Language",
                    "de": "Aktuelle Sprache"
                },
                "id": "current_language",
                "type": "dropdown",
                "values": {
                    "en": ["English", "Deutsch"],
                    "de": ["English", "Deutsch"]
                }
            }
        ]
    }
]

const VALUE_TO_REPR = {
    "language.current_language": {
        "de": "Deutsch",
        "en": "English"
    },
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
        "null": "Only on Page Visit",
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
    "language.current_language": {
        "Deutsch": "de",
        "English": "en"
    },
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
        "Only on Page Visit": null,
        "Every 10 seconds": 10,
        "Every minute": 60,
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