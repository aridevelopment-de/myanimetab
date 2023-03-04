import { ActionIcon, Badge, NumberInput } from "@mantine/core";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Delete from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import VerticalAlignCenterIcon from "@mui/icons-material/VerticalAlignCenter";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { useDrag } from "../../../hooks/usedrag";
import { useMoverState, useSnapLineState } from "../../../hooks/widgetmover";
import {
	exportLayout,
	IHorizontalSnapLine,
	importLayout,
	ISnapLine,
	IVerticalSnapLine,
	metaDb,
} from "../../../utils/db";
import EventHandler, { EventType } from "../../../utils/eventhandler";
import snapstyles from "./snaplinelist.module.css";
import styles from "./styles.module.css";
import SaveIcon from "@mui/icons-material/Save";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useHover } from "../../../hooks/usehover";
import { downloadContent } from "../../../utils/browserutils";
import { openShowFilePicker } from "../../../utils/reactutils";

const MoverControlbar = () => {
	const [moverEnabled, setMoverEnabled] = useMoverState((state) => [
		state.enabled,
		state.setEnabled,
	]);
	const [showLines, setShowLines] = useState<boolean>(true);
	const { ref: dragRef, top, left } = useDrag(20, 20);

	/*
    - Exitting mover mode
    - Creating horizontal snap line
    - Creating vertical snap line
    - Dropdown snapline list
    */

	return (
		<div
			className={`${styles.container}`}
			style={{
				top,
				left,
			}}
			// @ts-ignore
			ref={dragRef}
		>
			<div className={styles.actionbar}>
				<ActionIcon onClick={() => setMoverEnabled(false)} title="Exit & Save">
					<LogoutIcon />
				</ActionIcon>
				<ActionIcon
					onClick={() => EventHandler.emit(EventType.WIDGETMOVER_SAVE)}
					title="Save the current layout"
				>
					<SaveIcon />
				</ActionIcon>
				<div className={styles.seperator} />
				<ActionIcon
					onClick={() => {
						metaDb.addSnapLine({
							axis: "horizontal",
							top: 50,
							bottom: null,
						} as IHorizontalSnapLine);
					}}
					title="Add a new horizontal snap line"
				>
					<VerticalAlignCenterIcon />
				</ActionIcon>
				<ActionIcon
					onClick={() => {
						metaDb.addSnapLine({
							axis: "vertical",
							left: 50,
							right: null,
						} as IVerticalSnapLine);
					}}
					title="Add a new vertical snap line"
				>
					<VerticalAlignCenterIcon sx={{ rotate: "90deg" }} />
				</ActionIcon>
				<div className={styles.seperator} />
				<ActionIcon onClick={() => exportLayout().then((layout) => downloadContent("layout.json", JSON.stringify(layout)))} title="Download the layout">
					<FileDownloadIcon />
				</ActionIcon>
				<ActionIcon onClick={async () => {
					const files = await openShowFilePicker("application/json", false);
					
					if (files.length > 0) {
						const layoutFile = files[0];
						let layout;

						try {
							layout = JSON.parse(await layoutFile.text());
						} catch (e) {
							console.error(e);
							return;
						}

						importLayout(layout, true).then((success: boolean) => {
							if (!success) {
								alert("Failed to import layout. It seems like the layout is invalid. Please check the console for more information.");
							}
						});
					}
				}} title="Upload a specific layout">
					<FileUploadIcon />
				</ActionIcon>
				<div className={styles.seperator} />
				<ActionIcon onClick={() => setShowLines(!showLines)}>
					{showLines ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
				</ActionIcon>
				<Badge variant="filled" color="red" size="xs">
					Beta
				</Badge>
			</div>
			{showLines && <SnapLineList />}
		</div>
	);
};

const TinyPercentageInput = (props: { value: number; setValue: Function }) => {
	return (
		<NumberInput
			size="xs"
			min={0}
			max={100}
			step={0.1}
			precision={1}
			value={props.value ?? ""}
			onChange={(value) => {
				if (value !== undefined) {
					props.setValue(value);
				}
			}}
			style={{ width: "60px" }}
			formatter={(value) => `${value?.replace("%", "")}%`}
			hideControls
		/>
	);
};

const SnapLineListEntry = (props: { snapLine: ISnapLine }) => {
	const [addGlow, removeGlow] = useSnapLineState((state) => [
		state.add,
		state.remove,
	]);
	const [percentage, setPercentage] = useState(
		props.snapLine.axis === "horizontal"
			? props.snapLine.top! || props.snapLine.bottom!
			: props.snapLine.left! || props.snapLine.right!
	);
	const [ref, hovered] = useHover();

	useEffect(() => {
		if (hovered) {
			addGlow(props.snapLine.id);
		} else {
			removeGlow(props.snapLine.id);
		}
	}, [hovered, props.snapLine.id, addGlow, removeGlow]);

	return (
		// @ts-ignore
		<div className={snapstyles.snapline} key={props.snapLine.id} ref={ref}>
			<VerticalAlignCenterIcon
				sx={{
					rotate:
						props.snapLine.axis === "vertical" ? "90deg" : "0deg",
				}}
			/>
			<TinyPercentageInput
				value={percentage}
				setValue={(value: number) => {
					setPercentage(value);

					if (props.snapLine.axis === "horizontal") {
						if (
							props.snapLine.top !== null &&
							props.snapLine.top !== value
						) {
							metaDb.snapLines.update(props.snapLine.id, {
								top: value,
							});
						} else if (props.snapLine.bottom !== value) {
							metaDb.snapLines.update(props.snapLine.id, {
								bottom: value,
							});
						}
					} else {
						if (
							props.snapLine.left !== null &&
							props.snapLine.left !== value
						) {
							metaDb.snapLines.update(props.snapLine.id, {
								left: value,
							});
						} else if (props.snapLine.right !== value) {
							metaDb.snapLines.update(props.snapLine.id, {
								right: value,
							});
						}
					}

					EventHandler.emit(EventType.UPDATE_SNAPLINE, {
						snapId: props.snapLine.id,
						axis: props.snapLine.axis,
						percentage: value,
					});
				}}
			/>
			<div
				style={{
					marginLeft: "auto",
					display: "flex",
					flexDirection: "row",
				}}
			>
				<ActionIcon
					onClick={() => {
						if (props.snapLine.axis === "horizontal") {
							if (props.snapLine.top !== null) {
								metaDb.snapLines.update(props.snapLine.id, {
									top: null,
									bottom: 100 - props.snapLine.top!,
								});
								setPercentage(100 - props.snapLine.top!);
							} else {
								metaDb.snapLines.update(props.snapLine.id, {
									top: 100 - props.snapLine.bottom!,
									bottom: null,
								});
								setPercentage(100 - props.snapLine.bottom!);
							}
						} else {
							if (props.snapLine.left !== null) {
								metaDb.snapLines.update(props.snapLine.id, {
									left: null,
									right: 100 - props.snapLine.left!,
								});
								setPercentage(100 - props.snapLine.left!);
							} else {
								metaDb.snapLines.update(props.snapLine.id, {
									left: 100 - props.snapLine.right!,
									right: null,
								});
								setPercentage(100 - props.snapLine.right!);
							}
						}
					}}
				>
					{props.snapLine.axis === "horizontal" ? (
						props.snapLine.top !== null ? (
							<ArrowDownwardIcon />
						) : (
							<ArrowUpwardIcon />
						)
					) : props.snapLine.left !== null ? (
						<ArrowForwardIcon />
					) : (
						<ArrowBackIcon />
					)}
				</ActionIcon>
				<ActionIcon
					onClick={async () => {
						metaDb.deleteSnapLine(props.snapLine.id).then(() =>
							EventHandler.emit(EventType.DELETE_SNAPLINE, {
								snapId: props.snapLine.id,
							})
						);
					}}
				>
					<Delete />
				</ActionIcon>
			</div>
		</div>
	);
};

const SnapLineList = () => {
	const snapLines = useLiveQuery(() => metaDb.snapLines.toArray());

	return (
		<div className={snapstyles.container}>
			{snapLines?.map((snapLine, index) => (
				<SnapLineListEntry snapLine={snapLine} />
			))}
		</div>
	);
};

export default MoverControlbar;
