import getUserSettings from "./settings";

const CustomComponentRegistry = {
    components: {},
    register(name, component, storeRegisterInformation, settings) {
        const id = Object.keys(this.components).length;

        this.components[id] = {
            name,
            component, 
            storeRegisterInformation, 
            settings
        };

        getUserSettings().registerSetting(`cc.${settings.id}.state`, settings.option.default);
        
        for (let idx in settings.content) {
            // we assume that every content is a dropdown
            getUserSettings().registerSetting(`cc.${settings.id}.${settings.content[idx].id}`, 0);
        }
    },
    registerNonComponent(name, settings) {
        // TODO: Add CustomHelpRegistry
        // TODO: add storeRegisterInformation
        this.components[Object.keys(this.components).length] = {name, settings};

        getUserSettings().registerSetting(`cc.${settings.id}.state`, settings.option.default);
        
        for (let idx in settings.content) {
            // we assume that every content is a dropdown
            getUserSettings().registerSetting(`cc.${settings.id}.${settings.content[idx].id}`, 0);
        }
    },
    unregister(id) {
        delete this.components[id];
    },
    get(id) {
        return this.components[id];
    },
    getAll() {
        return Object.keys(this.components);
    },
    getAllAvailable() {
        /*
        Returns components that are either installed or do not appear in the store page
        */
        const installedComponents = getUserSettings().get("installed_components");
        return Object.keys(this.components)
            .map(e => parseInt(e))
            .filter(e => this.components[e].storeRegisterInformation !== undefined)
            .filter(e => installedComponents.includes(e) || !this.components[e].storeRegisterInformation.shouldRegister);
    },
    getAllSettingsAvailable() {
        /*
        Returns components that are either installed, do not appear in the store page or are not a component
        */
        const installedComponents = getUserSettings().get("installed_components");
        return Object.keys(this.components)
            .map(e => parseInt(e))
            .filter(e => {
                if (installedComponents.includes(e)) {
                    return true;
                } else if (this.components[e].storeRegisterInformation === undefined) {
                    return true;
                } else if (!this.components[e].storeRegisterInformation.shouldRegister) {
                    return true;
                }

                return false;
            })
            .sort((a, b) => {
                // Might add a custom sorting method choosen by the user later
                if (this.components[a].name < this.components[b].name) {
                    return -1;
                } else if (this.components[a].name > this.components[b].name) {
                    return 1;
                }

                return 0;
            });
    },
    getAllStorePage() {
        /*
        Returns all components that can be installed and should appear in the store page
        */
        return Object.keys(this.components)
            .map(e => parseInt(e))
            .filter(e => this.components[e].storeRegisterInformation !== undefined)
            .filter(e => this.components[e].storeRegisterInformation.shouldRegister);
    }
}

export default CustomComponentRegistry;