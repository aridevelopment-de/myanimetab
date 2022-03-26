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

class App extends React.Component {
  constructor(props) {
    super(props);

    this.registerComponents = this.registerComponents.bind(this);
    this.registerComponents();

    this.state = {
		  addUrlDialog: false,
    	fullSizeImage: null
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
    EventHandler.listenEvent("url_add_window", "app", (data) => {
      this.setState({
        addUrlDialog: data.open
      });
    });

    EventHandler.listenEvent("full_screen_image", "app", (data) => {
      	this.setState({
        	fullSizeImage: data.url
      	});
    })
  }

  componentWillUnmount() {
    EventHandler.unlistenEvent("url_add_window", "app");
    EventHandler.unlistenEvent("full_screen_image", "app");
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
        </Background>
      </div>
    );
  }
}

export default App;
