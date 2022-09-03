import { useSetting } from "../utils/eventhooks";
import { useEffect } from "react";

const AUTO_HIDE_VALUES = [5, 10, 30, 60, 300];
const EVENTS = ["mousemove", "keydown", "keyup", "mouseup"];

const AutoHideScheduler = (props: { setBlur: Function; blur: boolean }) => {
	const [autoHideTimeLapse, _3] = useSetting("autohide-0", "time_lapse");
	const [shouldAutoHide, _4] = useSetting("autohide-0", "state");

	useEffect(() => {
		let interval: ReturnType<typeof setInterval>;

		const resetBlur = () => {
			if (props.blur) {
				props.setBlur(false);
			}
		};

		for (const event of EVENTS) {
			document
				.getElementsByTagName("body")[0]
				.addEventListener(event, resetBlur);
		}

		if (!shouldAutoHide) {
			props.setBlur(false);
		} else {
			interval = setInterval(() => {
				if (!props.blur) {
					props.setBlur(true);
				}
			}, AUTO_HIDE_VALUES[autoHideTimeLapse] * 1000);
		}

		return () => {
			clearInterval(interval);

			for (const event of EVENTS) {
				document
					.getElementsByTagName("body")[0]
					.removeEventListener(event, resetBlur);
			}
		};
	}, [shouldAutoHide, props, autoHideTimeLapse]);

	return <></>;
};

export default AutoHideScheduler;
