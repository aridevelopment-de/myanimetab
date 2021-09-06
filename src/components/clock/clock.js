import React from "react";
import TimeUtils from "../../utils/timeutils";
import './clock.css'

class Clock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showing: true,
            currentTime: new Date()
        };
    }

    componentDidMount() {
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
            <div className={`clock__wrapper ${this.props.position} ${this.state.showing ? 'visible' : 'invisible'}`}>
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