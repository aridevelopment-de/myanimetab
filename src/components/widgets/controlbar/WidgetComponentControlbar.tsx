// @ts-nocheck
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SettingsIcon from "@mui/icons-material/Settings";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { useEffect, useState } from "react";
import { widgetsDb } from "../../../utils/db";
import EventHandler, { EventType } from "../../../utils/eventhandler";
import { useSetting } from "../../../utils/eventhooks";
import { KnownComponent } from "../../../utils/registry/types";
import WidgetMoverWrapper from "../../widgetmover/wrapper/WidgetMoverWrapper";
import styles from "./controlbar.module.css";

function ControlBar(props: { blur: boolean; id: string }) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [unlocked, setUnlocked] = useSetting("wallpaper-0", "state");
	const [collapsed, setCollapsed] = useState(false);
	useEffect(() => setCollapsed(props.blur), [props.blur]);

	return (
		<WidgetMoverWrapper id={props.id}>
			<div
				className={`${styles.control_menu}`}
				style={{
					transform: collapsed ? "translateY(-80%)" : "translateY(0)",
				}}
			>
				<div className={styles.item__wrapper}>
					<div
						onClick={() =>
							EventHandler.emit(EventType.SETTINGS_WINDOW_STATE, {
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
							EventHandler.emits([EventType.SKIP_IMAGE, EventType.PLAYLIST_REFRESH]);
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
		</WidgetMoverWrapper>
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
		installableComponent: false,
	},
	headerSettings: {
		name: "Control Bar",
		type: "controlbar",
		option: {
			type: null,
		},
	},
	contentSettings: [
		
	],
} as KnownComponent;
