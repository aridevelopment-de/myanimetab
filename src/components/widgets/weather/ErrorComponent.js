import errorstyles from './error.module.css';
import styles from './weatherwidget.module.css';

function ErrorComponent(props) {
    return (
        <div className="weather_widget widget">
            <div className={errorstyles.container}>
                <div className={errorstyles.status_code}>
                    <p style={{
                        color: "white",
                        fontWeight: "300"
                    }}>{props.status}</p>
                </div>
                <div className={errorstyles.wrong_city}>
                    <p>{
                        props.status === 404 ?
                        "Couldn't find any weather data for the city you provided!" :
                        "The token you provided is not a valid token!"}</p>
                </div>
            </div>
        </div>
    )
}

export default ErrorComponent;