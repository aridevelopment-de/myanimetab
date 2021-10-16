import React from "react";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Settings from "../../../utils/settings";
import settingsdescriptor from "../../../utils/settingsdescriptor";
import './settingsitemdropdown.css'

class SettingsItemDropdown extends React.Component {
    constructor(props) {
        super(props);

        // descriptorId
        // data: ["Apfel", "Birne", "Banane"]

        this.state = {
            selected: Settings.getUserSetting(props.descriptorId),
            selectedLabel: "",
            isSelected: false
        };

        this.getSelectedLabel = this.getSelectedLabel.bind(this);
        this.getSelectedValue = this.getSelectedValue.bind(this);
        this.toggleSelected = this.toggleSelected.bind(this);
        this.selectItem = this.selectItem.bind(this);
    }

    componentDidMount() {
        // state.selected has to be initzialized in order to call getSelectedLabel

        this.setState({
            selectedLabel: this.getSelectedLabel()
        })
    }

    getSelectedLabel() {  
        if (this.props.descriptorId in settingsdescriptor.VALUE_TO_REPR) {
            if (this.state.selected in settingsdescriptor.VALUE_TO_REPR[this.props.descriptorId]) {
                return settingsdescriptor.VALUE_TO_REPR[this.props.descriptorId][this.state.selected];
            }
        }

        return this.state.selected;
    }

    getSelectedValue() {
        if (this.props.descriptorId in settingsdescriptor.REPR_TO_VALUE) {
            if (this.state.selectedLabel in settingsdescriptor.REPR_TO_VALUE[this.props.descriptorId]) {
                return settingsdescriptor.REPR_TO_VALUE[this.props.descriptorId][this.state.selectedLabel];
            }
        }

        return this.state.selectedLabel;
    }

    toggleSelected() {
        this.setState({
            isSelected: !this.state.isSelected
        });
    }

    selectItem(value) {
        this.toggleSelected();
        this.setState({
            selectedLabel: value
        }, () => {
            this.setState({
                selected: this.getSelectedValue()
            }, () => {
                Settings.setUserSetting(this.props.descriptorId, this.state.selected);                
            });
        });

        // EventHandler.triggerEvent("")
    }

    render() {
        return (
            <div className={`settings_select ${this.state.isSelected ? 'choosing_item' : ''}`}>
                <div className="settings_select__current_item" onClick={this.toggleSelected}>
                    <span className="settings_select__current_item__text"> {this.state.selectedLabel} </span>
                    <ArrowDropDownIcon className="settings_select__current_item__icon" />
                </div>
                <div className={`settings_select__options ${this.state.isSelected ? 'selected' : ''}`} style={{ display: this.state.isSelected ? "unset" : "none" }}>
                    {
                        this.props.data.map(elem => 
                            <div className="settings_select__options_item" onClick={() => this.selectItem(elem)} key={elem}> {elem} </div>
                        )
                    }
                </div>
            </div>
        );
    }
}

export default SettingsItemDropdown;