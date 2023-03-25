import {
	Accordion,
	Button,
	NativeSelect,
	NumberInput,
	PasswordInput,
	Stack,
	TextInput,
} from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { useEffect } from "react";
import { useCachedSetting } from "../../../utils/eventhooks";
import { IAccordionAddable, IAccordionNotAddable, IAccordionOptions, IDropdownOptions, Setting } from "../../../utils/registry/types";
import styles from "./settingsformitem.module.css";

type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

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
			setData(0, true);
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
						value={
							props.componentSetting.options.displayedValues[data]
						}
						onChange={(e) => {
							setData(
								(
									props.componentSetting
										.options as IDropdownOptions
								).displayedValues.indexOf(
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
			setData("", true);
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
							defaultValue={data ?? ""}
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
							onChange={(e) => {
								setData(e.currentTarget.value, true);
							}}
							defaultValue={data ?? ""}
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
						onChange={(v) => setData(v, true)}
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
		);
	} else if (props.componentSetting.type === "accordion") {
		if (data === null && props.componentSetting.options.addable) {
			// TODO: Dev Workaround, in future if there are no elements a Text element should be rendered instead
			// Prevent no data at all
			const newData: any = {};

			for (const s of props.componentSetting.options.description) {
				newData[s.key] = ""; // TODO: Use default value
			}

			setData({'i-0': newData}, true)
		}

		return (
			<div>
				<div style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
				}}>
					<SettingsItemLabel
						name={props.componentSetting.name}
						searchValue={props.searchValue}
						className={`${styles.item_label} ${
							props.disabled ? styles.item_label__disabled : undefined
						}`}
					/>
					{props.componentSetting.options.addable && (
						<Button variant="outline" color="gray" compact onClick={() => {

						}}>
							+ Add
						</Button>
					)}
				</div>
				<Stack spacing="xs">
					<Accordion defaultValue={props.componentSetting.key}>
						{!props.componentSetting.options.addable ? props.componentSetting.options.elements.map(
							(
								element: ArrayElement<IAccordionNotAddable['elements']>,
								index: number
							) => {
								const innerContent = element.content.map((s, i) => {
									s = {
										...s,
										key: `${props.componentSetting.key}.${(element as ArrayElement<IAccordionNotAddable['elements']>).key}.${s.key}`,
									}

									return (
										<SettingsFormItem
											componentSetting={s}
											componentId={props.componentId}
											searchValue={props.searchValue}
											disabled={props.disabled}
											key={i}
										/>
									)
								});

								return (
									<Accordion.Item value={(element as ArrayElement<IAccordionNotAddable['elements']>).key} key={index}>
										<Accordion.Control>{(element as ArrayElement<IAccordionNotAddable['elements']>).title}</Accordion.Control>
										<Accordion.Panel>{innerContent}</Accordion.Panel>
									</Accordion.Item>
								)
							}
						) : (data !== undefined && data !== null) && (
							Object.keys(data).map((data_index: string, index: number) => {
								const innerContent = (props.componentSetting.options as IAccordionAddable).description.map((s: Setting, i: number) => {
									s = {
										...s,
										key: `${props.componentSetting.key}.${data_index}.${s.key}`,
									}

									return (
										<SettingsFormItem
											componentSetting={s}
											componentId={props.componentId}
											searchValue={props.searchValue}
											disabled={props.disabled}
											key={i}
										/>
									);
								})

								return (
									<Accordion.Item value={String(data_index)} key={index}>
										<Accordion.Control>{data ? data[data_index].title : "N/A"}</Accordion.Control>
										<Accordion.Panel>{innerContent}</Accordion.Panel>
									</Accordion.Item>
								)
							})
						)}
					</Accordion>
				</Stack>
			</div>
		);
	}

	return null;
}

export default SettingsFormItem;
