import axios from "axios";

let savedOptions = {
    "user_settings": {
        "auto_hide": true,
        "auto_hide.time_lapse": 5,
        "control_bar.position": "two",
        "search_bar": true,
        "search_bar.search_engine": "Google",
        "search_bar.preferred_language": "Auto",
        "search_bar.open_with": "Current Tab",
        "search_bar.auto_hide": 0,
        "search_bar.vertical_align": "two",
        "clock": true,
        "clock.time_zone": "Auto",
        "clock.time_format": "24h",
        "clock.auto_hide": 0,
        "clock.position": "four",
        "switch_wallpaper": false,
        "switch_wallpaper.when_switch": "Only on Page Visit",
        "switch_wallpaper.playlist_order": "Ordered",
        "language.current_language": "English"
    },
    "locked_wallpaper": "https://best-extension.extfans.com/theme/wallpapers/pmafipeoccakjnacdojijhgmelhjbk/df23e73165204f223d080cbd0b4bc4.webp"
};

const Settings = {
    loadSettings: function() {
        axios.get("/api/getoptions").then((response) => {
            savedOptions = response.data;
        })
    },
    saveSettings: function() {
        axios.post("/api/getoptions", savedOptions);
    },
    getSettings: function() {
        return savedOptions;
    },
    get: function(key) {
        return savedOptions[key];
    },
    getUserSetting: function(key) {
        return savedOptions["user_settings"][key];
    },
    set: function(key, value) {
        savedOptions[key] = value;
        // this.saveSettings();
    },
    setUserSetting: function(key, value) {
        console.log(key + ": " + value);
        savedOptions["user_settings"][key] = value;
        // this.saveSettings();
    }
}

export default Settings;