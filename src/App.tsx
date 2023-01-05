// @ts-nocheck
import Background from "./BackgroundComponent";
import SettingsComponent from "./components/settings/SettingsComponent";
import { actUponInitialLayout, metaDb, widgetsDb } from "./utils/db";
import EventHandler, { EventType } from "./utils/eventhandler";
import { Component, registry } from "./utils/registry/customcomponentregistry";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import "@fontsource/inter";
import { useState, useEffect } from "react";
import { useMoverState } from "./hooks/widgetmover";
import MoverControlbar from "./components/widgetmover/movercontrolbar/MoverControlbar";
import { SnapLineRenderer } from "./components/widgetmover/snaplinerenderer/SnapLineRenderer";
import WelcomeScreen from "./components/justInstalled/WelcomeScreen";

const App = (_) => {
	const [installedComponents, setInstalledComponents] = useState<Array<Component>>([]);
	const [justInstalled, setJustInstalled] = useState<boolean>(false);
	const moverEnabled = useMoverState((state) => state.enabled);

	useEffect(() => {
		metaDb.justInstalled().then((justInstalled) => {
			setJustInstalled(justInstalled);
		});

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

		EventHandler.on(EventType.RERENDER_ALL, "app", () => {
			setTimeout(() => {
				registry.loadInstalledComponents(() =>
					filterEnabledComponents()
				);
			}, 50);
		});

		EventHandler.on(EventType.INITIAL_LAYOUT_SELECT, "app", (url: string | null) => {
			setJustInstalled(false);

			if (url !== null) {
				actUponInitialLayout(url);

				EventHandler.emit(EventType.REFRESH_SNAPLINES);
			}
		});

		return () => {
			EventHandler.off("rerenderAll", "app");
			EventHandler.off(EventType.INITIAL_LAYOUT_SELECT, "app");
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
						{justInstalled && <WelcomeScreen />}
						{moverEnabled ? (
							<>
							<MoverControlbar />
							<SnapLineRenderer />
							</>
						) : (
							<SettingsComponent />
						)}
						<Background moverEnabled={moverEnabled}>
							{(blur) => {
								if (justInstalled) return null;

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
