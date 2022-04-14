import React from "react";
import getUserSettings from "../../../utils/settings";
import './settingsiteminput.css';

class SettingsItemInput extends React.Component {
    constructor(props) {
        super(props);

        // settingsKey
        // tooltip
        // hidden

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            input: getUserSettings().get(props.settingsKey)
        }
    }

    handleChange(event) {
        this.setState({
            input: event.target.value
        });

        getUserSettings().set(this.props.settingsKey, event.target.value);
    }

    render() {
        return <input 
                    placeholder={this.props.tooltip}
                    onChange={this.handleChange}
                    value={this.state.input} 
                    type={this.props.hidden ? "password" : "text"}
                    spellCheck="false"
                    className="settings_item__input"
                />
    }
}

export default SettingsItemInput;