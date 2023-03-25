import { NativeSelect, NumberInput, PasswordInput, TextInput } from "@mantine/core";
import { useCachedSetting } from "../../../utils/eventhooks";
import { IDropdownOptions, Setting } from "../../../utils/registry/types";
import styles from "./settingsformitem.module.css";

export const SettingsItemLabel = (props: {
	name: string;
	searchValue?: string;
	className?: string;
}) => {
	if (props.searchValue === undefined) {
		return <p className={props.className}>{props.name}</p>;
	} else {
		if (
			props.name.toLowerCase().includes(props.searchValue.toLowerCase())
		) {
			const start = props.name
				.toLowerCase()
				.indexOf(props.searchValue.toLowerCase());
			const length = props.searchValue.length;

			return (
				<p
					className={props.className}
					style={{ fontFamily: "inherit" }}
				>
					{props.name.substring(0, start)}
					<span
						style={{
							fontFamily: "inherit",
							backgroundColor: "var(--mantine-color-yellow-5)",
						}}
					>
						{props.name.substring(start, start + length)}
					</span>
					{props.name.substring(start + length)}
				</p>
			);
		} else {
			return (
				<p
					className={props.className}
					style={{ fontFamily: "inherit" }}
				>
					{props.name}
				</p>
			);
		}
	}
};

function SettingsFormItem(props: {
	componentSetting: Setting;
	componentId: string;
	searchValue?: string;
	disabled: boolean;
}) {
	const [data, setData] = useCachedSetting(
		props.componentId,
		props.componentSetting.key
	);

	if (props.componentSetting.type === "dropdown") {
		if (data === null) {
			setData(0, true); // TODO: Use default value
		}

		return (
			<div>
				<SettingsItemLabel
					name={props.componentSetting.name}
					searchValue={props.searchValue}
					className={`${styles.item_label} ${
						props.disabled ? styles.item_label__disabled : undefined
					}`}
				/>
				<div>
					<NativeSelect
						data={props.componentSetting.options.displayedValues}
						value={props.componentSetting.options.displayedValues[data]}
						onChange={(e) => {
							setData(
								(props.componentSetting.options as IDropdownOptions).displayedValues.indexOf(
									e.currentTarget.value
								),
								true
							);
						}}
						variant="filled"
						disabled={props.disabled}
						classNames={{ input: styles.element }}
					/>
				</div>
			</div>
		);
	} else if (props.componentSetting.type === "input") {
		if (data === null) {
			setData("", true); // TODO: Use default value
		}
		
		return (
			<div>
				<SettingsItemLabel
					name={props.componentSetting.name}
					searchValue={props.searchValue}
					className={`${styles.item_label} ${
						props.disabled ? styles.item_label__disabled : undefined
					}`}
				/>
				<div>
					{props.componentSetting.options.hidden ? (
						<PasswordInput
							placeholder={props.componentSetting.options.tooltip}
							onChange={(e) =>
								setData(e.currentTarget.value, true)
							}
							value={data ?? ""}
							variant="filled"
							disabled={props.disabled}
							classNames={{
								input: styles.element,
								icon: styles.element,
								rightSection: styles.element,
							}}
						/>
					) : (
						<TextInput
							placeholder={props.componentSetting.options.tooltip}
							onChange={(e) =>
								setData(e.currentTarget.value, true)
							}
							value={data ?? ""}
							variant="filled"
							disabled={props.disabled}
							classNames={{
								input: styles.element,
								icon: styles.element,
								rightSection: styles.element,
							}}
						/>
					)}
				</div>
			</div>
		);
	} else if (props.componentSetting.type === "number") {
		if (data === null) {
			setData(props.componentSetting.options.default, true);
		}

		return (
			<div>
				<SettingsItemLabel
					name={props.componentSetting.name}
					searchValue={props.searchValue}
					className={`${styles.item_label} ${
						props.disabled ? styles.item_label__disabled : undefined
					}`}
				/>
				<div>
					<NumberInput
						onChange={(v) =>
							setData(v, true)
						}
						value={data ?? ""}
						variant="filled"
						disabled={props.disabled}
						classNames={{
							input: styles.element,
							icon: styles.element,
							rightSection: styles.element,
						}}
						min={props.componentSetting.options.min ?? 0}
						max={props.componentSetting.options.max ?? 100}
						step={props.componentSetting.options.step ?? 1}
						stepHoldDelay={500}
        		stepHoldInterval={100}
						/>
				</div>
			</div>
		)
	}

	return null;
}

export default SettingsFormItem;
