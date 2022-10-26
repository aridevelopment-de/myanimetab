import { ActionIcon, Badge, NumberInput } from "@mantine/core";
import { useHover } from "@mantine/hooks";
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
	IHorizontalSnapLine, ISnapLine, IVerticalSnapLine, metaDb
} from "../../../utils/db";
import EventHandler from "../../../utils/eventhandler";
import { mergeRefs } from "../../../utils/reactutils";
import snapstyles from "./snaplinelist.module.css";
import styles from "./styles.module.css";

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
				<ActionIcon onClick={() => setMoverEnabled(false)}>
					<LogoutIcon />
				</ActionIcon>
				<div className={styles.seperator} />
				<ActionIcon
					onClick={() => {
						metaDb.addSnapLine({
							axis: "horizontal",
							top: 50,
						} as IHorizontalSnapLine);
					}}
				>
					<VerticalAlignCenterIcon />
				</ActionIcon>
				<ActionIcon
					onClick={() => {
						metaDb.addSnapLine({
							axis: "vertical",
							left: 50,
						} as IVerticalSnapLine);
					}}
				>
					<VerticalAlignCenterIcon sx={{ rotate: "90deg" }} />
				</ActionIcon>
				<ActionIcon onClick={() => setShowLines(!showLines)}>
					{showLines ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
				</ActionIcon>
				<div className={styles.seperator} />
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
			step={1}
			value={props.value}
			onChange={(value) => {
				if (value !== undefined) {
					props.setValue(value);
				}
			}}
			style={{ width: "50px" }}
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
	const { hovered, ref } = useHover();

	useEffect(() => {
		if (hovered) {
			addGlow(props.snapLine.id);
		} else {
			removeGlow(props.snapLine.id);
		}
	}, [hovered]);

	return (
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
							props.snapLine.top !== undefined &&
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
							props.snapLine.left !== undefined &&
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

					EventHandler.emit("snapline:update", {
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
						// toggle top/bottom or left/right depending on the axis
						if (props.snapLine.axis === "horizontal") {
							if (props.snapLine.top !== undefined) {
								metaDb.snapLines.update(props.snapLine.id, {
									top: undefined,
									bottom: 100 - props.snapLine.top!,
								});
								setPercentage(100 - props.snapLine.top!);
							} else {
								metaDb.snapLines.update(props.snapLine.id, {
									top: 100 - props.snapLine.bottom!,
									bottom: undefined,
								});
								setPercentage(100 - props.snapLine.bottom!);
							}
						} else {
							if (props.snapLine.left !== undefined) {
								metaDb.snapLines.update(props.snapLine.id, {
									left: undefined,
									right: 100 - props.snapLine.left!,
								});
								setPercentage(100 - props.snapLine.left!);
							} else {
								metaDb.snapLines.update(props.snapLine.id, {
									left: 100 - props.snapLine.right!,
									right: undefined,
								});
								setPercentage(100 - props.snapLine.right!);
							}
						}
					}}
				>
					{props.snapLine.axis === "horizontal" ? (
						props.snapLine.top !== undefined ? (
							<ArrowDownwardIcon />
						) : (
							<ArrowUpwardIcon />
						)
					) : props.snapLine.left !== undefined ? (
						<ArrowForwardIcon />
					) : (
						<ArrowBackIcon />
					)}
				</ActionIcon>
				<ActionIcon
					onClick={async () =>
						await metaDb.deleteSnapLine(props.snapLine.id)
					}
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
