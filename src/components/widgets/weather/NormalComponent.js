import styles from './weatherwidget.module.css';

const temperatureValueValues = ["C", "K", "F"];

function NormalComponent(props) {
    return (
        <div className="weather_widget widget">
            <div className={styles.inner_wrapper}>
                <div className={styles.status_icon}>
                    <img src={props.data.icon} alt="weather icon" />
                </div>
                <div>
                    <div className={styles.temperature}>
                        <p>{props.data.temperature}°{temperatureValueValues[props.unit]}</p>
                    </div>
                    <div className={styles.city}>
                        <p>{props.data.fullCityName}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NormalComponent;

