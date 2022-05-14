import React from "react";
import SettingsItemDropdown from './SettingsItemDropdown';
import SettingsItemInput from './SettingsItemInput';


function SettingsItemLabel(props) {
    if (props.searchValue == null) {
        return <p className="settings_item__form_item_label">
            {props.name}
        </p>;
    } else {
        let recordLength = 0;
        let recordStart = 0;
        let start = 0;
        let count = 0;

        for (let i = 0; i < props.searchValue.length; i++) {
            if (props.name.toLowerCase().includes(props.searchValue.toLowerCase().substring(0, i+1))) {
                if (count === 0) {
                    start = props.name.toLowerCase().indexOf(props.searchValue.toLowerCase().substring(0, i+1));
                }
                
                count++;

                if (count > recordLength) {
                    recordLength = count;
                    recordStart = start;
                }
            } else {
                count = 0;
                start = 0;
            }
        }

        if (recordLength > 0) {
            return <p className="settings_item__form_item_label" style={{fontFamily: "inherit"}}>
                {props.name.substring(0, recordStart)}
                <span 
                    className="settings_item__form_item_label_search_result"
                    style={{
                        fontFamily: "inherit",
                        backgroundColor: "#9AB0303D",
                    }}
                >
                    {props.name.substring(recordStart, recordStart + recordLength)}
                </span>
                {props.name.substring(recordStart + recordLength)}
            </p>;
        } else {
            return <p className="settings_item__form_item_label" style={{fontFamily: "inherit"}}>
                {props.name}
            </p>;
        }
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
                <div>
                    <SettingsItemLabel name={this.props.formBody.name} searchValue={this.props.searchValue} />
                    <div>
                        <SettingsItemDropdown values={this.props.formBody.values} displayedValues={this.props.formBody.displayedValues} settingsKey={this.props.settingsKey} />
                    </div>
                </div>
            );
        } else if (this.props.formBody.type === "input") {
            return (
                <div>
                    <SettingsItemLabel name={this.props.formBody.name} searchValue={this.props.searchValue} />
                    <div>
                        <SettingsItemInput tooltip={this.props.formBody.tooltip} hidden={this.props.formBody.hidden} settingsKey={this.props.settingsKey} />
                    </div>
                </div>
            )
        }
    }
}

export default SettingsFormItem;