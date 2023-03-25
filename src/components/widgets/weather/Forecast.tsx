import { useClickOutside } from "@mantine/hooks";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./forecast.module.css";
import { metricValues } from "./WidgetComponentWeather";


const PERCENTAGE_OFFSET = 10;

const ColorUtils = {
  getGreen: function() {
    return {
        at: 0,
        color: "#0ce87c"
    }
  },
  getYellow: function() {
      return {
          at: 35 + PERCENTAGE_OFFSET,
          color: "#ffd852"
      }
  },
  getRed: function() {
      return {
          at: 70 + PERCENTAGE_OFFSET,
          color: "#FA1670"
      }
  },
}

const GEOLOCATION_URL =
	"https://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={api}";
const FORECAST_URL =
	"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api}&units={unit}&lang=EN";
const REQUEST_DELAY = 1000 * 60 * 5;

interface ForecastData {
	days: Array<{
		dt: number;
		weekday: string;
		min: number;
		max: number;
		icon: string;
	}>;
	hours: Array<{
		dt: number;
		hour: string;
		temperature: number;
	}>;
}

const Forecast = (props: {
	open: boolean;
	setOpen: Function;
	city: string;
	api_key: string;
	unit: number;
}) => {
	const [lanLon, setLanLon] = useState<
		{ lan: number; lon: number } | undefined
	>(undefined);
	const [forecastData, setForecastData] = useState<ForecastData | undefined>(
		undefined
	);
	const [error, setError] = useState<string | undefined>(undefined);
  const [pos, setPos] = useState<{top: string | undefined, left: string | undefined, bottom: string | undefined, right: string | undefined}>({top: undefined, left: undefined, bottom: "100%", right: "0%"});
  const [lastRequest, setLastRequest] = useState<number>(Date.now() - REQUEST_DELAY);
  const ref = useClickOutside(() => props.setOpen(false));

	useEffect(() => {
		(async () => {
			if (props.open) {
        if (Date.now() - lastRequest < REQUEST_DELAY) {
          return;
        }

        setLastRequest(Date.now());

				// fetch lat, lon
				const geolocation_data = await axios.get(
					GEOLOCATION_URL.replace("{city}", props.city).replace(
						"{api}",
						props.api_key
					),
					{ validateStatus: () => true }
				);

				if (geolocation_data.status !== 200) {
					setError(
						`Error fetching geolocation data: ${geolocation_data.status}`
					);
					return;
				}

				const lan = geolocation_data.data[0].lat;
				const lon = geolocation_data.data[0].lon;
				setLanLon({ lan, lon });

				// fetch weather data
				const forecast_data = await axios.get(
					FORECAST_URL.replace("{lat}", lan.toString())
						.replace("{lon}", lon.toString())
						.replace("{api}", props.api_key)
						.replace("{unit}", metricValues[props.unit]),
					{ validateStatus: () => true }
				);

				if (forecast_data.status !== 200) {
					setError(
						`Error fetching forecast data: ${forecast_data.status}`
					);
					return;
				}

				const days: ForecastData["days"] = [];
				const hours: ForecastData["hours"] = [];

        for (let i = 0; i < forecast_data.data.list.length; i++) {
          const item = forecast_data.data.list[i];

          const date = new Date(item.dt * 1000);
					const day = date.getDay();
					const hour = date.getHours();

          const dayIndex = days.findIndex((day_) => day_.dt === day);
          const hourIndex = hours.findIndex((hour_) => hour_.dt === hour);

          if (dayIndex === -1) {
            if (days.length === 3) break;

            days.push({
              dt: day,
              weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
              min: item.main.temp_min,
              max: item.main.temp_max,
              icon: `http://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`,
            });
          } else {
            if (item.main.temp_min < days[dayIndex].min) {
              days[dayIndex].min = item.main.temp_min;
            }

            if (item.main.temp_max > days[dayIndex].max) {
              days[dayIndex].max = item.main.temp_max;
            }
          }

          if (hourIndex === -1) {
            hours.push({
              dt: hour,
              hour: date.toLocaleTimeString("en-US", { hour: "2-digit" }),
              temperature: item.main.temp,
            });
          }
        }

				setForecastData({ days, hours });
			}
		})();
	}, [props]);

  useEffect(() => {
    if (ref.current !== undefined && ref.current !== null) {
      let { top, left, bottom, right } = pos;
      
      // check if top of bounding box is out of screen bounds
      if (ref.current.getBoundingClientRect().top < 0) {
        top = "100%";
        bottom = undefined;
      } else if (ref.current.getBoundingClientRect().bottom > window.innerHeight) {
        top = undefined;
        bottom = "100%";
      }
  
      // check if left of bounding box is out of screen bounds
      if (ref.current.getBoundingClientRect().left < 0) {
        left = "0%";
        right = undefined;
      } else if (ref.current.getBoundingClientRect().right > window.innerWidth) {
        left = undefined;
        right = "0%";
      }

      setPos({top, left, bottom, right});
    }
  }, [ref, ref.current]);

	if (lanLon === undefined) return null;
  if (!props.open) return null;

  let highest = 100;
  let lowest = -100;
  const fadeOffset = 50;

  if (forecastData !== undefined) {
    highest = Math.max(...forecastData.hours.map(d => d.temperature));
    lowest = Math.min(...forecastData.hours.map(d => d.temperature));
  }

  const redStart = 0;
  const redEnd = (1 - ((ColorUtils.getRed().at - lowest) / (highest - lowest))) * 100;
    
  const yellowStart = redEnd + fadeOffset;
  const yellowEnd = (1 - ((ColorUtils.getYellow().at - lowest) / (highest - lowest))) * 100;

  const greenStart = yellowEnd + fadeOffset;
  const greenEnd = 100;

  const yScale = 50 / (highest - lowest);
  const yAxisOffset = (highest * yScale);

	return (
		<div 
      className={styles.wrapper} 
      ref={ref}
      style={{
        top: pos.top,
        left: pos.left,
        right: pos.right,
        bottom: pos.bottom,
        opacity: pos.top === undefined && pos.left === undefined && pos.right === undefined && pos.bottom === undefined ? 0 : 1,
      }}
    >
			{error && forecastData === undefined ? (
				<div className={styles.error}>{error}</div>
			) : (
				<>
					<header style={{textAlign: "center", width: "100%", marginBottom: "10px"}}>{props.city}</header>
					<main className={styles.overview}>
            {forecastData?.days.map((day, index) => {
              return <div className={styles.day} key={index}>
                <span className={styles.weekday}>{day.weekday}</span>
                <img src={day.icon} alt="weather icon" />
                <span className={styles.temperature}>{day.min.toFixed(0)}° | {day.max.toFixed(0)}°</span>
              </div>
            })}
            <svg className={styles.graph} version="2" xmlns="https://www.w3.org/2000/svg" width="450" height="50" viewBox="0 0 450 60">
              <defs>
                <linearGradient id="temperatureGradient" gradientTransform="rotate(90)">
                  { redStart > 0 ? <stop offset={`${redStart}%`} stopColor={ColorUtils.getRed().color} /> : null }
                  { redEnd > 0 ? <stop offset={`${redEnd}%`} stopColor={ColorUtils.getRed().color} /> : null }
                  
                  { yellowStart > 0 ? <stop offset={`${yellowStart}%`} stopColor={ColorUtils.getYellow().color} /> : null }
                  { yellowEnd > 0 ? <stop offset={`${yellowEnd}%`} stopColor={ColorUtils.getYellow().color} /> : null }

                  <stop offset={`${greenStart}%`} stopColor={ColorUtils.getGreen().color} />
                  <stop offset={`${greenEnd}%`} stopColor={ColorUtils.getGreen().color} />
                </linearGradient>
              </defs>
              {/* <rect x="0" y="0" width="450" height="50" fill="none" stroke="#FFF"></rect> */}
              <polyline 
                points={forecastData?.hours.map((hour, index) => {
                  return `${(index * (450 / forecastData?.hours.length)).toFixed(0)} ${(yAxisOffset - hour.temperature * yScale).toFixed(0)}`
                }).join(", ") + " 450 25"}
                fill="none"
                stroke="url(#temperatureGradient)"
                strokeWidth="4"
              />

              {[...Array(2)].map((_, index) => (
                <React.Fragment key={100 + index}>
                  <line x1={(index + 1) * (450 / 3)} x2={(index + 1) * (450 / 3)} y1="0" y2="45" stroke="#00000080" strokeWidth="1"></line>
                  <text x={(index + 1) * (450 / 3)} y="55" fill="#000000A0" textAnchor="middle">00:00</text>
                </React.Fragment>
              ))}

              <line x1="0" x2="450" y1={yAxisOffset} y2={yAxisOffset} stroke="#000000A0" strokeWidth="2"></line>

              {[...Array(3)].map((_, index) => {
                const number = ((highest - lowest) / 2 * (2 - index) + lowest);
                
                return (
                  <text key={300 + index} x={number > 0 ? "7" : "0"} y={(index + 0.7) * (60 / 3)} fill="black" style={{filter: "drop-shadow(0 0 10px white)"}}>
                    {number.toFixed(0)}°                  
                  </text>
                )
              })}
            </svg>
					</main>
				</>
			)}
		</div>
	);
};

export default Forecast;
