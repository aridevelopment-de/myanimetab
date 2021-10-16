import React from "react";
import SettingsItemSwitch from './SettingsItemSwitch';
import SettingsFormItem from "./SettingsFormItem";
import Settings from "../../../utils/settings";
import EventHandler from "../../../utils/eventhandler";

class SettingsElement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            disabled: !Settings.getUserSetting(props.descriptorId)
        };

        this.getDisabled = this.getDisabled.bind(this);
    }

    componentDidMount() {
        EventHandler.listenEvent(this.props.descriptorId + "_state", this.props.descriptorId, data => {
            this.setState({
                disabled: !data.checked
            });
        });
    }
    
    componentWillUnmount() {
        EventHandler.unlistenEvent(this.props.descriptorId + "_state", this.props.descriptorId);
    }

    getDisabled() {
        if (Settings.getUserSetting(this.props.descriptorId) === undefined) {
            return '';
        }

        return this.state.disabled === true ? 'disabled' : ''
    }

    render() {
        return (
            <div className={`settings_item ${this.getDisabled()}`}>
                <div className="settings_item__title">
                    <p className="settings_item__title_text"> { this.props.descriptor.name } </p>
                    <div className="settings_item__title_options">
                        <SettingsItemSwitch eventKey={this.props.descriptorId} />
                    </div>
                </div>
                <div className="settings_item__content">
                    {
                        this.props.descriptor.content.map(formBody => 
                            <SettingsFormItem type={formBody.type} data={formBody.values} label={formBody.name} descriptorId={this.props.descriptorId + "." + formBody.id} key={this.props.descriptorId + "." + formBody.id}/>
                        )
                    }
                </div>
            </div>
        )
    }
}

export default SettingsElement;