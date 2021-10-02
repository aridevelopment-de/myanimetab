import React from "react";
import './settingsitemswitch.css';

class SettingsItemSwitch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: true
        }

        this.toggleSwitch = this.toggleSwitch.bind(this);
    }

    toggleSwitch() {
        this.setState({
            checked: !this.state.checked
        })
    }

    render() {
        return (
            <div className={`settings_switch ${this.state.checked ? 'checked' : ''}`} 
                onClick={this.toggleSwitch}/>
        );
    }
}

export default SettingsItemSwitch;