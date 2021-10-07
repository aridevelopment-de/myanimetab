import './App.css';
import React from 'react';
import SearchBar from './components/search_bar/searchbar';
import Clock from './components/clock/clock';
import ControlBar from "./components/control_bar/controlbar";
import SettingsComponent from "./components/settings/SettingsComponent";
import Settings from './utils/settings';
import TimeUtils from './utils/timeutils';
import EventHandler from './utils/eventhandler';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.resetLastAction = this.resetLastAction.bind(this);
    this.startBlurInterval = this.startBlurInterval.bind(this);

    this.state = {
      currentBackground: 'https://best-extension.extfans.com/theme/wallpapers/pmafipeoccakjnacdojijhgmelhjbk/df23e73165204f223d080cbd0b4bc4.webp',
      lastAction: TimeUtils.getSeconds(new Date()),
      blur: false,
      intervalId: undefined
    };
  }

  resetLastAction(e) {    
    if (this.state.blur) {
      EventHandler.triggerEvent("blurall", { blur: false });
      this.setState({ blur: false });
    }

    this.setState({
      lastAction: TimeUtils.getSeconds(new Date())
    });
  }

  startBlurInterval() {
    this.setState({
      intervalId: setInterval(() => {
        if (TimeUtils.getSeconds(new Date()) - Settings.getUserSetting("auto_hide.time_lapse") > this.state.lastAction) {
          EventHandler.triggerEvent("blurall", { blur: true });
          this.setState({ blur: true });
        } else {
          if (this.state.blur) {
            EventHandler.triggerEvent("blurall", { blur: false });
            this.setState({ blur: false });
          }
        }
      }, 1000)
    });
  }

  componentDidMount() {
    // EventHandler.listenEvent()
    this.startBlurInterval();
  }

  componentWillUnmount() {
    if (this.intervalId !== undefined) {
      clearInterval(this.state.intervalId);
    }
  }

  render() {
    return (
      <div className="App"
            style={{backgroundImage: `url(${this.state.currentBackground})`}}
            onMouseMove={this.resetLastAction}
            onMouseDown={this.resetLastAction}
            >
        
        <ControlBar />
        <SearchBar position={Settings.getUserSetting("search_bar.vertical_align")} 
                   showing={Settings.getUserSetting("search_bar")}/>
        <Clock position={Settings.getUserSetting("clock.position")}
               showing={Settings.getUserSetting("clock")}/>
        <SettingsComponent />
      </div>
    );
  }
}

export default App;
