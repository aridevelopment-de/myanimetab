import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { useState } from "react";
import styles from "./folder.module.css";
import globalstyles from "../playlistsettingscomponent.module.css";
import { IFolder, IImage, metaDb } from "../../../../utils/db";
import { useMantineTheme } from "@mantine/core";

function Folder(props: {
	folder: IFolder;
	onClick?: Function;
	draggedElement: IImage | undefined;
	onDroppedImage: Function;
	style?: any;
}) {
	const theme = useMantineTheme();
	const [hovered, setHovered] = useState<boolean>(false);

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
						.relocateImage(props.draggedElement.id, props.folder.id)
						.then(() => {
							props.onDroppedImage(props.folder);
						});
				}
			}}
			style={props.style}
		>
			{hovered ? (
				<FolderOpenIcon
					style={{ fill: props.folder.color || theme.colors.blue[5] }}
				/>
			) : (
				<FolderIcon
					style={{ fill: props.folder.color || theme.colors.blue[5] }}
				/>
			)}
			<div className={styles.overlay}>
				<span>{props.folder.name}</span>
			</div>
			<div
				className={styles.click_overlay}
				data-context-filetype="folder"
				data-id={props.folder.id}
			/>
		</div>
	);
}

export default Folder;
