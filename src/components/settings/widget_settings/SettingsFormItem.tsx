import { NativeSelect, NumberInput, PasswordInput, TextInput } from "@mantine/core";
import { useCachedSetting, useSetting } from "../../../utils/eventhooks";
import { Setting } from "../../../utils/registry/types";
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
						data={props.componentSetting.displayedValues}
						value={props.componentSetting.displayedValues[data]}
						onChange={(e) => {
							setData(
								props.componentSetting.displayedValues.indexOf(
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
					{props.componentSetting.hidden ? (
						<PasswordInput
							placeholder={props.componentSetting.tooltip}
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
							placeholder={props.componentSetting.tooltip}
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
			setData(props.componentSetting.default, true);
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
						min={props.componentSetting.min ?? 0}
						max={props.componentSetting.max ?? 100}
						step={props.componentSetting.step ?? 1}
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
