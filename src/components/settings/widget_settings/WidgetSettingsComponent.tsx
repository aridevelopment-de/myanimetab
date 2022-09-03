// @ts-nocheck
import {
	Button,
	Group,
	Menu,
	Modal,
	Select,
	Stack,
	Text,
	Textarea,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import { widgetsDb } from "../../../utils/db";
import { registry } from "../../../utils/registry/customcomponentregistry";
import { Component, KnownComponent } from "../../../utils/registry/types";
import SettingsElement from "./SettingsElement";
import styles from "./widgetsettingscomponent.module.css";
import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import EventHandler from "../../../utils/eventhandler";

const containsString = (string: string, component: Component) => {
	string = string.toLowerCase();

	if (component.contentSettings !== undefined) {
		if (component.headerSettings !== undefined) {
			if (component.headerSettings.name.toLowerCase().includes(string)) {
				return true;
			}
		}

		for (let i = 0; i < component.contentSettings.length; i++) {
			if (
				component.contentSettings[i].name.toLowerCase().includes(string)
			) {
				return true;
			}
		}
	}

	return false;
};

const WidgetSettingsComponent = (props: {}) => {
	const [searchbarValue, setSearchbarValue] = useState("");
	const [exportModalState, setExportModalState] = useState(false);
	const [importModalState, setImportModalState] = useState(false);
	const [jsonData, setJsonData] = useState({});

	useEffect(() => {
		if (exportModalState === true) {
			(async () => {
				setJsonData(await widgetsDb.toJson());
			})();
		}
	}, [exportModalState]);

	const importSettingsForm = useForm({
		initialValues: {
			json: "",
		},
		validate: {
			json: (value) => {
				try {
					JSON.parse(value);
				} catch (e) {
					return "Invalid JSON";
				}
				return null;
			},
		},
	});

	return (
		<React.Fragment>
			{/* Export Modal */}
			<Modal
				opened={exportModalState}
				onClose={() => setExportModalState(false)}
				title="Export Settings"
			>
				<Stack>
					<Text color="dimmed">
						The json data below is being stored in your IndexedDB.
						MyAnimeTab does not collect any data and sends it to any
						server, thus everything is saved on the client.
					</Text>
					<ReactJson
						src={jsonData}
						style={{
							border: "1px solid rgba(0,0,0,0.2)",
							borderRadius: "14px",
							padding: "10px",
							marginTop: "10px",
						}}
						name={false}
						collapsed={true}
						collapseStringsAfterLength={65}
						displayDataTypes={false}
						enableClipboard={false}
					/>
					<Group position="right">
						<Button
							color="green"
							onClick={() => {
								navigator.clipboard.writeText(
									JSON.stringify(jsonData)
								);

								showNotification({
									title: "Data copied to clipboard!",
								});
							}}
						>
							Copy
						</Button>
						<Button onClick={() => setExportModalState(false)}>
							Close
						</Button>
					</Group>
				</Stack>
			</Modal>

			{/* Import Modal */}
			<Modal
				opened={importModalState}
				onClose={() => setImportModalState(false)}
				title="Import Settings"
			>
				<form
					onSubmit={importSettingsForm.onSubmit(
						(
							values: { json: string },
							event: React.FormEvent<HTMLFormElement>
						) => {
							showNotification({
								color: "yellow",
								title: "Trying to load json data...",
							});

							setTimeout(() => {
								try {
									widgetsDb.fromJSON(JSON.parse(values.json));
								} catch (e) {
									console.error(e);

									showNotification({
										color: "red",
										title: "An error occured while loading data!",
										message:
											"For more details, take a look at the console. If you need any help, reach out to us at the support discord server!",
									});

									return;
								}

								showNotification({
									color: "green",
									title: "Successfully loaded json data!",
									message:
										"Page will be reloaded in a moment to update the existing data.",
								});

								setTimeout(
									() => window.location.reload(),
									3000
								);
							}, 1000);
						}
					)}
				>
					<Stack>
						<Text color="dimmed">
							It may not always be possible that you are able to
							import data as the structure differs from version to
							version. If you need any help, feel free to ask on
							the{" "}
							<a href="https://aridevelopment.de/dc">
								Support Discord Server
							</a>
						</Text>
						<Textarea
							placeholder="Enter valid json"
							label="Enter the settings data below"
							withAsterisk
							{...importSettingsForm.getInputProps("json", {
								type: "input",
							})}
						/>
						<Group position="right">
							<Button
								variant="outline"
								color="gray"
								onClick={() => setImportModalState(false)}
							>
								Close
							</Button>
							<Button type="submit">Submit</Button>
						</Group>
					</Stack>
				</form>
			</Modal>

			{/* Widget Settings */}
			<div className={styles.toolbar}>
				<input
					onInput={(e) => setSearchbarValue(e.target.value)}
					value={searchbarValue}
					type="text"
					spellCheck="false"
					placeholder="Enter Keywords"
					autoComplete="off"
				/>
				<Menu shadow="md" width={200}>
					<Menu.Target>
						<Button variant="outline" color="gray">
							+
						</Button>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Label>Widget Type</Menu.Label>
						{registry.knownComponents.map(
							(knownComponent: KnownComponent) => {
								if (
									knownComponent.metadata.installableComponent
								) {
									return (
										<Menu.Item
											onClick={() => {
												registry.installComponent(
													knownComponent
												);
												EventHandler.emit(
													"rerenderAll"
												);
											}}
										>
											{knownComponent.metadata.name}
										</Menu.Item>
									);
								}

								return null;
							}
						)}
					</Menu.Dropdown>
				</Menu>
			</div>
			{registry.installedComponents.map((component: Component) => {
				if (searchbarValue.trim() === "") {
					return (
						<SettingsElement
							data={component}
							key={component.fullId}
							searchValue={null}
						/>
					);
				}

				if (containsString(searchbarValue, component)) {
					return (
						<SettingsElement
							data={component}
							key={component.fullId}
							searchValue={searchbarValue}
						/>
					);
				}

				return null;
			})}
			<div className={styles.control_group}>
				<Button onClick={() => setImportModalState(true)} color="green">
					Import
				</Button>
				<Button onClick={() => setExportModalState(true)} color="blue">
					Export
				</Button>
			</div>
			<footer id={styles.footer}>
				<div className={styles.urls}>
					<a href="https://github.com/aridevelopment-de/myanimetab">
						<img src="/icons/github.svg" alt="GitHub" />
					</a>
					<a href="https://aridevelopment.de/">
						<img src="/icons/website.png" alt="Website" />
					</a>
					<a href="https://twitter.com/AriOnIce">
						<img src="/icons/twitter.svg" alt="Twitter" />
					</a>
					<a href="https://aridevelopment.de/discord">
						<img src="/icons/discord.svg" alt="Discord" />
					</a>
					<a href="mailto:ari.publicmail@gmail.com">
						<img src="/icons/email.svg" alt="Mail" />
					</a>
				</div>
				<p id={styles.copyright_infrigement}>
					MyAnimeTab © 2022 aridevelopment.de
				</p>
			</footer>
		</React.Fragment>
	);
};

export default WidgetSettingsComponent;
