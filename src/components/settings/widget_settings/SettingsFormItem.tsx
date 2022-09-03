import { NativeSelect, PasswordInput, TextInput } from "@mantine/core";
import { useSetting } from "../../../utils/eventhooks";
import { Setting } from "../../../utils/registry/types";
import styles from "./settingsformitem.module.css";

function SettingsItemLabel(props: { name: string; searchValue?: string }) {
	if (props.searchValue === undefined) {
		return <p className={styles.item_label}>{props.name}</p>;
	} else {
		let recordLength = 0;
		let recordStart = 0;
		let start = 0;
		let count = 0;

		for (let i = 0; i < props.searchValue.length; i++) {
			if (
				props.name
					.toLowerCase()
					.includes(
						props.searchValue.toLowerCase().substring(0, i + 1)
					)
			) {
				if (count === 0) {
					start = props.name
						.toLowerCase()
						.indexOf(
							props.searchValue.toLowerCase().substring(0, i + 1)
						);
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
			return (
				<p
					className={styles.item_label}
					style={{ fontFamily: "inherit" }}
				>
					{props.name.substring(0, recordStart)}
					<span
						style={{
							fontFamily: "inherit",
							backgroundColor: "#9AB0303D",
						}}
					>
						{props.name.substring(
							recordStart,
							recordStart + recordLength
						)}
					</span>
					{props.name.substring(recordStart + recordLength)}
				</p>
			);
		} else {
			return (
				<p
					className={styles.item_label}
					style={{ fontFamily: "inherit" }}
				>
					{props.name}
				</p>
			);
		}
	}
}

function SettingsFormItem(props: {
	componentSetting: Setting;
	componentId: string;
	searchValue?: string;
	disabled: boolean;
}) {
	const [data, setData] = useSetting(
		props.componentId,
		props.componentSetting.key
	);

	if (props.componentSetting.type === "dropdown") {
		return (
			<div>
				<SettingsItemLabel
					name={props.componentSetting.name}
					searchValue={props.searchValue}
				/>
				<div>
					<NativeSelect
						data={props.componentSetting.displayedValues}
						value={props.componentSetting.displayedValues[data]}
						onChange={(e) => {
							setData(
								props.componentSetting.displayedValues.indexOf(
									e.currentTarget.value
								)
							);
						}}
						variant="filled"
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
					{props.componentSetting.hidden ? (
						<PasswordInput
							placeholder={props.componentSetting.tooltip}
							onChange={(e) => setData(e.currentTarget.value)}
							value={data}
							variant="filled"
							disabled={props.disabled}
						/>
					) : (
						<TextInput
							placeholder={props.componentSetting.tooltip}
							onChange={(e) => setData(e.currentTarget.value)}
							value={data}
							variant="filled"
							disabled={props.disabled}
						/>
					)}
				</div>
			</div>
		);
	}

	return null;
}

export default SettingsFormItem;
