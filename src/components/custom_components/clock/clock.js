import React from "react";
import EventHandler from "../../../utils/eventhandler";
import TimeUtils from "../../../utils/timeutils";
import CustomComponentRegistry from "../../../utils/customcomponentregistry";
import getUserSettings from "../../../utils/settings";
import './clock.css'

const positionValues = ["four", "three", "two", "one"];
const opacityValues = [1, 0, 0.7, 0.5, 0.3];
const timeFormatValues = ["24h", "12h"];

class Clock extends React.Component {
    constructor(props) {
        super(props);
        
        this.startInterval = this.startInterval.bind(this);
        this.onClockDisable = this.onClockDisable.bind(this);
        this.onBlurTrigger = this.onBlurTrigger.bind(this);

        this.state = {
            showing: getUserSettings().get("cc.clock"),
            opacity: getUserSettings().get("cc.clock") ? 0 : 1,
            currentTime: new Date(),
            intervalId: 0,
            position: getUserSettings().get("cc.clock.position"),
            timeFormat: getUserSettings().get("cc.clock.time_format")
        };
    }

    register() {
        CustomComponentRegistry.register(
            "clock", 
            <Clock />, 
            {
              "name": "Clock",
              "id": "clock",
              "option": {
                  "type": "toggle",
                  "default": true
              },
              "content": [
                  {
                      "name": "Time zone",
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
    }

    onBlurTrigger(data) {
        if (this.state.intervalId !== undefined) {
            this.setState({
                opacity: data.blur ? getUserSettings().get("cc.clock.auto_hide") : (getUserSettings().get("cc.clock") ? 0 : 1)
            });
        }
    }

    startInterval() {
        this.setState({
            intervalId: setInterval(() => {
                let currentDate = new Date();
                let currentFmtDate = TimeUtils.convertTimeToClockFormat(currentDate);
                let lastFmtDate = TimeUtils.convertTimeToClockFormat(this.state.currentTime);

                if (JSON.stringify(currentFmtDate) !== JSON.stringify(lastFmtDate)) {
                    this.setState({
                        currentTime: currentDate
                    });
                }
            }, 1000)
        });
    }

    onClockDisable(data) {
        if (!data.value) {
            if (this.state.intervalId !== undefined) {
                clearInterval(this.state.intervalId);

                this.setState({
                    intervalId: undefined,
                    showing: false
                });
            }
        } else {
            this.setState({ showing: true });
            this.startInterval();
        }
    }

    componentDidMount() {
        EventHandler.listenEvent("blurall", "clock", this.onBlurTrigger);
        EventHandler.listenEvent("set.cc.clock", "clock", this.onClockDisable);
        EventHandler.listenEvent("set.cc.clock.position", "clock", (value) => {
            this.setState({
                position: value
            });
        });
        EventHandler.listenEvent("set.cc.clock.time_format", "clock", (data) => {
            this.setState({
                timeFormat: data.value
            });
        });

        this.startInterval();
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);

        EventHandler.unlistenEvent("blurall", "clock");
        EventHandler.unlistenEvent("clock_state", "clock");
        EventHandler.unlistenEvent("set.cc.clock.position", "clock");
        EventHandler.unlistenEvent("set.cc.clock.time_format", "clock");
    }

    render() {
        let currentFmtDate = TimeUtils.convertTimeToClockFormat(this.state.currentTime, timeFormatValues[this.state.timeFormat] === '12h');

        return (
            <div className={`clock__wrapper ${positionValues[this.state.position]} ${this.state.showing ? 'visible' : 'invisible'}`}
                 style={{opacity: opacityValues[this.state.opacity]}}>
                <div className="clock">
                    <div className="time__wrapper">
                        <span id={ `time${timeFormatValues[this.state.timeFormat] === '24h' ? '_full' : ''}` }> {currentFmtDate.time} </span>
                        { timeFormatValues[this.state.timeFormat] === '12h' ? <span id="time__period"> {currentFmtDate.timePeriod} </span> : <span />}
                    </div>
                    <div className="date__wrapper">
                        <span id="week-day"> {currentFmtDate.weekDay} </span>
                        <span id="year-date"> {currentFmtDate.yearDate} </span>
                        <span id="year"> {currentFmtDate.year} </span>
                    </div>
                </div>
            </div>
        )
    }
}

export default Clock;