import React from "react";
import SettingsItemDropdown from './SettingsItemDropdown';
import SettingsItemInput from './SettingsItemInput';


function SettingsItemLabel(props) {
    if (props.searchValue == null) {
        return <p className="settings_item__form_item_label">
            {props.name}
        </p>;
    } else {
        let highlightedText = props.name.split(" ")
            .map(word => word.toUpperCase() === props.searchValue.toUpperCase() ? `<span style="background-color: rgba(120, 120, 0, 0.4)">${word}</span>` : word)
            .join(" ");

        return <p className="settings_item__form_item_label" dangerouslySetInnerHTML={{
            __html: highlightedText}}
        />
    }
}

class SettingsFormItem extends React.Component {
    // Props
    // formBody: name, id, type, values, displayedValues
    // settingsKey: "cc.name.id"
    // searchValue: null|string

    render() {
        if (this.props.formBody.type === "dropdown") {
            return (
                <div className="settings_item__form_item">
                    <SettingsItemLabel name={this.props.formBody.name} searchValue={this.props.searchValue} />
                    <div className="settings_item__form_item_content">
                        <SettingsItemDropdown values={this.props.formBody.values} displayedValues={this.props.formBody.displayedValues} settingsKey={this.props.settingsKey} />
                    </div>
                </div>
            );
        } else if (this.props.formBody.type === "input") {
            return (
                <div className="settings_item__form_item">
                    <SettingsItemLabel name={this.props.formBody.name} searchValue={this.props.searchValue} />
                    <div className="settings_item__form_item_content">
                        <SettingsItemInput tooltip={this.props.formBody.tooltip} hidden={this.props.formBody.hidden} settingsKey={this.props.settingsKey} />
                    </div>
                </div>
            )
        }
    }
}

export default SettingsFormItem;