import React from "react";
import SETTINGS_DESCRIPTOR from "../../utils/settingsdescriptor";

class SettingsElement extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="settings_item">
                <div className="settings_item__title">
                    <p className="settings_item__title_text"> { this.props.descriptor.name } </p>
                    <div className="settings_item__title_options">
                        <div className="settings_switch checked">

                        </div>
                    </div>
                </div>
                <div className="settings_item__content">
                    <div className="settings_item__form_item">
                        <p className="settings_item__form_item_label"> Time Lapse </p>
                        <div className="settings_item__form_item_content">
                            <div className="settings_select">
                                <div className="settings_select__current_item">
                                    <span className="settings_select__current_item__text">5 s</span>
                                    <span className="material_icons settings_select__current_item__icon"> arrow_drop_down </span>
                                </div>
                                <div className="settings_select__options" style={{ display: "none" }}>
                                    <div className="settings_select__options_item"> 5 s </div>
                                    <div className="settings_select__options_item"> 10 s </div>
                                    <div className="settings_select__options_item"> 30 s </div>
                                    <div className="settings_select__options_item"> 1 min </div>
                                    <div className="settings_select__options_item"> 5 min </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SettingsElement;