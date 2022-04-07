import React from "react";
import axios from "axios";
import CustomComponentRegistry from "../../../utils/customcomponentregistry";
import getUserSettings from "../../../utils/settings";
import './weatherwidget.css';


const positionValues = ["four", "three", "two", "one"];
const opacityValues = [1, 0, 0.7, 0.5, 0.3];
const metricValues = ["metric", "standard", "imperial"];

class WeatherWidget extends React.Component {
    constructor(props) {
        super(props);

        this.requestData = this.requestData.bind(this);

        this.state = {
            showing: getUserSettings().get("cc.weatherwidget.state"),
            opacity: getUserSettings().get("cc.weatherwidget.state") ? 0 : 1,
            position: getUserSettings().get("cc.weatherwidget.position"),
            status: -1,
            fullCityName: "Frankfurt am Main",
            temperature: 2,
            icon: "http://openweathermap.org/img/wn/02d@4x.png",
        }
    }

    requestData() {
        // if invalid api key: returns "cod": 401
        // if invalid city name: returns "cod": 404
        // if valid: returns "cod": 200

        const API_KEY = getUserSettings().get("cc.weatherwidget.api_key");
        const CITY = getUserSettings().get("cc.weatherwidget.city");
        const UNIT = metricValues[getUserSettings().get("cc.weatherwidget.unit")];

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
        this.requestData();
    }

    render() {
        if (this.state.status === 200) {
            return (
                <div className="weather_widget__wrapper">
                    <div className="weather_widget widget">
                        <div className="weather_widget__information">
                            <div className="weather_widget__weather_info">
                                <div className="weather_widget__status_icon">
                                    <img src={this.state.icon} alt="weather icon" />
                                </div>
                                <div className="weather_widget__temperature">
                                    <p>{this.state.temperature}°C</p>
                                </div>
                            </div>
                            <div className="weather_widget__city_info">
                                <p>{this.state.fullCityName}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else if (this.state.status === 404 || this.state.status === 401) {
            return (
                <div className="weather_widget__wrapper">
                    <div className="weather_widget">
                        <div className="weather_widget__inner_container">
                            <div className="weather_widget__status_code">
                                <p>{this.state.status}</p>
                            </div>
                            <div className="weather_widget__wrong_city">
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
                <div className="weather_widget__wrapper">
                    <div className="weather_widget">
                        <div className="weather_widget__inner_container">
                            <p style={{
                                fontSize: "2em",
                                padding: "0",
                                margin: "0.7em"
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
                "name": "Default City",
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