import { useSetting } from "../../../../utils/eventhooks";
import { Setting } from "../../../../utils/registry/types";
import styles from './settingsiteminput.module.css';

function SettingsItemInput(props: {
    componentId: string,
    componentSetting: Setting,
    disabled: boolean;
}) {
    const [ value, setValue ] = useSetting(props.componentId, props.componentSetting.key);

    return <input 
                placeholder={props.componentSetting.tooltip}
                onChange={(e) => setValue(e.target.value)}
                onFocus={(e) => {e.target.removeAttribute("readonly")}}
                onBlur={(e) => {e.target.setAttribute("readonly", "readonly")}}
                value={value} 
                style={{
                    fontFamily: props.componentSetting.hidden && value !== "" ? "dotsfont" : "inherit",
                }}
                type="text"
                spellCheck="false"
                autoComplete="off"
                className={`${styles.input} ${props.disabled ? styles.disabled : ""}`}
                readOnly
            />
}

export default SettingsItemInput;