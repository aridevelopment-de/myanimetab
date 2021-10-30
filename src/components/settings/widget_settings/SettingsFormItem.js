import React from "react";
import SettingsItemDropdown from './SettingsItemDropdown';


class SettingsFormItem extends React.Component {
    // Props
    // type: ["dropdown"]
    // data: ["Apfel", "Birne", "Banane", "Kokossnus"]
    // descriptorId: <key>
    // label: <label>
    // disabled

    render() {
        return (
            <div className="settings_item__form_item">
                <p className="settings_item__form_item_label"> {this.props.label} </p>
                <div className="settings_item__form_item_content">
                    <SettingsItemDropdown disabled={this.props.disabled} data={this.props.data} descriptorId={this.props.descriptorId}/>
                </div>
            </div>
        );
    }
}

export default SettingsFormItem;