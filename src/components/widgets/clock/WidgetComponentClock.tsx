import { useEffect, useState } from "react";
import { useWidget } from "../../../utils/eventhooks";
import { KnownComponent } from "../../../utils/registry/types";
import TimeUtils from "../../../utils/timeutils";
import styles from "./clock.module.css";

const positionValues = [styles.four, styles.three, styles.two, styles.one];
const opacityValues = [1, 0, 0.7, 0.5, 0.3];
const timeFormatValues = ["24h", "12h"]; // if these values changes,  also change the if conditions

function Clock(props: { blur: boolean; id: string }) {
	const widget = useWidget(props.id);
	const [currentTime, setCurrentTime] = useState(
		TimeUtils.convertTimeToClockFormat(new Date(), widget.timeFormat === 1)
	);

	useEffect(() => {
		const interval = setInterval(() => {
			let currentDate = new Date();
			let currentFmtDate = TimeUtils.convertTimeToClockFormat(
				currentDate,
				widget.timeFormat === 1
			);
			let lastFmtDate = currentTime;

			// Only update if old date and new date are not equal
			if (
				JSON.stringify(currentFmtDate) !== JSON.stringify(lastFmtDate)
			) {
				setCurrentTime(currentFmtDate);
			}
		}, 10000);

		return () => clearInterval(interval);
	}, [currentTime, widget.timeFormat]);

	if (widget.position === undefined) return <></>;

	return (
		<div className={`${styles.wrapper} ${positionValues[widget.position]}`}>
			<div
				className={`${styles.clock} widget`}
				style={{
					opacity: props.blur
						? opacityValues[widget.autoHideValue]
						: 1,
				}}
			>
				<div>
					<span
						id={
							widget.timeFormat === 0
								? styles.time_12hr
								: styles.time
						}
					>
						{" "}
						{currentTime.time}{" "}
					</span>
					{widget.timeFormat === 1 ? (
						<span id={styles.period}>{currentTime.timePeriod}</span>
					) : null}
				</div>
				<div>
					<span id={styles.weekday}>{currentTime.weekDay}</span>
					<span id={styles.yeardate}>{currentTime.yearDate}</span>
					<span id={styles.year}>{currentTime.year}</span>
				</div>
			</div>
		</div>
	);
}

export default {
	type: "clock",
	element: Clock as unknown as JSX.Element,
	metadata: {
		name: "Clock",
		author: "Aridevelopment.de",
		defaultComponent: true,
		removeableComponent: true,
		installableComponent: true,
	},
	headerSettings: {
		name: "Clock",
		type: "clock",
		option: {
			type: "toggle",
			default: true,
		},
	},
	contentSettings: [
		{
			name: "Time Zone",
			key: "time_zone",
			type: "dropdown",
			values: ["auto", 0, 1, 2, -1, -2],
			displayedValues: [
				"Auto",
				"UTC",
				"UTC+01",
				"UTC+02",
				"UTC-01",
				"UTC-02",
			],
		},
		{
			name: "Time Format",
			key: "time_format",
			type: "dropdown",
			values: timeFormatValues,
			displayedValues: ["24h", "12h"],
		},
		{
			name: "When Autohiding",
			key: "auto_hide",
			type: "dropdown",
			values: opacityValues,
			displayedValues: [
				"Show",
				"Hide",
				"Opacity 0.7",
				"Opacity 0.5",
				"Opacity 0.3",
			],
		},
		{
			name: "Positioning",
			key: "position",
			type: "dropdown",
			values: positionValues,
			displayedValues: [
				"Left lower corner",
				"Right lower corner",
				"Right upper corner",
				"Left upper corner",
			],
		},
	],
} as KnownComponent;
