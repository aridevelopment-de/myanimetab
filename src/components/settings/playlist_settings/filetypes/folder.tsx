import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { useState } from "react";
import styles from "./folder.module.css";
import globalstyles from "../playlistsettingscomponent.module.css";
import { IImage, metaDb } from "../../../../utils/db";

function Folder(props: {
	path: string;
	onClick?: Function;
	draggedElement: IImage | undefined;
	onDroppedImage: Function;
}) {
	const [hovered, setHovered] = useState<boolean>(false);
	const displayedPath = props.path.split("/").pop() || "";

	return (
		<div
			className={`${globalstyles.element_container} ${styles.folder}`}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			onClick={(e) => props.onClick?.(e)}
			onDragOver={(e) => e.preventDefault()}
			onDragEnter={() => (hovered === false ? setHovered(true) : void 0)}
			onDragLeave={() => (hovered === true ? setHovered(false) : void 0)}
			onDrop={(e) => {
				if (props.draggedElement) {
					metaDb
						.relocateImage(props.draggedElement.id, props.path)
						.then(() => {
							props.onDroppedImage();
						});
				}
			}}
		>
			{hovered ? <FolderOpenIcon /> : <FolderIcon />}
			<div className={styles.overlay}>
				<span>{displayedPath}</span>
			</div>
			<div className={styles.click_overlay} data-context-filetype="folder" data-id={props.path} />
		</div>
	);
}

export default Folder;
