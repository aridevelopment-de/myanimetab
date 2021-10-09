import React from "react";
import EventHandler from "../../utils/eventhandler";
import TimeUtils from "../../utils/timeutils";
import Settings from "../../utils/settings";
import './clock.css'

class Clock extends React.Component {
    constructor(props) {
        super(props);
        
        this.startInterval = this.startInterval.bind(this);
        this.onClockDisable = this.onClockDisable.bind(this);
        this.onBlurTrigger = this.onBlurTrigger.bind(this);

        this.state = {
            showing: props.showing,
            opacity: props.showing ? 1 : 0,
            currentTime: new Date(),
            intervalId: 0
        };
    }

    onBlurTrigger(data) {
        if (this.state.intervalId !== undefined) {
            this.setState({
                opacity: data.blur ? Settings.getUserSetting("clock.auto_hide") : 1
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
        if (!data.checked) {
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
        EventHandler.listenEvent("clock_state", "clock", this.onClockDisable);

        this.startInterval();
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);

        EventHandler.unlistenEvent("blurall", "clock");
        EventHandler.unlistenEvent("clock_state", "clock");
    }

    render() {
        let currentFmtDate = TimeUtils.convertTimeToClockFormat(this.state.currentTime);

        return (
            <div className={`clock__wrapper ${this.props.position} ${this.state.showing ? 'visible' : 'invisible'}`}
                 style={{opacity: this.state.opacity}}>
                <div className="clock">
                    <div className="time__wrapper">
                        <span id="time"> {currentFmtDate.time} </span>
                        <span id="time__period"> {currentFmtDate.timePeriod} </span>
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