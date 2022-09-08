import { Menu, Switch } from "@mantine/core";
import { useSetting } from "../../../utils/eventhooks";
import { Component } from "../../../utils/registry/types";
import styles from "./settingselement.module.css";
import SettingsFormItem from "./SettingsFormItem";
import EventHandler from "../../../utils/eventhandler";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import { registry } from "../../../utils/registry/customcomponentregistry";

function SettingsElement(props: { data: Component; searchValue: string }) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [checked, setChecked] = useSetting(props.data.fullId, "state");

	return (
		<div className={`${styles.item} ${!checked ? "disabled" : ""}`}>
			<div className={styles.title}>
				<p className={styles.title_text}>
					{props.data.headerSettings.name}
				</p>
				<div
					style={{
						display: "flex",
						gap: "7px",
					}}
				>
					{checked !== undefined ? (
						<Switch
							checked={checked}
							onChange={(e) => {
								setChecked(e.currentTarget.checked);
								EventHandler.emit("rerenderAll");
							}}
						/>
					) : null}
					{props.data.metadata.removeableComponent ? (
						<Menu shadow="md" width={200} position="left-start">
							<Menu.Target>
								<SettingsIcon
									style={{
										opacity: 0.5,
									}}
								/>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Label>Actions</Menu.Label>
								<Menu.Item
									color="red"
									icon={
										<DeleteIcon sx={{ fontSize: "23px" }} />
									}
									onClick={() => {
										EventHandler.emit(
											"settings_window_state",
											{
												opened: false,
											}
										);

										registry.uninstallComponent(props.data);

										setTimeout(
											() =>
												EventHandler.emit(
													"rerenderAll"
												),
											50
										);
									}}
								>
									Delete Widget
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
					) : null}
				</div>
			</div>
			<div>
				{props.data.contentSettings?.map(
					(componentSetting, index: number) => {
						if (props.searchValue == null) {
							return (
								<SettingsFormItem
									componentSetting={componentSetting}
									componentId={props.data.fullId}
									disabled={checked === false}
									key={index}
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
									key={index}
								/>
							);
						}

						return null;
					}
				)}
			</div>
		</div>
	);
}

export default SettingsElement;
