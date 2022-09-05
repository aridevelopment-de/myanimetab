import React, { useEffect, useState } from "react";
import { IFolder, IImage, metaDb, ROOT_FOLDER } from "../../../../utils/db";
import styles from "./timeline.module.css";

const TimeLine = (props: {
	folder: IFolder;
	onClick?: Function;
	draggedElement: IImage | undefined;
	onDroppedImage: Function;
}) => {
	// Path might look something like this: /folder1/folder2/folder3
	// should be shown as the following: Top > folder1 > folder2 > folder3
	const [folderHirachy, setFolderHirachy] = useState<IFolder[]>();

	useEffect(() => {
		metaDb.getFolderHirachy(props.folder).then(setFolderHirachy);
	}, [props]);

	return (
		<>
			<span
				className={styles.folder}
				onClick={() => props.onClick?.(ROOT_FOLDER)}
				onDragOver={(e) => e.preventDefault()}
				onDrop={(e) => {
					if (props.draggedElement) {
						metaDb
							.relocateImage(
								props.draggedElement.id,
								ROOT_FOLDER.id
							)
							.then(() => {
								props.onDroppedImage(ROOT_FOLDER);
							});
					}
				}}
			>
				Top
			</span>
			{folderHirachy !== undefined &&
				folderHirachy.map((folder: IFolder) => {
					return (
						<React.Fragment key={folder.id}>
							<span>{" > "}</span>
							<span
								className={styles.folder}
								onDragOver={(e) => e.preventDefault()}
								onClick={() => props.onClick?.(folder)}
							>
								{folder.name}
							</span>
						</React.Fragment>
					);
				})}
		</>
	);
};

export default TimeLine;
