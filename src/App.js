import './App.css';
import React from 'react';
import CustomComponentRegistry from './utils/customcomponentregistry';
import Background from './BackgroundComponent';
import URLAddComponent from './components/url_add/URLAddComponent';
import FullSizeImage from './components/settings/playlist_settings/FullSizeImageComponent';
import SettingsComponent from "./components/settings/SettingsComponent";
import EventHandler from './utils/eventhandler';
import ImportSettingsComponent from './components/import_export_settings/ImportSettingsComponent';
import ExportSettingsComponent from './components/import_export_settings/ExportSettingsComponent';
import getUserSettings from './utils/settings';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.registerComponents();

    this.state = {
		  addUrlDialog: false,
    	fullSizeImage: null,
      importSettingsDialog: false,
      exportSettingsDialog: false
    };
  }

  registerComponents() {
    /* Order is important here, because importing them means to initialize them with their id */
    const components = ["clock/clock", "search_bar/searchbar", "control_bar/controlbar", "weather_widget/weatherwidget"];

    components.forEach(path => {
		require(`./components/custom_components/${path}`)
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
  }

  componentWillUnmount() {
    EventHandler.unlistenEvent("url_add_window_state", "app");
    EventHandler.unlistenEvent("full_screen_image_window_state", "app");
    EventHandler.unlistenEvent("import_window_state", "app");
    EventHandler.unlistenEvent("export_window_state", "app");
    EventHandler.unlistenEvent("install_widget", "app");
    EventHandler.unlistenEvent("uninstall_widget", "app");
  }

  render() {
    return (
      <div className="App">
			<Background>

			{CustomComponentRegistry.getAllAvailable().map(id => {
				return CustomComponentRegistry.get(id).component;
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
