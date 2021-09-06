
const TimeUtils = {
    convertTimeToClockFormat: function(date) {
        let timeData = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).split(" ");
        let dateData = date.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).split(", ");

        return {
            time: timeData[0],
            timePeriod: timeData[1],
            weekDay: dateData[0] + ", ",
            yearDate: dateData[1] + ", ",
            year: dateData[2]
        };
    }
};

export default TimeUtils;