import styles from "./background.module.css";
import globalstyles from "../playlistsettingscomponent.module.css";
import { IImage } from "../../../../utils/db";

const Background = (props: {
	image: IImage;
	index: number;
	setDraggedElement: Function;
}) => {
	return (
		<div
			className={`${globalstyles.element_container} ${styles.image_container}`}
			data-context-filetype="image"
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
			/>
		</div>
	);
};

export default Background;