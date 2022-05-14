import React from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import EventHandler from "../../../utils/eventhandler";
import getUserSettings from "../../../utils/settings";
import styles from './settingsitemdropdown.module.css'

class SettingsItemDropdown extends React.Component {
    constructor(props) {
        super(props);

        // values: [Apple, Banana]
        // displayedValues: ["Apfel", "Birne"]
        // settingsKey: "clock.food_choice"
        // disabled: [true, false]
        
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
            <div className={`${styles.select} ${this.props.disabled ? styles.disabled : ''} ${this.state.isSelected ? styles.choosing_item : ''}`}>
                <div className={styles.displayed_item} onClick={this.toggleSelected}>
                    <span className={styles.displayed_item__text}>{this.props.displayedValues[this.state.selectedIdx]}</span>
                    <ArrowDropDownIcon className={styles.displayed_item__icon} />
                </div>
                <div 
                    className={`${this.state.isSelected ? styles.choosable_options__selected : ''}`} 
                    style={{
                        display: this.state.isSelected ? "unset" : "none" 
                    }}
                >
                    {
                        this.props.displayedValues.map(elem => {
                            return <div className={styles.choosable_item} onClick={() => this.selectItem(elem)} key={elem}> {elem} </div>
                        })
                    }
                </div>
            </div>
        );
    }
}

export default SettingsItemDropdown;