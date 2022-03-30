import IS_DEV from './devutils.js';
import EventHandler from './eventhandler.js';

let instance = null;

function getUserSettings() {
    if (instance == null) {
        instance = new UserSettings();
    }
    return instance;
}

class UserSettings {
    constructor() {
        this.settings = {};
    }

    overrideSettings(new_settings) {
        this.settings = new_settings;
        this.saveSettings();

        for (let key in this.settings) {
            EventHandler.triggerEvent(`set.${key}`, {value: this.settings[key]});
        }
    }

    loadSettings() {
        this.settings = JSON.parse(localStorage.getItem('settings'));

        if (this.settings === null) {
            this.settings = {};
            this.saveSettings();
        }
    }

    saveSettings() {
        localStorage.setItem('settings', JSON.stringify(this.settings));
    }

    get(key) {
        if (this.settings[key] === undefined && IS_DEV) {
            console.log("Settings missing: " + key + "");
        }
        
        return this.settings[key];
    }

    set(key, value, preventEvent) {
        if (IS_DEV) {
            console.log("Settings updated: " + key + ": " + value);
        }
        this.settings[key] = value;
        this.saveSettings();

        if (preventEvent !== true) {
            EventHandler.triggerEvent(`set.${key}`, {value});
        }
    }

    registerSetting(key, value) {
        if (this.get(key) === undefined && value !== null) {
            if (IS_DEV) {
                console.log("Settings registered: " + key + ": " + value);
            }
            this.set(key, value);
        }
    }
}

export default getUserSettings;