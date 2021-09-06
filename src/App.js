import './App.css';
import React from 'react';
import SearchBar from './components/search_bar/searchbar';
import Clock from './components/clock/clock';
import Settings from './utils/settings';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentBackground: 'https://best-extension.extfans.com/theme/wallpapers/pmafipeoccakjnacdojijhgmelhjbk/df23e73165204f223d080cbd0b4bc4.webp'
    };
  }

  render() {
    return (
      <div className="App"
            style={{backgroundImage: `url(${this.state.currentBackground})`}}>
        <SearchBar position={Settings.getUserSetting("search_bar.vertical_align")} />
        <Clock position={Settings.getUserSetting("clock.position")}/>
      </div>
    );
  }
}

export default App;
