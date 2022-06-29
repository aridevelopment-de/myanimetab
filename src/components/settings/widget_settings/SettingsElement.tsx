import { useSetting } from "../../../utils/eventhooks";
import { Component } from "../../../utils/registry/types";
import styles from './settingselement.module.css';
import SettingsFormItem from "./SettingsFormItem";
import SettingsItemSwitch from './SettingsItemSwitch';

function SettingsElement(props: {
    data: Component,
    searchValue: string
}) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ checked, _ ] = useSetting(props.data.fullId, "state");

    return (
        <div className={`${styles.item} ${!checked ? 'disabled' : ''}`}>
            <div className={styles.title}>
                <p className={styles.title_text}>{props.data.headerSettings.name}</p>
                <div className="settings_item__title_options">
                    <SettingsItemSwitch componentId={props.data.fullId} />
                </div>
            </div>
            <div className="settings_item__content">
                {props.data.contentSettings?.map(componentSetting => {
                    if (props.searchValue == null) {
                        return <SettingsFormItem 
                            componentSetting={componentSetting}
                            componentId={props.data.fullId} 
                            disabled={checked === false}
                        />
                    }
                    
                    
                    if (componentSetting.name.toLowerCase().includes(props.searchValue.toLowerCase())) {
                        return <SettingsFormItem 
                            componentSetting={componentSetting}
                            componentId={props.data.fullId} 
                            searchValue={props.searchValue}
                            disabled={checked === false}
                        />
                    }

                    return null;
                })}
            </div>
        </div>
    )
}

export default SettingsElement;