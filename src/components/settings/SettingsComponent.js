import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import EventHandler from '../../utils/eventhandler';
import WidgetSettingsComponent from './widget_settings/WidgetSettingsComponent';
import PlaylistSettingsComponent from './playlist_settings/PlaylistSettingsComponent';
import WidgetInstallationComponent from './widget_installation/WidgetInstallationComponent';
import styles from './settingscomponent.module.css';


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
            <div className={`${styles.wrapper} ${this.state.opened ? '' : styles.closed}`}>
                <div 
                    className={`${styles.settings_menu} abs_fit`}
                    styles={{
                        transform: this.state.opened ? '' : 'translateX(0%)'
                    }}
                >
                    <div className={styles.settings_header}>
                        <div className={styles.icon__wrapper}>
                            <CloseIcon onClick={function() {EventHandler.triggerEvent("settings_window_state", {opened: false})} } />
                        </div>
                        <header className={styles.settings_labels}>
                            {
                                this.pages.map(e =>
                                        <p onClick={() => this.switchPage(e)} className={this.state.activePage === this.pages.indexOf(e) ? styles.active : ''} key={e}> {e} </p>
                                    )
                            }
                        </header>
                        <hr style={{opacity: 0.5}} />
                    </div>
                    <div className={styles.settings_body}>
                        <div className="abs_fit">
                            <div className={styles.scroller_viewport}>
                                <div className={styles.scroller}>
                                    <div className={styles.scroller_content}>
                                        <div className={styles.settings_list}>
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