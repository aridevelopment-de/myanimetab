import { useRef } from "react";
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
	const box = useRef<HTMLDivElement | null>(null);
	const moverEnabled = useMoverState((state) => state.enabled);
	const [selectedWidget, setSelectedWidget] = useMoverSettings((state) => [
		state.selectedWidget,
		state.setSelectedWidget,
	]);
	
	const onMouseMove = (e: any) => {
		if (!box.current) return;

		const [mouseX, mouseY, boxWidth, boxHeight] = [e.clientX, e.clientY, box.current.offsetWidth, box.current.offsetHeight]
		const [boxLeft, boxRight, boxTop, boxBottom] = [mouseX - boxWidth / 2, mouseX + boxWidth / 2, mouseY - boxHeight / 2, mouseY + boxHeight / 2];

		box.current.style.top = `${boxTop}px`;
		box.current.style.left = `${boxLeft}px`;
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
			ref={box}
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
