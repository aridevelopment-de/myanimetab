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

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			installedComponents: [],
		};
	}

	componentDidMount(): void {
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

				this.setState({ installedComponents: enabledComponents });
				this.forceUpdate();
			})();
		};

		registry.setupDefaultComponents().then(() => {
			registry.loadInstalledComponents(() => {
				filterEnabledComponents(registry.installedComponents);
			});
		});

		EventHandler.on("rerenderAll", "app", () => {
			setTimeout(() => {
				registry.loadInstalledComponents(() =>
					filterEnabledComponents(registry.installedComponents)
				);
			}, 50);
		});
	}

	componentWillUnmount(): void {
		EventHandler.off("rerenderAll", "app");
	}

	render() {
		return (
			<div className="App">
				<MantineProvider
					withGlobalStyles
					withNormalizeCSS
					withCSSVariables
					theme={{
						fontFamily: "Roboto, sans-serif",
						colorScheme: "light",
					}}
				>
					<NotificationsProvider>
						<ModalsProvider>
							<Background>
								{(blur) => {
									return this.state.installedComponents.map(
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
}

export default App;
