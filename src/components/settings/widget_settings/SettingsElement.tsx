import { Switch } from "@mantine/core";
import { useSetting } from "../../../utils/eventhooks";
import { Component } from "../../../utils/registry/types";
import styles from "./settingselement.module.css";
import SettingsFormItem from "./SettingsFormItem";

function SettingsElement(props: { data: Component; searchValue: string }) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [checked, setChecked] = useSetting(props.data.fullId, "state");

	return (
		<div className={`${styles.item} ${!checked ? "disabled" : ""}`}>
			<div className={styles.title}>
				<p className={styles.title_text}>
					{props.data.headerSettings.name}
				</p>
				<div>
					{checked !== undefined ? (
						<Switch
							checked={checked}
							onChange={(e) =>
								setChecked(e.currentTarget.checked)
							}
						/>
					) : null}
				</div>
			</div>
			<div>
				{props.data.contentSettings?.map((componentSetting) => {
					if (props.searchValue == null) {
						return (
							<SettingsFormItem
								componentSetting={componentSetting}
								componentId={props.data.fullId}
								disabled={checked === false}
							/>
						);
					}

					if (
						componentSetting.name
							.toLowerCase()
							.includes(props.searchValue.toLowerCase())
					) {
						return (
							<SettingsFormItem
								componentSetting={componentSetting}
								componentId={props.data.fullId}
								searchValue={props.searchValue}
								disabled={checked === false}
							/>
						);
					}

					return null;
				})}
			</div>
		</div>
	);
}

export default SettingsElement;
