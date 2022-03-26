const TimeUtils = {
    convertTimeToClockFormat: function(date, hour_12) {
        // en-US/de-DE
        let timeData = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: hour_12 }).split(" ");
        let dateData = date.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).split(", ");
        let splitted = timeData[0].split(":");
        let part1 = splitted[0];
        let part2 = splitted[1];

        if (part1.length === 1) {
            part1 = "0" + part1;
        }

        if (part2.length === 1) {
            part2 = "0" + part2;
        }

        return {
            time: part1 + ":" + part2,
            timePeriod: timeData[1],
            weekDay: dateData[0] + ", ",
            yearDate: dateData[1] + ", ",
            year: dateData[2]
        };
    },

    getSeconds(date) {
        return date.getTime() / 1000;
    }
};

export default TimeUtils;