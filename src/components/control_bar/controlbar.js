import React from "react";
import EventHandler from "../../utils/eventhandler";
import "./controlbar.css";
import SettingsIcon from '@mui/icons-material/Settings';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Settings from "../../utils/settings";

class ControlBar extends React.Component {
    constructor(props) {
        super(props);

        this.collapse = this.collapse.bind(this);
        this.lockImage = this.lockImage.bind(this);

        this.state = {
            collapsed: false,
            locked: !Settings.getUserSetting("switch_wallpaper")
        };
    }

    collapse(e) {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    onBlurTrigger(data) {
        this.setState({
            collapsed: true
        });
    }

    lockImage(e) {
        this.setState({
            locked: !this.state.locked
        }, () => {
            Settings.setUserSetting("switch_wallpaper", !this.state.locked);
            EventHandler.triggerEvent("switch_wallpaper_state", {checked: !this.state.locked});
            EventHandler.triggerEvent("switch_wallpaper_state_force", {checked: !this.state.locked});
        });
    }

    componentDidMount() {
        EventHandler.listenEvent("blurall", "controlbar", this.onBlurTrigger.bind(this));
        EventHandler.listenEvent("switch_wallpaper_state", "controlbar", (data) => {
            this.setState({
                locked: !data.checked
            });
        });
    }

    componentWillUnmount() {
        EventHandler.unlistenEvent("blurall", "controlbar");
        EventHandler.unlistenEvent("switch_wallpaper_state", "controlbar");
    }

    render() {
        return (
            <div className={`control_menu__wrapper ${this.props.position}`}>
                <div className={`control_menu ${this.state.collapsed ? 'collapsed' : ''}`}>
                    <div className="settings__wrapper control_menu_item__wrapper">
                        <div className="settings" onClick={ function() {
                            EventHandler.triggerEvent("settings_window_state", {opened: true})
                        }}>
                            <SettingsIcon />
                        </div>
                    </div>

                    <div className="next_image__wrapper control_menu_item__wrapper">
                        <div className="next_image" onClick={ function() {
                            EventHandler.triggerEvent("skip_image")
                            EventHandler.triggerEvent("playlist_refresh");
                        }}>
                            <SkipNextIcon />
                        </div>
                    </div>

                    <div className="lock_image__wrapper control_menu_item__wrapper">
                        <div className="lock_image" onClick={this.lockImage}>
                            { this.state.locked ? <LockIcon /> : <LockOpenIcon /> }
                        </div>
                    </div>

                    <div className="expand_less__wrapper control_menu_item__wrapper">
                        <div className="expand_less" onClick={this.collapse}>
                            { this.state.collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon /> }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ControlBar;