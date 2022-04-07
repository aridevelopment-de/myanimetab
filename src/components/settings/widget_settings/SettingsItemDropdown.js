import React from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import EventHandler from "../../../utils/eventhandler";
import getUserSettings from "../../../utils/settings";
import './settingsitemdropdown.css'

class SettingsItemDropdown extends React.Component {
    constructor(props) {
        super(props);

        // values: [Apple, Banana]
        // displayedValues: ["Apfel", "Birne"]
        // settingsKey: "clock.food_choice"
        
        this.state = {
            selectedIdx: getUserSettings().get(props.settingsKey),
            isSelected: false
        };

        this.toggleSelected = this.toggleSelected.bind(this);
        this.selectItem = this.selectItem.bind(this);
    }

    toggleSelected() {
        this.setState({
            isSelected: !this.state.isSelected
        });
    }

    selectItem(value) {
        this.toggleSelected();

        let idx = this.props.displayedValues.indexOf(value);

        this.setState({
            selectedIdx: idx
        }, () => {
            getUserSettings().set(this.props.settingsKey, idx, true);
            EventHandler.triggerEvent("set." + this.props.settingsKey, { value: idx, sender: "settingsitemdropdown" });
        })
    }

    render() {
        return (
            <div className={`settings_select ${this.state.isSelected ? 'choosing_item' : ''}`}>
                <div className="settings_select__current_item" onClick={this.toggleSelected}>
                    <span className="settings_select__current_item__text"> {this.props.displayedValues[this.state.selectedIdx]} </span>
                    <ArrowDropDownIcon className="settings_select__current_item__icon" />
                </div>
                <div className={`settings_select__options ${this.state.isSelected ? 'selected' : ''}`} style={{ display: this.state.isSelected ? "unset" : "none" }}>
                    {
                        this.props.displayedValues.map(elem => {
                            return <div className="settings_select__options_item" onClick={() => this.selectItem(elem)} key={elem}> {elem} </div>
                        })
                    }
                </div>
            </div>
        );
    }
}

export default SettingsItemDropdown;