import React, { useState } from "react";
import EventHandler from "../../../utils/eventhandler";
import CustomComponentRegistry from "../../../utils/customcomponentregistry";
import SettingsIcon from '@mui/icons-material/Settings';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from "./controlbar.module.css";
import Widget from "../Widget";

const positionValues = [styles.two, styles.one];

function ControlBar(props) {
    // eslint-disable-next-line no-unused-vars
    const [ position, _ ] = Widget.useSetting("cc.controlbar.position", "controlbar");
    const [ unlocked, setUnlocked ] = Widget.useSetting("cc.wallpaper.state", "controlbar");
    const [ collapsed, setCollapsed ] = useState(true);
    Widget.useEvent("blurrall", "controlbar", false, (data) => setCollapsed(data.value));

    return (
        <div 
            className={`${styles.control_menu} ${positionValues[position]}`}
            style={{
                transform: collapsed ? 'translateY(-80%)' : 'translateY(0)'
            }}>
            <div className={styles.item__wrapper}>
                <div onClick={ () => EventHandler.triggerEvent("settings_window_state", {opened: true}) }>
                    <SettingsIcon />
                </div>
            </div>

            <div className={styles.item__wrapper}>
                <div onClick={ () => {
                    EventHandler.triggerEvents(["skip_image", "playlist_refresh"]);
                    setUnlocked(true);
                }}>
                    <SkipNextIcon />
                </div>
            </div>

            <div className={styles.item__wrapper}>
                <div onClick={() => setUnlocked(!unlocked) }>
                    { unlocked ? <LockOpenIcon /> : <LockIcon /> }
                </div>
            </div>

            <div className={`${styles.expand_less__wrapper} ${styles.item__wrapper}`}>
                <div onClick={ () => setCollapsed(!collapsed) }>
                    { collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon /> }
                </div>
            </div>
        </div>
    )
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