/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import styles from "./App.module.css";
import AutoHideScheduler from "./components/AutoHideScheduler";
import BackgroundScheduler from "./components/BackgroundScheduler";
import QueueScheduler from "./components/QueueScheduler";
import { metaDb } from "./utils/db";

function Background(props: {children: (blur: boolean) => JSX.Element, moverEnabled: boolean}) {
	const [blur, setBlur] = useState(false);
	const background = useLiveQuery(async () => {
		const selectedImage = await metaDb.meta.get("selected_image");

		if (selectedImage !== undefined) {
			const image = await metaDb.images.get(selectedImage.value);

			if (image !== undefined) {
				return image;
			}
		}

		return null;
	});

	useEffect(() => {
		if (props.moverEnabled) {
			setBlur(false);
		}
	}, [props, props.moverEnabled]);

	return (
		<div
			className={styles.background}
			style={{
				backgroundImage: `url(${(background || { url: "" }).url})`,
			}}
		>
			<AutoHideScheduler setBlur={setBlur} blur={blur} />
			<BackgroundScheduler />
			<QueueScheduler />
			{props.children(blur)}
		</div>
	);
}

export default Background;
