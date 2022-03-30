import './App.css';
import React from 'react';
import CustomComponentRegistry from './utils/customcomponentregistry';
import Background from './BackgroundComponent';
import URLAddComponent from './components/url_add/URLAddComponent';
import FullSizeImage from './components/settings/playlist_settings/FullSizeImageComponent';
import SearchBar from './components/custom_components/search_bar/searchbar';
import Clock from './components/custom_components/clock/clock';
import ControlBar from "./components/custom_components/control_bar/controlbar";
import SettingsComponent from "./components/settings/SettingsComponent";
import EventHandler from './utils/eventhandler';
import ImportSettingsComponent from './components/import_export_settings/ImportSettingsComponent';
import ExportSettingsComponent from './components/import_export_settings/ExportSettingsComponent';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.registerComponents = this.registerComponents.bind(this);
    this.registerComponents();

    this.state = {
		  addUrlDialog: false,
    	fullSizeImage: null,
      importSettingsDialog: false,
      exportSettingsDialog: false
    };
  }

  registerComponents() {
    const components = [Clock, ControlBar, SearchBar];
	
    for (let idx in components) {
      let component = components[idx];
      component.prototype.register();
    }
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
  }

  componentWillUnmount() {
    EventHandler.unlistenEvent("url_add_window_state", "app");
    EventHandler.unlistenEvent("full_screen_image_window_state", "app");
    EventHandler.unlistenEvent("import_window_state", "app");
    EventHandler.unlistenEvent("export_window_state", "app");
  }

  render() {
    return (
      <div className="App">
        <Background>
          {Object.keys(CustomComponentRegistry.getAll()).map((key) => 
            CustomComponentRegistry.get(key).component
          )}
          
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
