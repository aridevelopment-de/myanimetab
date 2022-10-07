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
import "@fontsource/inter";
import { useState, useEffect } from "react";
import { useMoverState } from "./hooks/widgetmover";
import MoverControlbar from "./components/widgetmover/movercontrolbar/MoverControlbar";
import { SnapLineRenderer } from "./components/widgetmover/snaplinerenderer/SnapLineRenderer";

const App = (_) => {
	const [installedComponents, setInstalledComponents] = useState<Array<Component>>([]);
	const moverEnabled = useMoverState((state) => state.enabled);

	useEffect(() => {
		const filterEnabledComponents = () => {
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

				setInstalledComponents(enabledComponents)
			})();
		};

		registry.setupDefaultComponents().then(() => {
			registry.loadInstalledComponents(() => {
				filterEnabledComponents();
			});
		});

		EventHandler.on("rerenderAll", "app", () => {
			setTimeout(() => {
				registry.loadInstalledComponents(() =>
					filterEnabledComponents()
				);
			}, 50);
		});

		return () => {
			EventHandler.off("rerenderAll", "app");
		};
	}, []);

	return (
		<div className="App">
			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				withCSSVariables
				theme={{
					fontFamily: '"Inter", sans-serif',
					colorScheme: "light",
				}}
			>
				<NotificationsProvider>
					<ModalsProvider>
						{moverEnabled ? (
							<>
							<MoverControlbar />
							<SnapLineRenderer />
							</>
						) : (
							<SettingsComponent />
						)}
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
					</ModalsProvider>
				</NotificationsProvider>
			</MantineProvider>
		</div>
	);
};

export default App;
