import React from "react";
import EventHandler from "../../utils/eventhandler";
import ReactJson from 'react-json-view'
import getUserSettings from "../../utils/settings";
import './exportsettingscomponent.css';


class ExportSettingsComponent extends React.Component {
    onCopyClick() {
        const wholeSettings = getUserSettings().retrieveWhole();

        // copy to clipboard
        navigator.clipboard.writeText(JSON.stringify(wholeSettings));
    }

    onCloseClick() {
        EventHandler.triggerEvent("export_window_state", { opened: false });
    }

    render() {
        return (
            <div className="export_settings__container">
                <div className="export_settings__background">
                    <div className="export_settings">
                        <header>
                            <h2 className="export_settings__heading">Export Settings</h2>
                        </header>
                        <div className="export_settings__content">
                            <p id="export_settings__hint">The json data below is stored in your localstorage</p>
                            <ReactJson 
                                src={getUserSettings().retrieveWhole()}
                                style={{border: "1px solid rgba(0,0,0,0.2)", borderRadius: "14px", padding: "10px", marginTop: "10px"}}
                                name={false}
                                collapsed={true}
                                collapseStringsAfterLength={65}
                                displayDataTypes={false}
                                enableClipboard={false}
                            />
                        </div>
                        <div className="export_settings__footer">
                            <button id="export_settings__copy_btn" onClick={this.onCopyClick}>Copy</button>
                            <button id="export_settings__close_btn" onClick={this.onCloseClick}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ExportSettingsComponent;