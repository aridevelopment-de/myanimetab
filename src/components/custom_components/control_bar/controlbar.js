import React from "react";
import EventHandler from "../../../utils/eventhandler";
import CustomComponentRegistry from "../../../utils/customcomponentregistry";
import SettingsIcon from '@mui/icons-material/Settings';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import getUserSettings from "../../../utils/settings";
import styles from "./controlbar.module.css";


const positionValues = [styles.two, styles.one];

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
            EventHandler.triggerEvent("set.cc.wallpaper.state", {value: !this.state.locked, sender: "controlbar"});
        });
    }

    componentDidMount() {
        EventHandler.listenEvent("blurall", "controlbar", this.onBlurTrigger.bind(this));
        EventHandler.listenEvent("set.cc.wallpaper.state", "controlbar", (data) => {
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
            <div 
                className={`${styles.control_menu} ${positionValues[this.state.position]}`}
                style={{
                    transform: this.state.collapsed ? 'translateY(-80%)' : 'translateY(0)'
                }}
            >
                <div className={styles.item__wrapper}>
                    <div onClick={ function() {
                        EventHandler.triggerEvent("settings_window_state", {opened: true})
                    }}>
                        <SettingsIcon />
                    </div>
                </div>

                <div className={styles.item__wrapper}>
                    <div onClick={ function() {
                        EventHandler.triggerEvent("skip_image")
                        EventHandler.triggerEvent("playlist_refresh");
                        getUserSettings().set("cc.wallpaper.state", true);
                    }}>
                        <SkipNextIcon />
                    </div>
                </div>

                <div className={styles.item__wrapper}>
                    <div onClick={this.lockImage}>
                        { this.state.locked ? <LockIcon /> : <LockOpenIcon /> }
                    </div>
                </div>

                <div className={[styles.expand_less__wrapper, styles.item__wrapper]}>
                    <div onClick={this.collapse}>
                        { this.state.collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon /> }
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