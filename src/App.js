import React from 'react';
import CustomComponentRegistry from './utils/customcomponentregistry';
import Background from './BackgroundComponent';
import URLAddComponent from './components/modals/url_add/URLAddComponent';
import FullSizeImage from './components/settings/playlist_settings/FullSizeImageComponent';
import SettingsComponent from "./components/settings/SettingsComponent";
import EventHandler from './utils/eventhandler';
import ImportSettingsComponent from './components/modals/import_export/ImportSettingsComponent';
import ExportSettingsComponent from './components/modals/import_export/ExportSettingsComponent';
import getUserSettings from './utils/settings';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.registerComponents();

		this.state = {
			addUrlDialog: false,
			fullSizeImage: null,
			importSettingsDialog: false,
			exportSettingsDialog: false,
			activeComponents: []
		};
	}

	registerComponents() {
		/* Order is important here, because importing them means to initialize them with their id */
		const components = require("./widgets.json");

		components.forEach(data => {
			console.log("Loading widget: " + data.name);
			require(`./components/widgets/${data.entryPoint}`);
		});
	}

	componentDidMount() {
		EventHandler.listenEvent("url_add_window_state", "app", (data) => {
			this.setState({ addUrlDialog: data.opened });
		});

		EventHandler.listenEvent("full_screen_image_window_state", "app", (data) => {
			this.setState({ fullSizeImage: data.url });
		});

		EventHandler.listenEvent("import_window_state", "app", (data) => {
			this.setState({ importSettingsDialog: data.opened });
		});

		EventHandler.listenEvent("export_window_state", "app", (data) => {
			this.setState({ exportSettingsDialog: data.opened });
		});

		EventHandler.listenEvent("install_widget", "app", (data) => {
			getUserSettings().set(
				"installed_components",
				getUserSettings().get("installed_components").concat(data.id),
				false,
				() => {
					console.debug("Installed widget: " + data.id);
					this.forceUpdate()
				}
			);

		});

		EventHandler.listenEvent("uninstall_widget", "app", (data) => {
			getUserSettings().set(
				"installed_components",
				getUserSettings().get("installed_components").filter(id => id !== data.id),
				false,
				() => {
					console.debug("Uninstalled widget: " + data.id);
					this.forceUpdate();
				}
			);
		});
		
		this.setState({
			activeComponents: CustomComponentRegistry.getAllAvailable()
		})

		EventHandler.listenEvent("rerenderAll", "app", () => {
			// Reloading components
			this.setState({
				activeComponents: CustomComponentRegistry.getAllAvailable()
			})
		});
	}

	componentWillUnmount() {
		EventHandler.unlistenEvent("url_add_window_state", "app");
		EventHandler.unlistenEvent("full_screen_image_window_state", "app");
		EventHandler.unlistenEvent("import_window_state", "app");
		EventHandler.unlistenEvent("export_window_state", "app");
		EventHandler.unlistenEvent("install_widget", "app");
		EventHandler.unlistenEvent("uninstall_widget", "app");
		EventHandler.unlistenEvent("rerenderAll", "app");
	}

	render() {
		return (
			<div className="App">
				<Background>

					{this.state.activeComponents.map(id => {
						// only render if component is active
						const info = CustomComponentRegistry.get(id);
						const state = getUserSettings().get(`cc.${info.settings.id}.state`);

						if (state === true || state === undefined) {
							return CustomComponentRegistry.get(id).component;
						}

						return null;
					})}

					<SettingsComponent />
					{this.state.addUrlDialog ? <URLAddComponent /> : null}
					{this.state.fullSizeImage ? <FullSizeImage url={this.state.fullSizeImage} /> : null}
					{this.state.importSettingsDialog ? <ImportSettingsComponent /> : null}
					{this.state.exportSettingsDialog ? <ExportSettingsComponent /> : null}
				</Background>
			</div>
		);
	}
}

export default App;
