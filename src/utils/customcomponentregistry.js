import getUserSettings from "./settings";

const CustomComponentRegistry = {
    components: {},
    register(name, component, settings) {
        this.components[name] = {name, component, settings};

        getUserSettings().registerSetting(`cc.${settings.id}`, settings.option.default);
        
        for (let idx in settings.content) {
            // we assume that every content is a dropdown
            getUserSettings().registerSetting(`cc.${settings.id}.${settings.content[idx].id}`, 0);
        }
    },
    registerNonComponent(name, settings) {
        this.components[name] = {name, settings};

        getUserSettings().registerSetting(`cc.${settings.id}`, settings.option.default);
        for (let idx in settings.content) {
            // we assume that every content is a dropdown
            getUserSettings().registerSetting(`cc.${settings.id}.${settings.content[idx].id}`, 0);
        }
    },
    unregister(name) {
        delete this.components[name];
    },
    get(name) {
        return this.components[name];
    },
    getSettings(name) {
        return this.components[name].settings;
    },
    getAll() {
        return this.components;
    }
}

export default CustomComponentRegistry;