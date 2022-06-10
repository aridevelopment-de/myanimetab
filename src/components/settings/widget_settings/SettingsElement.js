import React from "react";
import SettingsItemSwitch from './SettingsItemSwitch';
import SettingsFormItem from "./SettingsFormItem";
import getUserSettings from "../../../utils/settings";
import EventHandler from "../../../utils/eventhandler";
import styles from './settingselement.module.css';

class SettingsElement extends React.Component {
    constructor(props) {
        super(props);

        // data
        // searchValue

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

        if (getUserSettings().get(`cc.${this.props.data.name}.state`) === undefined) {
            this.setState({
                disabled: false
            });
        }
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
            <div className={`${styles.item} ${this.getDisabled()}`}>
                <div className={styles.title}>
                    <p className={styles.title_text}>{this.props.data.settings.name}</p>
                    <div className="settings_item__title_options">
                        <SettingsItemSwitch settingsKey={"cc." + this.props.data.name + ".state"} />
                    </div>
                </div>
                <div className="settings_item__content">
                    {this.props.data.settings.content.map(formBody => {
                        if (this.props.searchValue == null) {
                            return <SettingsFormItem 
                                formBody={formBody} 
                                settingsKey={"cc." + this.props.data.name + "." + formBody.id} 
                                key={"cc." + this.props.data.name + "." + formBody.id}
                                searchValue={null}
                                disabled={this.state.disabled}
                            />
                        }
                        
                        
                        if (formBody.name.toLowerCase().includes(this.props.searchValue.toLowerCase())) {
                            return <SettingsFormItem 
                                formBody={formBody} 
                                settingsKey={"cc." + this.props.data.name + "." + formBody.id} 
                                key={"cc." + this.props.data.name + "." + formBody.id}
                                searchValue={this.props.searchValue}
                                disabled={this.state.disabled}
                            />
                        }

                        return null;
                    })}
                </div>
            </div>
        )
    }
}

export default SettingsElement;