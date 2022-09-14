// @ts-nocheck
import { Button, Menu, Stack } from "@mantine/core";
import React, { useState } from "react";
import EventHandler from "../../../utils/eventhandler";
import { registry } from "../../../utils/registry/customcomponentregistry";
import { Component, KnownComponent } from "../../../utils/registry/types";
import SettingsElement from "./SettingsElement";
import styles from "./widgetsettingscomponent.module.css";

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

const WidgetSettingsComponent = (props: { bodyRef: any }) => {
	const [searchbarValue, setSearchbarValue] = useState("");

	return (
		<React.Fragment>
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
							(knownComponent: KnownComponent, index: number) => {
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
											key={index}
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
			<Stack>
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
			</Stack>
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
