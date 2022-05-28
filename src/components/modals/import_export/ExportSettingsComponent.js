import React from "react";
import ReactJson from 'react-json-view'
import getUserSettings from "../../../utils/settings"
import EventHandler from "../../../utils/eventhandler";
import styles from './exportsettingscomponent.module.css';


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
            <div className={styles.container}>
                <div className={styles.background}>
                    <div className={styles.export_settings}>
                        <header>
                            <h2 className={styles.heading}>Export Settings</h2>
                        </header>
                        <div className={styles.content}>
                            <p id={styles.hint}>The json data below is stored in your localstorage</p>
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
                        <div className={styles.footer}>
                            <button id={styles.copy_button} onClick={this.onCopyClick}>Copy</button>
                            <button id={styles.close_button} onClick={this.onCloseClick}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ExportSettingsComponent;