import { metaDb, widgetsDb } from "../utils/db";
import { useSetting, useEvent } from "../utils/eventhooks";
import { useEffect, useState } from "react";

const ORDER_VALUES = ["Ordered", "Shuffled"];
const SWITCH_VALUES = [null, 10, 60, 120, 300, 600, 1800, 3600];

const BackgroundScheduler = () => {
	const [whenWallpaperSwitch, _1] = useSetting("wallpaper-0", "when_switch");
	const [shouldWallpaperSwitch, _2] = useSetting("wallpaper-0", "state");
	const [hasWallpaperSwitched, setHasWallpaperSwitched] = useState<boolean>();

	const nextBackground = async () => {
		const imageId = await metaDb.getMeta("selected_image");
		const qid = await metaDb.getMeta("selected_queue");
		const queue = await metaDb.getQueue(qid);

		if (!queue) return;

		const playlistOrder =
			ORDER_VALUES[
				await widgetsDb.getSetting("wallpaper-0", "playlist_order")
			];

		let nextImageId = undefined;

		switch (playlistOrder) {
			case "Ordered":
				const index = queue.images.indexOf(imageId);
				const nextIndex = (index + 1) % queue.images.length;
				nextImageId = queue.images[nextIndex];
				break;
			case "Shuffled":
				nextImageId =
					queue.images[
						Math.floor(Math.random() * queue.images.length)
					];
				break;
			default:
				return;
		}

		// if the queue is empty, do nothing
		if (nextImageId !== undefined) {
			metaDb.setMeta("selected_image", nextImageId);
		}
	};

	useEvent("skip_image", "background-scheduler", null, nextBackground);

	/* Wallpaer should switch on page visit */
	useEffect(() => {
		if (shouldWallpaperSwitch && !hasWallpaperSwitched) {
			(async () => await nextBackground())();
			setHasWallpaperSwitched(true);
		}
	}, [shouldWallpaperSwitch]);

	/* Wallpaper should switch on timer */
	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (shouldWallpaperSwitch && whenWallpaperSwitch) {
			let milliseconds = SWITCH_VALUES[whenWallpaperSwitch];

			// Should run with timer
			if (milliseconds !== null) {
				milliseconds *= 1000;
				interval = setInterval(
					async () => await nextBackground(),
					milliseconds
				);
			}
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [shouldWallpaperSwitch, whenWallpaperSwitch]);

	return <></>;
};

export default BackgroundScheduler;
