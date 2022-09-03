import React from "react";
import { IImage, metaDb } from "../../../utils/db";
import styles from "./timeline.module.css";

const TimeLine = (props: {
	fullPath: string;
	onClick?: Function;
	draggedElement: IImage | undefined;
	onDroppedImage: Function;
}) => {
	// Path might look something like this: /folder1/folder2/folder3
	// should be shown as the following: Top > folder1 > folder2 > folder3

	return (
		<>
			<span
				className={styles.folder}
				onClick={() => props.onClick?.("/")}
				onDragOver={(e) => e.preventDefault()}
				onDrop={(e) => {
					if (props.draggedElement) {
						metaDb
							.relocateImage(props.draggedElement.id, "/")
							.then(() => {
								props.onDroppedImage("/");
							});
					}
				}}
			>
				Top
			</span>
			{props.fullPath
				.substring(1)
				.split("/")
				.filter((path) => path.length > 0)
				.map((folder, index, self) => {
					return (
						<React.Fragment key={index}>
							<span>{" > "}</span>
							<span
								className={styles.folder}
								key={index}
								onDragOver={(e) => e.preventDefault()}
								onClick={() => {
									props.onClick?.(
										"/" + self.slice(0, index + 1).join("/")
									);
								}}
							>
								{folder}
							</span>
						</React.Fragment>
					);
				})}
		</>
	);
};

export default TimeLine;
