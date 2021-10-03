import React from "react";
import EventHandler from "../../utils/eventhandler";
import Settings from "../../utils/settings";
import './settingsitemswitch.css';

class SettingsItemSwitch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: Settings.getUserSetting(props.eventKey)
        };

        this.toggleSwitch = this.toggleSwitch.bind(this);
    }

    toggleSwitch() {
        this.setState({
            checked: !this.state.checked
        });

        // TODO: maybe trigger an overall event where the data contains the descriptorId
        EventHandler.triggerEvent(`${this.props.eventKey}_state`, { checked: this.state.checked });
        Settings.setUserSetting(this.props.eventKey, this.state.checked);
    }

    render() {
        if (Settings.getUserSetting(this.props.eventKey) !== undefined) {
            return (
                <div className={`settings_switch ${this.state.checked ? 'checked' : ''}`} 
                    onClick={this.toggleSwitch}/>
            );
        } else {
            return <span />
        }
    }
}

export default SettingsItemSwitch;