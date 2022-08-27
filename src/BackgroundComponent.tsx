/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import styles from "./App.module.css";
import { metaDb, useMeta, widgetsDb } from "./utils/db";
import EventHandler from "./utils/eventhandler";
import { useSetting } from "./utils/eventhooks";

const blurValues = [5, 10, 30, 60, 300];
const switchValues = [null, 10, 60, 120, 300, 600, 1800, 3600];
const playlistOrderValues = ["Ordered", "Shuffled"];

function Background(props: any) {
	const [blur, setBlur] = useState(false);
	const [currentBackgroundUrl, setCurrentBackgroundUrl] = useState("");
	const currentBackgroundIdx = useMeta("selected_image", (idx: number) => {
		metaDb
			.getMeta("images")
			.then((images: string[]) => setCurrentBackgroundUrl(images[idx]));
	});
	const [whenWallpaperSwitch, _1] = useSetting("wallpaper-0", "when_switch");
	const [shouldWallpaperSwitch, _2] = useSetting("wallpaper-0", "state");
	const [autoHideTimeLapse, _3] = useSetting("autohide-0", "time_lapse");
	const [shouldAutoHide, _4] = useSetting("autohide-0", "state");

	const nextImage = () => {
		widgetsDb
			.getSetting("wallpaper-0", "playlist_order")
			.then((value: number) => {
				const playlistOrder: string = playlistOrderValues[value];

				metaDb.getMeta("images").then((images: string[]) => {
					if (images.length >= 1) {
						if (playlistOrder === "Ordered") {
							let idx = currentBackgroundIdx || 0;
							idx = (idx + 1) % images.length;
							metaDb.setMeta("selected_image", idx);
						} else if (playlistOrder === "Shuffled") {
							const idx = Math.floor(
								Math.random() * images.length
							);
							metaDb.setMeta("selected_image", idx);
						}
					}
				});
			});
	};

	EventHandler.on("skip_image", "background", nextImage);
	EventHandler.on("select_image", "background", (data: { idx: number }) => {
		metaDb.setMeta("selected_image", data.idx);
		console.log(data.idx);
	});

	// Background switch interval
	useEffect(() => {
		let interval: ReturnType<typeof setInterval>;
		const switchInterval: number | null = switchValues[whenWallpaperSwitch];

		if (shouldWallpaperSwitch) {
			if (switchInterval !== null) {
				interval = setInterval(
					nextImage,
					1000 * switchInterval || 60000
				);
			}

			return () => clearInterval(interval);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [whenWallpaperSwitch, shouldWallpaperSwitch]);

	return (
		<div
			className={styles.background}
			style={{ backgroundImage: `url(${currentBackgroundUrl})` }}
		>
			{props.children(blur)}
		</div>
	);
}

export default Background;
