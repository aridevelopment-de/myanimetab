import React from 'react';
import CustomComponentRegistry from '../../../utils/customcomponentregistry';
import SettingsElement from './SettingsElement';
import EventHandler from '../../../utils/eventhandler';
import styles from './widgetsettingscomponent.module.css';


class WidgetSettingsComponent extends React.Component {
    constructor(props) {
        super(props);

        this.onInputChange = this.onInputChange.bind(this);

        this.state = {
            searchbarValue: ""
        };
    }

    onImportClick() {
        EventHandler.triggerEvent("import_window_state", { opened: true });
    }

    onExportClick() {
        EventHandler.triggerEvent("export_window_state", { opened: true });
    }

    onInputChange(event) {
        this.setState({ searchbarValue: event.target.value });
    }

    containsString(string, settings) {
        string = string.toLowerCase();

        for (let i = 0; i < settings.content.length; i++) {
            if (settings.content[i].name.toLowerCase().includes(string)) {
                return true;
            }
        }

        return false;
    }

    render() {
        return (
            <React.Fragment>
                <div className={styles.searchbar}>
                    <input
                        onInput={this.onInputChange}
                        value={this.state.searchbarValue}
                        type="text"
                        spellCheck="false"
                        placeholder="Enter Keywords"
                        autoComplete="off"
                    />
                </div>
                {CustomComponentRegistry.getAllSettingsAvailable().map(id => {
                    const component = CustomComponentRegistry.get(id);
                    
                    if (this.state.searchbarValue.trim() === "") {
                        return <SettingsElement 
                            data={component} 
                            key={id}
                            searchValue={null}
                        />
                    }

                    if (this.containsString(this.state.searchbarValue, component.settings)) {
                        return <SettingsElement 
                            data={component} 
                            key={id}
                            searchValue={this.state.searchbarValue}
                        />
                    }

                    return null;
                })}
                <div className={styles.control_group}>
                    <button className={styles.import_button} onClick={this.onImportClick}>Import</button>
                    <button className={styles.export_button} onClick={this.onExportClick}>Export</button>
                </div>
                <footer id={styles.footer}>
                    <div className={styles.urls}>
                        <a href="https://github.com/aridevelopment-de/myanimetab">
                            <img src="/icons/github.svg" alt="GitHub" />
                        </a>
                        <a href="https://aridevelopment.de/">
                            <img src="/icons/website.png" alt="Website" />
                        </a>
                        <a href="https://twitter.com/AriOnIce">
                            <img src="/icons/twitter.svg" alt="Twitter" />
                        </a>
                        <a href="https://aridevelopment.de/discord">
                            <img src="/icons/discord.svg" alt="Discord" />
                        </a>
                        <a href="mailto:ari.publicmail@gmail.com">
                            <img src="/icons/email.svg" alt="Mail" />
                        </a>
                    </div>
                    <p id={styles.copyright_infrigement}>Copyright © 2022 aridevelopment.de</p>
                </footer>
            </React.Fragment>
        )
    }
}

export default WidgetSettingsComponent;