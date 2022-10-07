import { useMoverSettings, useMoverState } from "../../../hooks/widgetmover";
import styles from "./styles.module.css";

const THRESHHOLD = 10;

const percHToPix = (percentage: number) => {
	return (percentage * window.innerHeight) / 100;
};

const percWToPix = (percentage: number) => {
    return (percentage * window.innerWidth) / 100;
}

const WidgetMoverWrapper = (props: any) => {
	const moverEnabled = useMoverState((state) => state.enabled);
	const [selectedWidget, setSelectedWidget] = useMoverSettings((state) => [
		state.selectedWidget,
		state.setSelectedWidget,
	]);
	
	const onMouseMove = (e: any) => {

	}

	const onMouseDown = () => {
		if (!selectedWidget) {
			setSelectedWidget(props.id);
		}

		document.body.addEventListener("mousemove", onMouseMove);
		document.body.addEventListener("mouseup", onMouseUp);
	};

	const onMouseUp = () => {
		setSelectedWidget(null);
		document.body.removeEventListener("mousemove", onMouseMove);
		document.body.removeEventListener("mouseup", onMouseUp);
	};

	return (
		<div
			className={`${styles.wrapper} ${
				moverEnabled ? styles.moverEnabled : ""
			}`}
			style={{
				top: `${0}%`,
				left: `${0}%`,
			}}
		>
			<div className={styles.inner}>
				{/*@ts-ignore*/}
				{props.children}
				{moverEnabled && (
					<div className={styles.overlay} onMouseDown={onMouseDown} />
				)}
			</div>
		</div>
	);
};

export default WidgetMoverWrapper;
