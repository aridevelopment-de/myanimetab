import React from "react";
import EventHandler from "../../../utils/eventhandler";
import getUserSettings from "../../../utils/settings";
import styles from './settingsitemswitch.module.css';

class SettingsItemSwitch extends React.Component {
    constructor(props) {
        super(props);
        
        this.toggleSwitch = this.toggleSwitch.bind(this);
        this.state = {
            checked: getUserSettings().get(props.settingsKey)
        };
    }

    toggleSwitch() {
        this.setState({
            checked: !this.state.checked
        }, () => {
            getUserSettings().set(this.props.settingsKey, this.state.checked, true);
            EventHandler.triggerEvent("set." + this.props.settingsKey, { value: this.state.checked, sender: "settingsitemswitch" });
        });
    }

    componentDidMount() {
        EventHandler.listenEvent("set." + this.props.settingsKey, "settingsitemswitch", (data) => {
            if (data.sender !== "settingsitemswitch") {
                this.setState({
                    checked: data.value
                });
            }
        })
    }

    componentWillUnmount() {
        EventHandler.unlistenEvent("set." + this.props.settingsKey, "settingsitemswitch");
    }

    render() {
        if (getUserSettings().get(this.props.settingsKey) !== undefined) {
            return (
                <div className={`${styles.settings_switch} ${this.state.checked ? styles.checked : ''}`} 
                    onClick={this.toggleSwitch}/>
            );
        } else {
            return <span />
        }
    }
}

export default SettingsItemSwitch;