// @ts-nocheck
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SettingsIcon from "@mui/icons-material/Settings";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { useEffect, useState } from "react";
import EventHandler from "../../../utils/eventhandler";
import { useSetting } from "../../../utils/eventhooks";
import { KnownComponent } from "../../../utils/registry/types";
import styles from "./controlbar.module.css";

const positionValues = [styles.two, styles.one];

function ControlBar(props: { blur: boolean; id: string }) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [position, setPosition] = useSetting(props.id, "position");
	const [unlocked, setUnlocked] = useState(true); // useSetting(props.id, "state");
	const [collapsed, setCollapsed] = useState(false);
	useEffect(() => setCollapsed(props.blur), [props.blur]);

	console.log(props);

	return (
		<div
			className={`${styles.control_menu} ${positionValues[position]}`}
			style={{
				transform: collapsed ? "translateY(-80%)" : "translateY(0)",
			}}
		>
			<div className={styles.item__wrapper}>
				<div
					onClick={() =>
						EventHandler.emit("settings_window_state", {
							opened: true,
						})
					}
				>
					<SettingsIcon />
				</div>
			</div>

			<div className={styles.item__wrapper}>
				<div
					onClick={() => {
						EventHandler.emits(["skip_image", "playlist_refresh"]);
						setUnlocked(true);
					}}
				>
					<SkipNextIcon />
				</div>
			</div>

			<div className={styles.item__wrapper}>
				<div onClick={() => setUnlocked(!unlocked)}>
					{unlocked ? <LockOpenIcon /> : <LockIcon />}
				</div>
			</div>

			<div
				className={`${styles.expand_less__wrapper} ${styles.item__wrapper}`}
			>
				<div onClick={() => setCollapsed(!collapsed)}>
					{collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
				</div>
			</div>
		</div>
	);
}

export default {
	type: "controlbar",
	element: ControlBar,
	metadata: {
		name: "Control Bar",
		author: "Aridevelopment.de",
		defaultComponent: true,
		removeableComponent: false,
	},
	headerSettings: {
		name: "Control Bar",
		type: "controlbar",
		option: {
			type: null,
		},
	},
	contentSettings: [
		{
			name: "Positioning",
			key: "position",
			type: "dropdown",
			values: positionValues,
			displayedValues: ["Right upper corner", "Left upper corner"],
		},
	],
} as KnownComponent;
