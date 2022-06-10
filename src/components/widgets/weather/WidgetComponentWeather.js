import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomComponentRegistry from "../../../utils/customcomponentregistry";
import getUserSettings from "../../../utils/settings";
import styles from './weatherwidget.module.css';
import errorstyles from './error.module.css';
import Widget from '../Widget'
import ErrorComponent from "./ErrorComponent";
import NormalComponent from "./NormalComponent";

const positionValues = [styles.four, styles.three, styles.two, styles.one];
const opacityValues = [1, 0, 0.7, 0.5, 0.3];
const metricValues = ["metric", "standard", "imperial"];
const refreshRate = 15*60*1000;


function LoadingComponent(props) {
    return (
        <div className="weather_widget widget">
            <div className={errorstyles.container}>
                <p style={{
                    fontSize: "2em",
                    padding: "0",
                    margin: "0.7em",
                    color: "white"
                }}>
                    Loading...
                </p>
            </div>
        </div>
    )
}


function WeatherWidget(props) {
    const [ position, _ ] = Widget.useSetting("cc.weatherwidget.position", "weather");
    const [ unit, _1 ] = Widget.useSetting("cc.weatherwidget.unit", "weather");
    const [ opacity, setOpacity ] = useState(0);
    const [ data, setData ] = useState({
        statusCode: -1,
        fullCityName: "Frankfurt am Main",
        temperature: 2,
        icon: "http://openweathermap.org/img/wn/02d@4x.png"
    });

    Widget.useEvent("blurall", "weather", 1, (data) => setOpacity(data.blur ? getUserSettings().get("cc.weather.auto_hide") : 0));
    
    const retrieveData = () => {
        const API_KEY = getUserSettings().get("cc.weatherwidget.api_key");
        const CITY = getUserSettings().get("cc.weatherwidget.city");
        const UNIT = metricValues[unit];

        axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=${UNIT}&lang=EN`)
            .then(response => {
                if (response.status === 200) {
                    setData({
                        fullCityName: response.data.name,
                        temperature: Math.round(response.data.main.temp),
                        icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@4x.png`,
                        statusCode: 200
                    })
                } else if (response.status === 404 || response.status === 401) {
                    setData({
                        ...data,
                        statusCode: response.status
                    })
                }
            })

    }
    
    // TODO: the weather widget does not render even if it's there
    // Maybe take a look at opacity
    useEffect(() => {
        retrieveData();
        const interval = setInterval(retrieveData, refreshRate);
        return () => clearInterval(interval);
    }, [])
    
    return (
        <div
            className={`${styles.wrapper} ${positionValues[position]}`}
            style={{opacity: opacityValues[opacity]}}>
            {
                data.statusCode === 200 ?
                 <NormalComponent data={data} unit={unit} /> :
                 (data.statusCode !== -1 ? 
                  <ErrorComponent status={data.statusCode} /> : 
                  <LoadingComponent />)
            }
        </div>
    )
}


CustomComponentRegistry.register(
    "weatherwidget", 
    <WeatherWidget />,
    {
        shouldRegister: true,
        author: "aridevelopment.de", 
        description: "Displays the current weather status for your given location"
    },
    {
        "name": "Weather",
        "id": "weatherwidget",
        "option": {
            "type": "toggle",
            "default": true
        },
        "content": [
            {
                "name": "API Key",
                "id": "api_key",
                "type": "input",
                "tooltip": "An api key from openweathermap.org",
                "hidden": true
            },
            {
                "name": "Default City (refresh page)",
                "id": "city",
                "type": "input",
                "tooltip": "The default location (e.g. Frankfurt)",
                "hidden": false
            },
            {
                "name": "Temperature Unit",
                "id": "unit",
                "type": "dropdown",
                "values": metricValues,
                "displayedValues": ["Celsius", "Kelvin", "Fahrenheit"]
            },
            {
                "name": "When Autohiding",
                "id": "auto_hide",
                "type": "dropdown",
                "values": opacityValues,
                "displayedValues": ["Show", "Hide", "Opacity 0.7", "Opacity 0.5", "Opacity 0.3"]
            },
            {
                "name": "Positioning",
                "id": "position",
                "type": "dropdown",
                "values": positionValues,
                "displayedValues": ["Left lower corner", "Right lower corner", "Right upper corner", "Left upper corner"]
            }
        ]
    }
);

export default WeatherWidget;