// @ts-nocheck
import React from "react";
import Background from "./BackgroundComponent";
import SettingsComponent from "./components/settings/SettingsComponent";
import { widgetsDb } from "./utils/db";
import EventHandler from "./utils/eventhandler";
import { Component, registry } from "./utils/registry/customcomponentregistry";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";

function App(props) {
	const [installedComponents, setInstalledComponents] = React.useState([]);

	const filterEnabledComponents = (components: Array<Component>) => {
		(async () => {
			let enabledComponents = [];

			for (let component of registry.installedComponents) {
				const state = await widgetsDb.getSetting(
					component.fullId,
					"state"
				);

				if (state === undefined || state === true) {
					enabledComponents.push(component);
				}
			}

			setInstalledComponents(enabledComponents);
		})();
	};

	React.useEffect(() => {
		registry.setupDefaultComponents().then(() => {
			registry.loadInstalledComponents(() => {
				filterEnabledComponents(registry.installedComponents);
			});
		});
	}, []);

	EventHandler.on("rerenderAll", "app", () => {
		registry.loadInstalledComponents(() =>
			filterEnabledComponents(registry.installedComponents)
		);
	});

	return (
		<div className="App">
			<MantineProvider withGlobalStyles withNormalizeCSS>
				<NotificationsProvider>
					<ModalsProvider>
						<Background>
							{(blur) => {
								return installedComponents.map(
									(component: Component) => {
										if (component.element === null) {
											return null;
										}

										return (
											<component.element
												id={component.fullId}
												key={component.fullId}
												blur={blur}
											/>
										);
									}
								);
							}}
						</Background>
						<SettingsComponent />
					</ModalsProvider>
				</NotificationsProvider>
			</MantineProvider>
		</div>
	);
}

export default App;
