import React from "react";
import SettingsItemSwitch from './SettingsItemSwitch';
import SettingsFormItem from "./SettingsFormItem";
import getUserSettings from "../../../utils/settings";
import EventHandler from "../../../utils/eventhandler";

class SettingsElement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            disabled: !getUserSettings().get(`cc.${props.data.name}.state`)
        };

        this.getDisabled = this.getDisabled.bind(this);
    }

    componentDidMount() {
        EventHandler.listenEvent(`set.cc.${this.props.data.name}.state`, "settingselement", data => {
            this.setState({
                disabled: !data.value
            });
        });
    }
    
    componentWillUnmount() {
        EventHandler.unlistenEvent(`set.cc.${this.props.data.name}.state`, "settingselement");
    }

    getDisabled() {
        if (getUserSettings().get(`cc.${this.props.data.name}.state`) === undefined) {
            return '';
        }

        return this.state.disabled === true ? 'disabled' : '';
    }

    render() {
        return (
            <div className={`settings_item ${this.getDisabled()}`}>
                <div className="settings_item__title">
                    <p className="settings_item__title_text">{this.props.data.settings.name}</p>
                    <div className="settings_item__title_options">
                        <SettingsItemSwitch settingsKey={"cc." + this.props.data.name + ".state"} />
                    </div>
                </div>
                <div className="settings_item__content">
                    {
                        this.props.data.settings.content.map(formBody => {
                            return <SettingsFormItem formBody={formBody} settingsKey={"cc." + this.props.data.name + "." + formBody.id} key={"cc." + this.props.data.name + "." + formBody.id}/>
                        })
                    }
                </div>
            </div>
        )
    }
}

export default SettingsElement;