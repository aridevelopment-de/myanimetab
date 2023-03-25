import { useState } from "react";
import Forecast from "./Forecast";
import styles from "./weatherwidget.module.css";

const temperatureValueValues = ["C", "K", "F"];

function NormalComponent(props: {
	data: { icon: string; temperature: number; fullCityName: string };
	unit: number;
	opacity: number;
	api_key: string;
}) {
	const [forecastOpen, setForecastOpen] = useState(false);

	return (
		<div
			className="weather_widget widget"
			style={{
				opacity: props.opacity,
				position: "relative",
			}}
		>
			<div className={styles.inner_wrapper} onClick={() => setForecastOpen(!forecastOpen)}>
				<div className={styles.status_icon}>
					<img src={props.data.icon} alt="weather icon" />
				</div>
				<div>
					<div className={styles.temperature}>
						<p>
							{props.data.temperature}°
							{temperatureValueValues[props.unit]}
						</p>
					</div>
					<div className={styles.city}>
						<p>{props.data.fullCityName}</p>
					</div>
				</div>
			</div>

			<Forecast
				open={forecastOpen}
				setOpen={setForecastOpen}
				city={props.data.fullCityName}
				unit={props.unit}
				api_key={props.api_key}
			/>
		</div>
	);
}

export default NormalComponent;
