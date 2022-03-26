import React from "react";
import SettingsItemDropdown from './SettingsItemDropdown';


class SettingsFormItem extends React.Component {
    // Props
    // formBody: name, id, type, values, displayedValues
    // settingsKey: "cc.name.id"

    render() {
        return (
            <div className="settings_item__form_item">
                <p className="settings_item__form_item_label"> {this.props.formBody.name} </p>
                <div className="settings_item__form_item_content">
                    <SettingsItemDropdown values={this.props.formBody.values} displayedValues={this.props.formBody.displayedValues} settingsKey={this.props.settingsKey} />
                </div>
            </div>
        );
    }
}

export default SettingsFormItem;