/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState, useCallback } from "react";
import styles from "./App.module.css";
import AutoHideScheduler from "./components/AutoHideScheduler";
import { IImage, IQueue, metaDb, useMeta, widgetsDb } from "./utils/db";
import EventHandler from "./utils/eventhandler";
import { useSetting } from "./utils/eventhooks";

const blurValues = [5, 10, 30, 60, 300];
const switchValues = [null, 10, 60, 120, 300, 600, 1800, 3600];
const playlistOrderValues = ["Ordered", "Shuffled"];

function Background(props: any) {
	const [blur, setBlur] = useState(false);
	const background = useLiveQuery(async () =>
		metaDb.images.get((await metaDb.meta.get("selected_image"))?.value)
	);
	/* 
	const [whenWallpaperSwitch, _1] = useSetting("wallpaper-0", "when_switch");
	const [shouldWallpaperSwitch, _2] = useSetting("wallpaper-0", "state");
 */
	return (
		<div
			className={styles.background}
			style={{
				backgroundImage: `url(${(background || { url: "" }).url})`,
			}}
		>
			<AutoHideScheduler setBlur={setBlur} blur={blur} />
			{props.children(blur)}
		</div>
	);
}

export default Background;
