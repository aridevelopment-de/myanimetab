import React, { useState, useEffect } from "react";
import TimeUtils from "../../../utils/timeutils";
import CustomComponentRegistry from "../../../utils/customcomponentregistry";
import getUserSettings from "../../../utils/settings";
import styles from './clock.module.css'
import Widget from '../Widget';

const positionValues = [styles.four, styles.three, styles.two, styles.one];
const opacityValues = [1, 0, 0.7, 0.5, 0.3];
const timeFormatValues = ["24h", "12h"];  // if these values changes,  also change the if conditions

function Clock(props) {
    const [ position, _ ] = Widget.useSetting("cc.clock.position", "clock");
    const [ timeFormat, _1 ] = Widget.useSetting("cc.clock.time_format", "clock");
    const [ opacity, setOpacity ] = useState(0);
    const [ currentTime, setCurrentTime ] = useState(TimeUtils.convertTimeToClockFormat(new Date(), timeFormat === 1));

    Widget.useEvent("blurall", "clock", 1, (data) => setOpacity(data.blur ? getUserSettings().get("cc.clock.auto_hide") : 0));
    useEffect(() => {
        const interval = setInterval(() => {
            let currentDate = new Date();
            let currentFmtDate = TimeUtils.convertTimeToClockFormat(currentDate, timeFormat === 1);
            let lastFmtDate = currentTime;

            // Only update if old date and new date are not equal
            if (JSON.stringify(currentFmtDate) !== JSON.stringify(lastFmtDate)) {
                setCurrentTime(currentFmtDate);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [currentTime, timeFormat]);

    return (
        <div 
            className={`${styles.wrapper} ${positionValues[position]}`}
            style={{ opacity: opacityValues[opacity] }}>
            <div className={`${styles.clock} widget`}>
                <div>
                    <span id={timeFormat === 0 ? styles.time_12hr : styles.time}> {currentTime.time} </span>
                    { timeFormat === 1 ? <span id={styles.period}>{currentTime.timePeriod}</span> : null}
                </div>
                <div>
                    <span id={styles.weekday}>{currentTime.weekDay}</span>
                    <span id={styles.yeardate}>{currentTime.yearDate}</span>
                    <span id={styles.year}>{currentTime.year}</span>
                </div>
            </div>
        </div>
    )
}

CustomComponentRegistry.register(
    "clock", 
    <Clock />,
    {
        shouldRegister: true,
        author: "aridevelopment.de", 
        description: "A simple clock displaying the current time"
    },
    {
        "name": "Clock",
        "id": "clock",
        "option": {
            "type": "toggle",
            "default": true
        },
        "content": [
            {
                "name": "Time Zone",
                "id": "time_zone",
                "type": "dropdown",
                "values": ["auto", 0, 1, 2, -1, -2],
                "displayedValues": ["Auto", "UTC", "UTC+01", "UTC+02", "UTC-01", "UTC-02"]
            },
            {
                "name": "Time Format",
                "id": "time_format",
                "type": "dropdown",
                "values": timeFormatValues,
                "displayedValues": ["24h", "12h"]
            },
            {
                "name": "When Autohiding",
                "id": "auto_hide",
                "type": "dropdown",
                "values": opacityValues,
                "displayedValues": ["Show", "Hide", "Opacity 0.7", "Opacity 0.5", "Opacity 0.3"]
            },
            {
                "name": "Positioning",
                "id": "position",
                "type": "dropdown",
                "values": positionValues,
                "displayedValues": ["Left lower corner", "Right lower corner", "Right upper corner", "Left upper corner"]
            }
        ]
    }
);

export default Clock;