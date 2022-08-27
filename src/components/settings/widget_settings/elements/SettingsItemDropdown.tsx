import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useState } from "react";
import { useSetting } from "../../../../utils/eventhooks";
import { Setting } from "../../../../utils/registry/types";
import styles from './settingsitemdropdown.module.css';

function SettingsItemDropdown(props: {
    componentId: string,
    componentSetting: Setting,
    disabled: boolean;
}) {
    const [ droppedDown, setDroppedDown ] = useState(false);
    const [ selectedIndex, setSelectedIndex ] = useSetting(props.componentId, props.componentSetting.key);

    return (
        <div className={`${styles.select} ${props.disabled ? styles.disabled : ''} ${droppedDown ? styles.choosing_item : ''}`}>
            <div className={styles.displayed_item} onClick={() => setDroppedDown(!droppedDown)}>
                <span className={styles.displayed_item__text}>{props.componentSetting.displayedValues[selectedIndex]}</span>
                <ArrowDropDownIcon className={styles.displayed_item__icon} />
            </div>
            <div 
                className={`${droppedDown ? styles.choosable_options__selected : ''}`} 
                style={{ display: droppedDown ? "unset" : "none" }}>
                {props.componentSetting.displayedValues.map((elem: string) => {                    
                    return <div className={styles.choosable_item} 
                                onClick={() => {
                                    const idx = props.componentSetting.displayedValues.indexOf(elem);
                                    
                                    setDroppedDown(false);
                                    setSelectedIndex(idx);
                                }} 
                                key={elem}>
                                {elem} 
                            </div>
                })}
            </div>
        </div>
    );
}

export default SettingsItemDropdown;