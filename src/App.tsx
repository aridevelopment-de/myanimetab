// @ts-nocheck
import React from 'react';
import Background from './BackgroundComponent';
import SettingsComponent from './components/settings/SettingsComponent';
import EventHandler from './utils/eventhandler';
import { Component, registry } from './utils/registry/customcomponentregistry';

function App(props) {
	const [ installedComponents, setInstalledComponents ] = React.useState([]);

	React.useEffect(() => {
		registry.setupDefaultComponents().then(() => {
			registry.loadInstalledComponents(() => {
				setInstalledComponents(registry.installedComponents);
			});
		});
	}, []);

	EventHandler.on("rerenderAll", "app", () => {
		registry.loadInstalledComponents(() => setInstalledComponents(registry.installedComponents));
	})

	return (
		<div className="App">
			<Background>
				{installedComponents.map((component: Component) => {					
					if (component.element === null) {
						return null;
					}

					return <component.element id={component.fullId} key={component.fullId} />;
				})}

				<SettingsComponent />
			</Background>
		</div>
	);
}

export default App;
