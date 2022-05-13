import React from "react";
import axios from "axios";
import CustomComponentRegistry from "../../../utils/customcomponentregistry";
import getUserSettings from "../../../utils/settings";
import EventHandler from "../../../utils/eventhandler";
import styles from './weatherwidget.module.css';
import errorstyles from './error.module.css';

const positionValues = [styles.four, styles.three, styles.two, styles.one];
const opacityValues = [1, 0, 0.7, 0.5, 0.3];
const metricValues = ["metric", "standard", "imperial"];
const temperatureValueValues = ["C", "K", "F"];
const refreshRate = 15*60*1000;

class WeatherWidget extends React.Component {
    constructor(props) {
        super(props);

        this.requestData = this.requestData.bind(this);

        this.state = {
            showing: getUserSettings().get("cc.weatherwidget.state"),
            opacity: getUserSettings().get("cc.weatherwidget.state") ? 0 : 1,
            position: getUserSettings().get("cc.weatherwidget.position"),
            unit: getUserSettings().get("cc.weatherwidget.unit"),
            status: -1,
            fullCityName: "Frankfurt am Main",
            temperature: 2,
            icon: "http://openweathermap.org/img/wn/02d@4x.png",
            intervalId: null
        }
    }

    requestData() {
        // if invalid api key: returns "cod": 401
        // if invalid city name: returns "cod": 404
        // if valid: returns "cod": 200

        const API_KEY = getUserSettings().get("cc.weatherwidget.api_key");
        const CITY = getUserSettings().get("cc.weatherwidget.city");
        const UNIT = metricValues[this.state.unit];

        axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=${UNIT}&lang=EN`)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        fullCityName: response.data.name,
                        temperature: Math.round(response.data.main.temp),
                        icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@4x.png`,
                        status: 200
                    });
                } else if (response.status === 404) {
                    this.setState({
                        status: 404
                    });
                } else if (response.status === 401) {
                    this.setState({
                        status: 401
                    });
                }
            })
            .catch(error => {
                console.error(error);
            })
    }

    componentDidMount() {
        EventHandler.listenEvent("blurall", "weatherwidget", (data) => {
            this.setState({
                opacity: data.blur ? getUserSettings().get("cc.weatherwidget.auto_hide") : (getUserSettings().get("cc.weatherwidget.state") ? 0 : 1)
            });
        });

        EventHandler.listenEvent("set.cc.weatherwidget.state", "weatherwidget", (data) => {
            clearInterval(this.state.intervalId);
            this.setState({
                showing: data.value,
                intervalId: setInterval(this.requestData, refreshRate)
            });
        });

        EventHandler.listenEvent("set.cc.weatherwidget.position", "searchbar", (data) => {
            this.setState({ position: data.value });
        });

        EventHandler.listenEvent("set.cc.weatherwidget.unit", "weatherwidget", (data) => {
            this.setState({ unit: data.value }, this.requestData);
        });

        this.requestData();
        
        this.setState({
            intervalId: setInterval(this.requestData, refreshRate)
        });
    }

    componentWillUnmount() {
        EventHandler.unlistenEvent("blurall", "weatherwidget");
        EventHandler.unlistenEvent("set.cc.weatherwidget.state", "weatherwidget");
        EventHandler.unlistenEvent("set.cc.weatherwidget.position", "weatherwidget");
        EventHandler.unlistenEvent("set.cc.weatherwidget.unit", "weatherwidget");
    
        clearInterval(this.state.intervalId);
    }

    render() {
        if (!this.state.showing) {
            return null;
        }
        
        if (this.state.status === 200) {
            return (
                <div 
                    className={`${styles.wrapper} ${positionValues[this.state.position]}`}
                    style={{opacity: opacityValues[this.state.opacity]}}
                >
                    <div className="weather_widget widget">
                        <div className={styles.wrapper}>
                            <div className={styles.status_icon}>
                                <img src={this.state.icon} alt="weather icon" />
                            </div>
                            <div>
                                <div className={styles.temperature}>
                                    <p>{this.state.temperature}°{temperatureValueValues[this.state.unit]}</p>
                                </div>
                                <div className={styles.city}>
                                    <p>{this.state.fullCityName}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else if (this.state.status === 404 || this.state.status === 401) {
            return (
                <div 
                    className={`${styles.wrapper} ${positionValues[this.state.position]}`}
                    style={{opacity: opacityValues[this.state.opacity]}}
                >
                    <div className="weather_widget widget">
                        <div className={errorstyles.container}>
                            <div className={errorstyles.status_code}>
                                <p style={{
                                    color: "white",
                                    fontWeight: "300"
                                }}>{this.state.status}</p>
                            </div>
                            <div className={errorstyles.wrong_city}>
                                <p>{
                                    this.state.status === 404 ?
                                    "Couldn't find any weather data for the city you provided!" :
                                    "The token you provided is not a valid token!"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else if (this.state.status === -1) {
            return (
                <div 
                    className={`${styles.wrapper} ${positionValues[this.state.position]}`}
                    style={{opacity: opacityValues[this.state.opacity]}}
                >
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
                </div>
            )
        }
    }
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