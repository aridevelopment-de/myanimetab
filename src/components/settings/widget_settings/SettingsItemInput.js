import React from "react";
import getUserSettings from "../../../utils/settings";


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
                    style={{
                        width: "100%",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        borderRadius: "6px",
                        boxSizing: "border-box",
                        border: "1px solid #4a4a4a",
                    }}
                />
    }
}

export default SettingsItemInput;