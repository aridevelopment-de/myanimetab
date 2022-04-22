import React from 'react';
import './widgetsettingscomponent.css';
import CustomComponentRegistry from '../../../utils/customcomponentregistry';
import SettingsElement from './SettingsElement';
import EventHandler from '../../../utils/eventhandler';


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

    render() {
        return (
            <React.Fragment>
                <div className="widget_settings__searchbar">
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
                    console.debug(`Settings Page registered for element: ${component.name} (id ${id})`);
                    
                    return <SettingsElement 
                        data={component} 
                        key={id}
                    />
                })}
                <div className="widget_settings__import_export">
                    <button className="widget_settings__import_btn" onClick={this.onImportClick}>Import</button>
                    <button className="widget_settings__export_btn" onClick={this.onExportClick}>Export</button>
                </div>
                <footer id="widget_settings__footer">
                    <div className="widget_settings__footer_urls">
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
                    <p id="copyright_infrigement">Copyright © 2022 aridevelopment.de</p>
                </footer>
            </React.Fragment>
        )
    }
}

export default WidgetSettingsComponent;