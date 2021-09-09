import React from "react";
import EventHandler from "../../utils/eventhandler";
import TimeUtils from "../../utils/timeutils";
import Settings from "../../utils/settings";
import './clock.css'

class Clock extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            showing: props.showing,
            opacity: props.showing ? 1 : 0,
            currentTime: new Date()
        };
    }

    onBlurTrigger(data) {
        this.setState({
            opacity: data.blur ? Settings.getUserSetting("clock.auto_hide") : 1
        });
    }

    componentDidMount() {
        EventHandler.listenEvent("blurall", "clock", this.onBlurTrigger.bind(this));

        setInterval(() => {
            let currentDate = new Date();
            let currentFmtDate = TimeUtils.convertTimeToClockFormat(currentDate);
            let lastFmtDate = TimeUtils.convertTimeToClockFormat(this.state.currentTime);

            if (JSON.stringify(currentFmtDate) !== JSON.stringify(lastFmtDate)) {
                this.setState({
                    currentTime: currentDate
                });
            }
        }, 1000);
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