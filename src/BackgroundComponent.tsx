/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState, useCallback } from "react";
import styles from "./App.module.css";
import AutoHideScheduler from "./components/AutoHideScheduler";
import BackgroundScheduler from "./components/BackgroundScheduler";
import { IImage, IQueue, metaDb, useMeta, widgetsDb } from "./utils/db";
import EventHandler from "./utils/eventhandler";
import { useSetting } from "./utils/eventhooks";

function Background(props: any) {
	const [blur, setBlur] = useState(false);
	const background = useLiveQuery(async () =>
		metaDb.images.get((await metaDb.meta.get("selected_image"))?.value)
	);

	return (
		<div
			className={styles.background}
			style={{
				backgroundImage: `url(${(background || { url: "" }).url})`,
			}}
		>
			<AutoHideScheduler setBlur={setBlur} blur={blur} />
			<BackgroundScheduler />
			{props.children(blur)}
		</div>
	);
}

export default Background;
