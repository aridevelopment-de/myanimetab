import { useCallback, useEffect, useState } from "react";
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
const alignmentValues: string[] = [styles.left, styles.center, styles.right];
const supportedTimezones: string[] = ["auto", ...Intl.supportedValuesOf('timeZone')];

function Clock(props: { blur: boolean; id: string }) {
	const widget = useWidget(props.id);
	const [currentTime, setCurrentTime] = useState(
		TimeUtils.convertTimeToClockFormat(new Date(), widget.time_format === 1, supportedTimezones[widget.time_zone])
	);

	const updateClock = useCallback(() => {
		let currentDate = new Date();
		let currentFmtDate = TimeUtils.convertTimeToClockFormat(
			currentDate,
			widget.time_format === 1,
			supportedTimezones[widget.time_zone]
		);

		// Only update if old date and new date are not equal
		if (JSON.stringify(currentFmtDate) !== JSON.stringify(currentTime)) {
			setCurrentTime(currentFmtDate);
		}
	}, [widget.time_format, widget.time_zone, currentTime]);

	useEffect(() => {
		const interval = setInterval(updateClock, 10000);
		updateClock();
		return () => clearInterval(interval);
	}, [currentTime, widget.time_format, widget.time_zone, updateClock]);

	return (
		<WidgetMoverWrapper id={props.id}>
			<div
				className={`${styles.clock} widget ${alignmentValues[widget.align]}`}
				style={{
					opacity: props.blur ? opacityValues[widget.auto_hide] : 1,
				}}
			>
				{(widget.features === 0 || widget.features === 2) && (
					<div className={styles.time__container}>
						<span id={styles.time}>
							{" "}
							{currentTime.time}{" "}
						</span>
						{widget.time_format === 1 ? (
							<span id={styles.period}>{currentTime.timePeriod}</span>
						) : null}
					</div>
				)}
				{(widget.features === 0 || widget.features === 1) && (
					<div className={styles.date__container}>
						<span id={styles.weekday}>{currentTime.weekDay}</span>
						<span id={styles.yeardate}>{currentTime.yearDate}</span>
						<span id={styles.year}>{currentTime.year}</span>
					</div>
				)}
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
			name: "Features",
			key: "features",
			type: "dropdown",
			options: {
				values: ["date+time", "date", "time"],
				displayedValues: [
					"Date and Time",
					"Only Date",
					"Only Time"
				]
			}
		},
		{
			name: "Time Zone",
			key: "time_zone",
			type: "dropdown",
			options: {
				values: supportedTimezones,
				displayedValues: supportedTimezones
			} as IDropdownOptions,
		},
		{
			name: "Alignment",
			key: "align",
			type: "dropdown",
			options: {
				values: alignmentValues,
				displayedValues: [
					"Left",
					"Center",
					"Right"
				]
			}
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
