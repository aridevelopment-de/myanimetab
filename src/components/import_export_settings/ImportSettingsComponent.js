import React from "react";
import EventHandler from "../../utils/eventhandler";
import getUserSettings from "../../utils/settings";
import './importsettingscomponent.css';


class ImportSettingsComponent extends React.Component {
    constructor(props) {
        super(props);
        
        this.buttonClick = this.buttonClick.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.state = {
            settingsData: ""
        }
    }
    
    buttonClick(shouldAdd) {
        if (shouldAdd) {
            // check if the content of this.state.settingsData is valid json
            try {
                JSON.parse(this.state.settingsData);
            } catch (e) {
                alert("The data you entered is not valid JSON");
                return;
            }
            
            getUserSettings().overrideSettings(JSON.parse(this.state.settingsData));
            EventHandler.triggerEvent("import_window_state", { opened: false });

            // reload the page
            window.location.reload();
        } else {
            EventHandler.triggerEvent("import_window_state", { opened: false });
        }
    }

    onInputChange(e) {
        this.setState({
            settingsData: e.target.value
        });
    }

    render() {
        return (
            <div className="import_settings__container">
                <div className="import_settings__background">
                    <div className="import_settings">
                        <header>
                            <h2 className="import_settings__heading">Import Settings</h2>
                        </header>
                        <div className="import_settings__content">
                            <p id="import_settings__hint">We only accept json data</p>
                            <input value={this.state.url} onInput={this.onInputChange}></input>
                        </div>
                        <div className="import_settings__footer">
                            <button id="import_settings__cancel_btn" onClick={() => this.buttonClick(false)}>Cancel</button>
                            <button id="import_settings__submit_btn" onClick={() => this.buttonClick(true)}>Import</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ImportSettingsComponent;