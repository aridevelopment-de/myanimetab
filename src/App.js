import './App.css';
import React from 'react';
import URLAddComponent from './components/url_add/URLAddComponent';
import FullSizeImage from './components/settings/playlist_settings/FullSizeImageComponent';
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
    this.startBackgroundInterval = this.startBackgroundInterval.bind(this);
    this.switchBackground = this.switchBackground.bind(this);

    this.state = {
      currentBackground: Settings.get("images")[Settings.get("selected_image")],
      lastAction: TimeUtils.getSeconds(new Date()),
      blur: false,
      searchbarFocus: false,
      blurIntervalId: undefined,
      backgroundIntervalId: undefined,
      addUrlDialog: false,
      fullSizeImage: null
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
      blurIntervalId: setInterval(() => {
        if (this.state.searchbarFocus === false && TimeUtils.getSeconds(new Date()) - Settings.getUserSetting("auto_hide.time_lapse") > this.state.lastAction) {
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

  startBackgroundInterval() {
    this.setState({
      backgroundIntervalId: setInterval(() => {
        if (Settings.getUserSetting("switch_wallpaper.playlist_order") === "Ordered") {
          this.setState({
            currentBackground: Settings.get("images")[this.switchBackground()]
          });
        }
      }, 1000*Settings.getUserSetting("switch_wallpaper.when_switch") || 1000)
    });
  }

  switchBackground() {
    if (Settings.getUserSetting("switch_wallpaper.playlist_order") === "Ordered") {
      let idx = Settings.get("selected_image");
      idx = (idx + 1) % Settings.get("images").length;
      Settings.set("selected_image", idx);
      
      return idx;
    } else if (Settings.getUserSetting("switch_wallpaper.playlist_order") === "Shuffled") {
      let idx = Math.floor(Math.random() * Settings.get("images").length);
      Settings.set("selected_image", idx);

      return idx;
    }
  }

  componentDidMount() {
    EventHandler.listenEvent("auto_hide_state", "app", (data) => {
      if (data.checked === false) {
        clearInterval(this.state.blurIntervalId);
      } else if (data.checked === true) {
        this.startBlurInterval();
      }
    });

    EventHandler.listenEvent("searchbar_inputstate", "app", (data) => {
      this.setState({
        searchbarFocus: data.focus,
        lastAction: TimeUtils.getSeconds(new Date())
      });
    });

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

    EventHandler.listenEvent("switch_wallpaper_state", "app", (data) => {
      if (data.checked === false) {
        clearInterval(this.state.backgroundIntervalId);
      } else if (data.checked === true) {
        if (Settings.getUserSetting("switch_wallpaper.when_switch") != null) {
          this.startBackgroundInterval();
        }
      }
    });

    EventHandler.listenEvent("dropdown_switch_wallpaper.when_switch_state", "app", (data) => {
      if (this.state.backgroundIntervalId != null) {
        clearInterval(this.state.backgroundIntervalId);
      }

      if (data.selected != null) {  
        this.startBackgroundInterval();
      }
    })

    EventHandler.listenEvent("skip_image", "app", () => {
      this.setState({
        currentBackground: Settings.get("images")[this.switchBackground()]
      });

      Settings.setUserSetting("switch_wallpaper", true);
      EventHandler.triggerEvent("switch_wallpaper_state", {checked: true});
      EventHandler.triggerEvent("switch_wallpaper_state_force", {checked: true});
    })

    if (Settings.getUserSetting("auto_hide") === true) {
      this.startBlurInterval();
    }

    if (Settings.getUserSetting("switch_wallpaper") === true) {
      if (Settings.getUserSetting("switch_wallpaper.when_switch") != null) {
        this.startBackgroundInterval();
      } else {
        this.setState({
          currentBackground: Settings.get("images")[this.switchBackground()]
        });
      }
    }
  }

  componentWillUnmount() {
    if (this.blurIntervalId !== undefined) {
      clearInterval(this.state.blurIntervalId);
    }

    if (this.backgroundIntervalId !== undefined) {
      clearInterval(this.state.backgroundIntervalId);
    }

    EventHandler.unlistenEvent("auto_hide_state", "app");
    EventHandler.unlistenEvent("searchbar_inputstate", "app");
    EventHandler.unlistenEvent("url_add_window", "app");
    EventHandler.unlistenEvent("full_screen_image", "app");
    EventHandler.unlistenEvent("switch_wallpaper_state", "app");
    EventHandler.unlistenEvent("skip_image", "app");
  }

  render() {
    return (
      <div className="App"
            style={{backgroundImage: `url(${this.state.currentBackground})`}}
            onMouseMove={this.resetLastAction}
            onMouseDown={this.resetLastAction}
            >
        
        <ControlBar position={Settings.getUserSetting("control_bar.position")} />
        <SearchBar position={Settings.getUserSetting("search_bar.vertical_align")} 
                   showing={Settings.getUserSetting("search_bar")}/>
        <Clock position={Settings.getUserSetting("clock.position")}
               showing={Settings.getUserSetting("clock")}
               timeFormat={Settings.getUserSetting("clock.time_format")}/>
        <SettingsComponent />
        
        {this.state.addUrlDialog ? <URLAddComponent /> : null}
        {this.state.fullSizeImage ? <FullSizeImage url={this.state.fullSizeImage} /> : null}
      </div>
    );
  }
}

export default App;
