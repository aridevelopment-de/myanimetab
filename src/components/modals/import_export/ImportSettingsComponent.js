import React from "react";
import EventHandler from "../../../utils/eventhandler";
import getUserSettings from "../../../utils/settings";
import styles from './importsettingscomponent.module.css';


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
            <div className={styles.container}>
                <div className={styles.background}>
                    <div className={styles.import_settings}>
                        <header>
                            <h2 className={styles.heading}>Import Settings</h2>
                        </header>
                        <div className={styles.content}>
                            <p id={styles.hint}>We only accept json data</p>
                            <input value={this.state.url} onInput={this.onInputChange}></input>
                        </div>
                        <div className={styles.footer}>
                            <button id={styles.cancel_button} onClick={() => this.buttonClick(false)}>Cancel</button>
                            <button id={styles.submit_button} onClick={() => this.buttonClick(true)}>Import</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ImportSettingsComponent;