import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';
import './settingscomponent.css';
import SettingsElement from './SettingsElement';
import EventHandler from '../../utils/eventhandler';
import SETTINGS_DESCRIPTOR from '../../utils/settingsdescriptor';

class SettingsComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            opened: false
        };
    }

    settingsWindowStateChange(data) {        
        this.setState({
            opened: data.opened
        });
    }

    componentDidMount() {
        EventHandler.listenEvent("settings_window_state", "settings_component", this.settingsWindowStateChange.bind(this));
    }

    render() {
        return (
            <div className={`settings_menu__wrapper ${this.state.opened ? '' : 'closed'}`}>
                <div className={`settings_menu abs_fit ${this.state.opened ? '' : 'closed'}`}>
                    <div className="settings_header">
                        <div className="settings_menu__close_icon__wrapper">
                            <CloseIcon onClick={function() {EventHandler.triggerEvent("settings_window_state", {opened: false})} } />
                        </div>
                        <header className="settings_label">
                            <p> Settings </p>
                        </header>
                    </div>
                    <div className="settings_body">
                        <div className="abs_fit">
                            <div className="settings__scroller_viewport">
                                <div className="settings__scroller">
                                    <div className="settings__scroller_content">
                                        <div className="settings_list">
                                            {
                                                SETTINGS_DESCRIPTOR.map(descriptor => 
                                                    <SettingsElement descriptor={ descriptor } descriptorId = { descriptor.id } key={ descriptor.id} />
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SettingsComponent;