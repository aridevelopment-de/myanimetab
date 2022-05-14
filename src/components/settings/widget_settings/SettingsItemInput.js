import React from "react";
import getUserSettings from "../../../utils/settings";
import styles from './settingsiteminput.module.css';

class SettingsItemInput extends React.Component {
    constructor(props) {
        super(props);

        // settingsKey
        // tooltip
        // hidden
        // disabled

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
                    onFocus={(e) => {e.target.removeAttribute("readonly")}}
                    onBlur={(e) => {e.target.setAttribute("readonly", "readonly")}}
                    value={this.state.input} 
                    style={{
                        fontFamily: this.props.hidden && this.state.input !== "" ? "dotsfont" : "inherit",
                    }}
                    type="text"
                    spellCheck="false"
                    autoComplete="off"
                    className={`${styles.input} ${this.props.disabled ? styles.disabled : ""}`}
                    readOnly
                />
    }
}

export default SettingsItemInput;