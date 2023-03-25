import axios from "axios";
import { useEffect, useState } from "react";
import { widgetsDb } from "../../../utils/db";
import { useWidget } from "../../../utils/eventhooks";
import { IDropdownOptions, IInputOptions, KnownComponent } from "../../../utils/registry/types";
import WidgetMoverWrapper from "../../widgetmover/wrapper/WidgetMoverWrapper";
import errorstyles from "./error.module.css";
import ErrorComponent from "./ErrorComponent";
import NormalComponent from "./NormalComponent";
import styles from "./weatherwidget.module.css";

const opacityValues = [1, 0, 0.7, 0.5, 0.3];
export const metricValues = ["metric", "standard", "imperial"];
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
	const widget = useWidget(props.id);
	const [data, setData] = useState({
		statusCode: -1,
		fullCityName: "Frankfurt am Main",
		temperature: 2,
		icon: "https://openweathermap.org/img/wn/02d@4x.png",
	});

	useEffect(() => {
		const retrieveData = async () => {
			if (widget.unit !== undefined) {
				const API_KEY = await widgetsDb.getSetting(props.id, "api_key");
				const CITY = await widgetsDb.getSetting(props.id, "city");
				const UNIT = metricValues[widget.unit];

				axios
					.get(
						`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=${UNIT}&lang=EN`,
						{ validateStatus: () => true }
					)
					.then((response) => {
						if (response.status === 200) {
							setData({
								fullCityName: response.data.name,
								temperature: Math.round(
									response.data.main.temp
								),
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
			}
		};

		retrieveData();
		const interval = setInterval(retrieveData, refreshRate);
		return () => clearInterval(interval);
	}, [widget, widget.unit]);

	return (
		<WidgetMoverWrapper id={props.id}>
			<div className={styles.wrapper}>
				{data.statusCode === 200 ? (
					<NormalComponent
						data={data}
						api_key={widget.api_key}
						unit={widget.unit}
						opacity={
							props.blur ? opacityValues[widget.auto_hide] : 1
						}
					/>
				) : data.statusCode !== -1 ? (
					<ErrorComponent
						status={data.statusCode}
						opacity={
							props.blur ? opacityValues[widget.auto_hide] : 1
						}
					/>
				) : (
					<LoadingComponent
						opacity={
							props.blur ? opacityValues[widget.auto_hide] : 1
						}
					/>
				)}
			</div>
		</WidgetMoverWrapper>
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
			default: true,
		},
	},
	contentSettings: [
		{
			name: "API Key",
			key: "api_key",
			type: "input",
			options: {
				tooltip: "An api key from openweathermap.org",
				hidden: true,
			} as IInputOptions,
		},
		{
			name: "Default City (refresh page)",
			key: "city",
			type: "input",
			options: {
				tooltip: "The default location (e.g. Frankfurt)",
				hidden: false,
			} as IInputOptions,
		},
		{
			name: "Temperature Unit",
			key: "unit",
			type: "dropdown",
			options: {
				values: metricValues,
				displayedValues: ["Celsius", "Kelvin", "Fahrenheit"],
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
