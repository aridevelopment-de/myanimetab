import React from "react";
import EventHandler from "../../utils/eventhandler";
import "./controlbar.css";
import SettingsIcon from '@material-ui/icons/Settings';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class ControlBar extends React.Component {
    constructor(props) {
        super(props);

        this.collapse = this.collapse.bind(this);
        this.lockImage = this.lockImage.bind(this);

        this.state = {
            collapsed: false,
            locked: false
        };
    }

    collapse(e) {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    onBlurTrigger(data) {
        this.setState({
            collapsed: data.blur
        });
    }

    lockImage(e) {
        this.setState({
            locked: !this.state.locked
        });
    }

    componentDidMount() {
        EventHandler.listenEvent("blurall", "controlbar", this.onBlurTrigger.bind(this));
    }

    render() {
        return (
            <div className="control_menu__wrapper">
                <div className={`control_menu ${this.state.collapsed ? 'collapsed' : ''}`}>
                    <div className="settings__wrapper control_menu_item__wrapper">
                        <div className="settings" onClick={
                            EventHandler.triggerEvent("settings_window_state", {opened: true})
                        }>
                            <SettingsIcon />
                        </div>
                    </div>

                    <div className="next_image__wrapper control_menu_item__wrapper">
                        <div className="next_image" onClick={
                            EventHandler.triggerEvent("skip_image")
                        }>
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