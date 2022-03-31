import React from "react";
import EventHandler from "../../../utils/eventhandler";
import CustomComponentRegistry from "../../../utils/customcomponentregistry";
import "./controlbar.css";
import SettingsIcon from '@mui/icons-material/Settings';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import getUserSettings from "../../../utils/settings";


const positionValues = ["two", "one"];

class ControlBar extends React.Component {
    constructor(props) {
        super(props);

        this.collapse = this.collapse.bind(this);
        this.lockImage = this.lockImage.bind(this);

        this.state = {
            collapsed: false,
            position: getUserSettings().get("cc.controlbar.position"),
            locked: !getUserSettings().get("cc.wallpaper.state")
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
        let lockedState = this.state.locked;

        this.setState({
            locked: !lockedState
        }, () => {
            getUserSettings().set("cc.wallpaper.state", !this.state.locked, true);
            EventHandler.triggerEvent("set.cc.wallpaper", {value: !this.state.locked, sender: "controlbar"});
        });
    }

    componentDidMount() {
        EventHandler.listenEvent("blurall", "controlbar", this.onBlurTrigger.bind(this));
        EventHandler.listenEvent("set.cc.wallpaper", "controlbar", (data) => {
            if (data.sender !== "controlbar") {
                this.setState({
                    locked: !data.value
                });
            }
        });
        EventHandler.listenEvent("set.cc.controlbar.position", "controlbar", (data) => {
            this.setState({
                position: data.value
            });
        });
    }

    componentWillUnmount() {
        EventHandler.unlistenEvent("blurall", "controlbar");
        EventHandler.unlistenEvent("switch_wallpaper_state", "controlbar");
        EventHandler.unlistenEvent("set.cc.controlbar.position", "controlbar");
    }

    render() {
        return (
            <div className={`control_menu__wrapper ${positionValues[this.state.position]}`}>
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
                            getUserSettings().set("cc.wallpaper.state", true);
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

CustomComponentRegistry.register(
    "controlbar", 
    <ControlBar />,
    {
        shouldRegister: false
    },
    {
        "name": "Control Bar",
        "id": "controlbar",
        "option": {
            "type": null
        },
        "content": [
            {
                "name": "Positioning",
                "id": "position",
                "type": "dropdown",
                "values": positionValues,
                "displayedValues": ["Right upper corner", "Left upper corner"]
            }
        ]
    }
);

export default ControlBar;