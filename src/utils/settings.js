import EventHandler from './eventhandler.js';

let instance = null;

function getUserSettings() {
    if (instance == null) {
        console.debug("[Instance created] Creating new instance of UserSettings");
        instance = new UserSettings();
    }

    return instance;
}

class UserSettings {
    constructor() {
        this.settings = JSON.parse(localStorage.getItem('settings')) || {};
    }

    retrieveWhole() {
        return this.settings;
    }

    overrideSettings(new_settings) {
        this.settings = new_settings;
        this.saveSettings();

        for (let key in this.settings) {
            EventHandler.triggerEvent(`set.${key}`, {value: this.settings[key]});
        }
    }

    saveSettings() {
        localStorage.setItem('settings', JSON.stringify(this.settings));
    }

    get(key) {
        if (key.startsWith("cc")) {
            key = key.split(".");
            let parent = key.shift() + "." + key.shift();
            let child = key.join(".");

            if (this.settings[parent] !== undefined) {
                return this.settings[parent][child];
            } else {    
                console.debug(`[Missing] Settings are missing for key: ${parent}.${child}`);
            }

            return;
        }
        
        if (this.settings[key] === undefined) {
            console.debug("[Missing] Settings missing for key: " + key + "");
        }
        
        return this.settings[key];
    }

    set(key, value, preventEvent, after) {
        console.debug("[Updated] Settings updated: " + key + " with value " + value);
        
        if (key.startsWith("cc.")) {
            key = key.split(".");
            let parent = key.shift() + "." + key.shift();
            let child = key.join(".");

            if (this.settings[parent] === undefined) {
                this.settings[parent] = {};
            }

            this.settings[parent][child] = value;
        } else {
            this.settings[key] = value;
        }
        
        this.saveSettings();

        if (preventEvent !== true) {
            EventHandler.triggerEvent(`set.${key}`, {value});
        }

        if (after !== undefined) {
            after();
        }
    }

    registerSetting(key, value) {
        if (this.get(key) === undefined && value !== null) {
            this.set(key, value);

            console.debug("[Register] Settings registered: " + key + ": " + value);
        }
    }

    deleteSetting(key) {
        if (this.get(key) !== undefined) {
            delete this.settings[key];
            this.saveSettings();

            console.debug("[Delete] Settings deleted: " + key);
        }
    }
}

export default getUserSettings;