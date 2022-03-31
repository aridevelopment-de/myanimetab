import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import './settingscomponent.css';
import EventHandler from '../../utils/eventhandler';
import WidgetSettingsComponent from './widget_settings/WidgetSettingsComponent';
import PlaylistSettingsComponent from './playlist_settings/PlaylistSettingsComponent';
import WidgetInstallationComponent from './widget_installation/WidgetInstallationComponent';


class SettingsComponent extends React.Component {
    constructor(props) {
        super(props);

        this.switchPage = this.switchPage.bind(this);

        this.pages = [
            "Settings",
            "Playlists",
            "Widgets"
        ];

        this.pageComponents = {
            "Settings": <WidgetSettingsComponent />,
            "Playlists": <PlaylistSettingsComponent />,
            "Widgets": <WidgetInstallationComponent />
        };

        this.state = {
            opened: false,
            activePage: 0
        };
    }

    settingsWindowStateChange(data) {
        this.setState({
            opened: data.opened
        });
    }

    switchPage(label) {        
        this.setState({
            activePage: this.pages.indexOf(label)
        });
    }

    componentDidMount() {
        EventHandler.listenEvent("settings_window_state", "settings_component", this.settingsWindowStateChange.bind(this));
    }

    componentWillUnmount() {
        EventHandler.listenEvent("settings_window_state", "settings_component");
    }

    render() {
        return (
            <div className={`settings_menu__wrapper ${this.state.opened ? '' : 'closed'}`}>
                <div className={`settings_menu abs_fit ${this.state.opened ? '' : 'closed'}`}>
                    <div className="settings_header">
                        <div className="settings_menu__close_icon__wrapper">
                            <CloseIcon onClick={function() {EventHandler.triggerEvent("settings_window_state", {opened: false})} } />
                        </div>
                        <header className="settings_labels">
                            {
                                this.pages.map(e =>
                                        <p onClick={() => this.switchPage(e)} className={this.state.activePage === this.pages.indexOf(e) ? 'active' : ''} key={e}> {e} </p>
                                    )
                            }
                            
                        </header>
                        <hr id="settings_labels_hr" />
                    </div>
                    <div className="settings_body">
                        <div className="abs_fit">
                            <div className="settings__scroller_viewport">
                                <div className="settings__scroller">
                                    <div className="settings__scroller_content">
                                        <div className="settings_list">
                                            {this.pageComponents[this.pages[this.state.activePage]]} 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SettingsComponent;