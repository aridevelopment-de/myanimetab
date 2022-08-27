import EventHandler from "../../../utils/eventhandler";
import { useSetting } from "../../../utils/eventhooks";
import styles from "./settingsitemswitch.module.css";

function SettingsItemSwitch(props: { componentId: string }) {
	const [checked, setChecked] = useSetting(props.componentId, "state");

	console.log(props.componentId);

	if (checked !== undefined) {
		return (
			<div
				className={`${styles.settings_switch} ${
					checked ? styles.checked : ""
				}`}
				onClick={(e) => {
					setChecked(!checked);
					EventHandler.emit("rerenderAll");
				}}
			/>
		);
	} else {
		return <span />;
	}
}

export default SettingsItemSwitch;
