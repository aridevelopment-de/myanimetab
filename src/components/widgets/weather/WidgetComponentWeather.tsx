import axios from "axios";
import { useEffect, useState } from "react";
import { widgetsDb } from "../../../utils/db";
import { useSetting } from "../../../utils/eventhooks";
import { KnownComponent } from "../../../utils/registry/types";
import errorstyles from "./error.module.css";
import ErrorComponent from "./ErrorComponent";
import NormalComponent from "./NormalComponent";
import styles from "./weatherwidget.module.css";

const positionValues = [styles.four, styles.three, styles.two, styles.one];
const opacityValues = [1, 0, 0.7, 0.5, 0.3];
const metricValues = ["metric", "standard", "imperial"];
const refreshRate = 15 * 60 * 1000;

function LoadingComponent(props: { opacity: number }) {
	return (
		<div
			className="weather_widget widget"
			style={{
				opacity: props.opacity,
			}}
		>
			<div className={errorstyles.container}>
				<p
					style={{
						fontSize: "2em",
						padding: "0",
						margin: "0.7em",
						color: "white",
					}}
				>
					Loading...
				</p>
			</div>
		</div>
	);
}

function WeatherWidget(props: { blur: boolean; id: string }) {
	const [position, _] = useSetting(props.id, "position");
	const [unit, _1] = useSetting(props.id, "unit");
	const [autoHideValue, _2] = useSetting(props.id, "auto_hide");
	const [data, setData] = useState({
		statusCode: -1,
		fullCityName: "Frankfurt am Main",
		temperature: 2,
		icon: "http://openweathermap.org/img/wn/02d@4x.png",
	});

	useEffect(() => {
		const retrieveData = async () => {
			const API_KEY = await widgetsDb.getSetting(props.id, "api_key");
			const CITY = await widgetsDb.getSetting(props.id, "city");
			const UNIT = metricValues[unit];

			axios
				.get(
					`http://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=${UNIT}&lang=EN`
				)
				.then((response) => {
					if (response.status === 200) {
						setData({
							fullCityName: response.data.name,
							temperature: Math.round(response.data.main.temp),
							icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@4x.png`,
							statusCode: 200,
						});
					} else if (
						response.status === 404 ||
						response.status === 401 ||
						response.status === 429 // too many requests
					) {
						setData({
							...data,
							statusCode: response.status,
						});
					}
				})
				.catch((error) => {
					console.error(error);
				});
		};

		retrieveData();
		const interval = setInterval(retrieveData, refreshRate);
		return () => clearInterval(interval);
	}, [unit]);

	if (position === undefined) return <></>;

	return (
		<div className={`${styles.wrapper} ${positionValues[position]}`}>
			{data.statusCode === 200 ? (
				<NormalComponent
					data={data}
					unit={unit}
					opacity={props.blur ? opacityValues[autoHideValue] : 1}
				/>
			) : data.statusCode !== -1 ? (
				<ErrorComponent
					status={data.statusCode}
					opacity={props.blur ? opacityValues[autoHideValue] : 1}
				/>
			) : (
				<LoadingComponent
					opacity={props.blur ? opacityValues[autoHideValue] : 1}
				/>
			)}
		</div>
	);
}

export default {
	type: "weather",
	element: WeatherWidget as unknown as JSX.Element,
	metadata: {
		name: "Weather",
		author: "Aridevelopment.de",
		defaultComponent: true,
		removeableComponent: true,
		installableComponent: true,
	},
	headerSettings: {
		name: "Weather",
		type: "weather",
		option: {
			type: "toggle",
			default: false,
		},
	},
	contentSettings: [
		{
			name: "API Key",
			key: "api_key",
			type: "input",
			tooltip: "An api key from openweathermap.org",
			hidden: true,
		},
		{
			name: "Default City (refresh page)",
			key: "city",
			type: "input",
			tooltip: "The default location (e.g. Frankfurt)",
			hidden: false,
		},
		{
			name: "Temperature Unit",
			key: "unit",
			type: "dropdown",
			values: metricValues,
			displayedValues: ["Celsius", "Kelvin", "Fahrenheit"],
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
