import React from "react";
import EventHandler from "../../../utils/eventhandler";
import Settings from "../../../utils/settings";
import './settingsitemswitch.css';

class SettingsItemSwitch extends React.Component {
    constructor(props) {
        super(props);
        
        this.toggleSwitch = this.toggleSwitch.bind(this);

        this.state = {
            checked: Settings.getUserSetting(props.eventKey)
        };
    }

    toggleSwitch() {
        EventHandler.triggerEvent(`${this.props.eventKey}_state`, { checked: !this.state.checked });
        Settings.setUserSetting(this.props.eventKey, !this.state.checked);
        
        this.setState({
            checked: !this.state.checked
        });
    }

    componentDidMount() {
        EventHandler.listenEvent(`${this.props.eventKey}_state_force`, `${this.props.eventKey}_state`, (data) => {
            this.setState({
                checked: data.checked
            });
        });
    }

    componentWillUnmount() {
        EventHandler.unlistenEvent(`${this.props.eventKey}_state_force`, `${this.props.eventKey}_state`);
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