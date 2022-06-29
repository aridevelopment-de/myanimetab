import { Setting } from '../../../utils/registry/types';
import SettingsItemDropdown from './elements/SettingsItemDropdown';
import SettingsItemInput from './elements/SettingsItemInput';


function SettingsItemLabel(props: {
	name: string,
	searchValue?: string
}) {
    if (props.searchValue === undefined) {
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

function SettingsFormItem(props: {
	componentSetting: Setting,
	componentId: string,
	searchValue?: string,
	disabled: boolean
}) {
    if (props.componentSetting.type === "dropdown") {
        return (
            <div>
                <SettingsItemLabel 
                    name={props.componentSetting.name} 
                    searchValue={props.searchValue} 
                />
                <div>
                    <SettingsItemDropdown 
						componentId={props.componentId}
                        componentSetting={props.componentSetting}
                        disabled={props.disabled}
                    />
                </div>
            </div>
        );
    } else if (props.componentSetting.type === "input") {
        return (
            <div>
                <SettingsItemLabel 
                    name={props.componentSetting.name} 
                    searchValue={props.searchValue} 
                />
                <div>
                    <SettingsItemInput 
						componentId={props.componentId}
                        componentSetting={props.componentSetting}
                        disabled={props.disabled}
                    />
                </div>
            </div>
        )
    }

	return null;
}

export default SettingsFormItem;