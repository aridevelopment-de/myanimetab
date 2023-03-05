import { useEffect, useState } from "react";
import { useWidget } from "../../../utils/eventhooks";
import {
	IDropdownOptions,
	KnownComponent,
} from "../../../utils/registry/types";
import TimeUtils from "../../../utils/timeutils";
import WidgetMoverWrapper from "../../widgetmover/wrapper/WidgetMoverWrapper";
import styles from "./clock.module.css";

const opacityValues = [1, 0, 0.7, 0.5, 0.3];
const timeFormatValues = ["24h", "12h"]; // if these values changes,  also change the if conditions

function Clock(props: { blur: boolean; id: string }) {
	const widget = useWidget(props.id);
	const [currentTime, setCurrentTime] = useState(
		TimeUtils.convertTimeToClockFormat(new Date(), widget.time_format === 1)
	);

	const updateClock = () => {
		let currentDate = new Date();
		let currentFmtDate = TimeUtils.convertTimeToClockFormat(
			currentDate,
			widget.time_format === 1
		);
		let lastFmtDate = currentTime;

		// Only update if old date and new date are not equal
		if (JSON.stringify(currentFmtDate) !== JSON.stringify(lastFmtDate)) {
			setCurrentTime(currentFmtDate);
		}
	};

	useEffect(() => {
		const interval = setInterval(updateClock, 10000);
		updateClock();
		return () => clearInterval(interval);
	}, [currentTime, widget.time_format]);

	return (
		<WidgetMoverWrapper id={props.id}>
			<div
				className={`${styles.clock} widget`}
				style={{
					opacity: props.blur ? opacityValues[widget.auto_hide] : 1,
				}}
			>
				<div>
					<span
						id={
							widget.time_format === 0
								? styles.time_12hr
								: styles.time
						}
					>
						{" "}
						{currentTime.time}{" "}
					</span>
					{widget.time_format === 1 ? (
						<span id={styles.period}>{currentTime.timePeriod}</span>
					) : null}
				</div>
				<div>
					<span id={styles.weekday}>{currentTime.weekDay}</span>
					<span id={styles.yeardate}>{currentTime.yearDate}</span>
					<span id={styles.year}>{currentTime.year}</span>
				</div>
			</div>
		</WidgetMoverWrapper>
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
			options: {
				values: ["auto", 0, 1, 2, -1, -2],
				displayedValues: [
					"Auto",
					"UTC",
					"UTC+01",
					"UTC+02",
					"UTC-01",
					"UTC-02",
				],
			} as IDropdownOptions,
		},
		{
			name: "Time Format",
			key: "time_format",
			type: "dropdown",
			options: {
				values: timeFormatValues,
				displayedValues: ["24h", "12h"],
			} as IDropdownOptions,
		},
		{
			name: "When Autohiding",
			key: "auto_hide",
			type: "dropdown",
			options: {
				values: opacityValues,
				displayedValues: [
					"Show",
					"Hide",
					"Opacity 0.7",
					"Opacity 0.5",
					"Opacity 0.3",
				],
			} as IDropdownOptions,
		},
	],
} as KnownComponent;
