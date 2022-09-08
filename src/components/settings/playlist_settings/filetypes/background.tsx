import styles from "./background.module.css";
import globalstyles from "../playlistsettingscomponent.module.css";
import { IImage, metaDb } from "../../../../utils/db";
import { Checkbox } from "@mantine/core";
import { useEffect, useState } from "react";
import { showNotification } from "@mantine/notifications";

const Background = (props: {
	image: IImage;
	index: number;
	selected: boolean;
	setDraggedElement: Function;
}) => {
	const [isInQueue, setIsInQueue] = useState<boolean>(false);
	const [hovered, setHovered] = useState<boolean>(false);

	useEffect(() => {
		metaDb.getMeta("selected_queue").then((value: any) => {
			if (value !== null) {
				metaDb
					.queueContainsImage(value, props.image)
					.then(setIsInQueue);
			}
		});
	}, [props.image]);

	const setQueueStatus = (addToQueue: boolean) => {
		metaDb.getMeta("selected_queue").then((value: any) => {
			if (value === null) {
				showNotification({
					title: "No queue selected",
					message:
						"Please select a queue first to add the image to it",
					color: "red",
				});
			} else {
				if (addToQueue) {
					metaDb
						.insertImageToQueue(value, props.image)
						.then((success: boolean) => {
							if (success) {
								setIsInQueue(true);
							}
						});
				} else {
					metaDb
						.removeImageFromQueue(value, props.image)
						.then((success: boolean) => {
							if (success) {
								setIsInQueue(false);
							}
						});
				}
			}
		});
	};

	return (
		<div
			className={`${globalstyles.element_container} ${styles.image_container}`}
			data-context-filetype="image"
			style={{
				border: props.selected
					? "3px solid var(--mantine-color-blue-5)"
					: undefined,
				outline: props.selected ? "none" : undefined,
			}}
		>
			<div className={styles.image_wrapper}>
				<img
					src={props.image.url}
					alt="Background"
					draggable
					onDragStart={() => props.setDraggedElement(props.image)}
				/>
			</div>
			<div className={styles.overlay}>
				<span>{props.image.name}</span>
			</div>
			<div
				className={styles.click_overlay}
				data-context-filetype="image"
				data-id={props.image.id}
				draggable
				onDragStart={() => props.setDraggedElement(props.image)}
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
			>
				<div
					style={{
						position: "relative",
						width: "100%",
						height: "100%",
					}}
				>
					{(isInQueue || hovered) && (
						<Checkbox
							size="xs"
							style={{
								position: "absolute",
								top: "7px",
								right: "7px",
							}}
							checked={isInQueue}
							onChange={(event) =>
								setQueueStatus(event.target.checked)
							}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Background;
