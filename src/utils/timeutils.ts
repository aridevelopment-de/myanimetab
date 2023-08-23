const TimeUtils = {
    formatAMPM(date: Date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        
        return {
            hours,
            minutes,
            ampm
        };
    },
    convertTimeToClockFormat(date: Date, hour_12: boolean, timezone: string | undefined): any {
        // en-US/de-DE
        if (hour_12) {
            let { hours, minutes, ampm } = TimeUtils.formatAMPM(date);
            // @ts-ignore
            let hour24data = this.convertTimeToClockFormat(date, false);

            return {
                time: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
                timePeriod: ampm,
                weekDay: hour24data.weekDay,
                yearDate: hour24data.yearDate,
                year: hour24data.year
            }
        }

        if (timezone === "auto") {
            timezone = undefined;
        }

        let timeData = date.toLocaleString('en-US', { timeZone: timezone, hour: 'numeric', minute: 'numeric', hour12: hour_12 }).split(" ");
        let dateData = date.toLocaleString('en-US', { timeZone: timezone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).split(", ");
        let splitted = timeData[0].split(":");
        let part1 = splitted[0];
        let part2 = splitted[1];

        return {
            time: part1.padStart(2, "0") + ":" + part2.padStart(2, "0"),
            timePeriod: timeData[1],
            weekDay: dateData[0] + ", ",
            yearDate: dateData[1] + ", ",
            year: dateData[2]
        };
    },

    getSeconds(date: Date): number {
        return date.getTime() / 1000;
    }
};

export default TimeUtils;