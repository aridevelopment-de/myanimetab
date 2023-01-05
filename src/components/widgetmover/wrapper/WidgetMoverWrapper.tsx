// @ts-nocheck
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMoverSettings, useMoverState } from "../../../hooks/widgetmover";
import {
	IHorizontalSnapLine,
	ISnapConfiguration,
	ISnapLine,
	IVerticalSnapLine,
	metaDb,
	widgetsDb
} from "../../../utils/db";
import EventHandler from "../../../utils/eventhandler";
import { SNAPLINE_WIDTH } from "../snaplinerenderer/SnapLineRenderer";
import styles from "./styles.module.css";
import { applySnap } from "./utils";

const percHToPix = (percentage: number) => {
	return (percentage * window.innerHeight) / 100;
};

const percWToPix = (percentage: number) => {
	return (percentage * window.innerWidth) / 100;
};

const pixToPercH = (pixels: number) => {
	return (pixels * 100) / window.innerHeight;
};

const pixToPercW = (pixels: number) => {
	return (pixels * 100) / window.innerWidth;
};

enum SnapPos {
	HTOP,
	HMID,
	HBOTTOM,
	VLEFT,
	VMID,
	VRIGHT,
}

enum CoordinateAxis {
	HORIZONTAL,
	VERTICAL,
}

const WidgetMoverWrapper = (props: { id: string, children: JSX.Element }) => {
	const box = useRef<HTMLDivElement | null>(null);
	const moverEnabled = useMoverState((state) => state.enabled);
	const [selectedWidget, setSelectedWidget] = useMoverSettings((state) => [
		state.selectedWidget,
		state.setSelectedWidget,
	]);
	const snapLines = useLiveQuery(() => metaDb.snapLines.toArray());
	const [snapConfig, setSnapConfig] = useState<ISnapConfiguration>({
		horizontal: { top: null, mid: null, bottom: null, percentage: 50 },
		vertical: { left: null, mid: null, right: null, percentage: 50 },
	});

	// We have to use a ref here as you won't be able to acces the updated snapConfig state within the functions
	// See https://stackoverflow.com/questions/57847594/react-hooks-accessing-up-to-date-state-from-within-a-callback for more information
	const snapConfigRef = useRef<ISnapConfiguration>();
	snapConfigRef.current = snapConfig;
	const [boxPos, setBoxPos] = useState<{
		top?: number;
		right?: number;
		bottom?: number;
		left?: number;
		shiftX: boolean;
		shiftY: boolean;
	}>({ top: 0, left: 0, shiftX: false, shiftY: false });

	const getSnapLine = (id: number, sn: ISnapLine[]): ISnapLine | undefined => {
		return sn.find((line) => line.id === id);
	}

	const loadSnaplines = useCallback(async (useCurrent: boolean = false) => {
		const sn = await metaDb.snapLines.toArray();
		widgetsDb.getSetting(props.id, "snaps").then((config_: ISnapConfiguration) => {
			let config: ISnapConfiguration = config_;

			if (useCurrent) {
				config = snapConfigRef.current!;
			}

			if (config) {
				console.debug("Loading snap config for widget", props.id);
				setSnapConfig(config);
				
				const newBoxPos: any = {};
	
				if (config.horizontal.percentage !== null) {
					newBoxPos.top = config.horizontal.percentage;
				} else {
					if (config.horizontal.top !== null) {
						const snapLine = getSnapLine(config.horizontal.top, sn) as IHorizontalSnapLine;
						newBoxPos.top = snapLine.top !== null && snapLine.top !== undefined ? snapLine.top + pixToPercH(SNAPLINE_WIDTH) : 100 - snapLine.bottom!;
					} else if (config.horizontal.mid !== null) {
						const snapLine = getSnapLine(config.horizontal.mid, sn) as IHorizontalSnapLine;
						newBoxPos.top = snapLine.top !== null && snapLine.top !== undefined ? snapLine.top + pixToPercH(SNAPLINE_WIDTH / 2) : 100 - snapLine.bottom! - pixToPercH(SNAPLINE_WIDTH / 2);
						newBoxPos.shiftY = true;
					} else if (config.horizontal.bottom !== null) {
						const snapLine = getSnapLine(config.horizontal.bottom, sn) as IHorizontalSnapLine;
						newBoxPos.bottom = snapLine.top !== null && snapLine.top !== undefined ? 100 - snapLine.top : snapLine.bottom! + pixToPercH(SNAPLINE_WIDTH);
					}
				}
	
				if (config.vertical.percentage !== null) {
					newBoxPos.left = config.vertical.percentage;
				} else {
					if (config.vertical.left !== null) {
						const snapLine = getSnapLine(config.vertical.left, sn) as IVerticalSnapLine;
						newBoxPos.left = snapLine.left !== null && snapLine.left !== undefined ? snapLine.left + pixToPercW(SNAPLINE_WIDTH) : 100 - snapLine.right!;
					} else if (config.vertical.mid !== null) {
						const snapLine = getSnapLine(config.vertical.mid, sn) as IVerticalSnapLine;
						newBoxPos.left = snapLine.left && snapLine.left !== undefined ? snapLine.left + pixToPercW(SNAPLINE_WIDTH / 2) : 100 - snapLine.right! - pixToPercW(SNAPLINE_WIDTH / 2);
						newBoxPos.shiftX = true;
					} else if (config.vertical.right !== null) {
						const snapLine = getSnapLine(config.vertical.right, sn) as IVerticalSnapLine;
						newBoxPos.right = snapLine.left && snapLine.left !== undefined ? 100 - snapLine.left! : snapLine.right! + pixToPercW(SNAPLINE_WIDTH);
					}
				}

				console.log("========")
				console.log(newBoxPos);
				console.log(config);
	
				setBoxPos(newBoxPos);
			}
		})
	}, [props.id]);

	useEffect(() => {
		EventHandler.on("snaplines:refresh", props.id, () => {
			loadSnaplines();
		});

		EventHandler.on("snapline:update", props.id, (data: {snapId: number, axis: "horizontal" | "vertical", percentage: number}) => {
			loadSnaplines(true);
		});

		EventHandler.on("snapline:delete", props.id, (data: {snapId: number}) => {
			if (snapConfigRef.current) {
				const newConfig = snapConfigRef.current;

				if (newConfig.horizontal.top === data.snapId) {
					newConfig.horizontal.top = null;
					newConfig.horizontal.percentage = 50;
				} else if (newConfig.horizontal.mid === data.snapId) {
					newConfig.horizontal.mid = null;
					newConfig.horizontal.percentage = 50;
				} else if (newConfig.horizontal.bottom === data.snapId) {
					newConfig.horizontal.bottom = null;
					newConfig.horizontal.percentage = 50;
				} else if (newConfig.vertical.left === data.snapId) {
					newConfig.vertical.left = null;
					newConfig.vertical.percentage = 50;
				} else if (newConfig.vertical.mid === data.snapId) {
					newConfig.vertical.mid = null;
					newConfig.vertical.percentage = 50;
				} else if (newConfig.vertical.right === data.snapId) {
					newConfig.vertical.right = null;
					newConfig.vertical.percentage = 50;
				}

				setSnapConfig(newConfig);
			}

			loadSnaplines(true);
		});

		return () => {
			EventHandler.off("snaplines:refresh", props.id);
			EventHandler.off("snapline:update", props.id);
			EventHandler.off("snapline:delete", props.id);
		}
	}, [props.id, loadSnaplines]);

	useEffect(() => {
		EventHandler.on("widgetmover:disabled", props.id, () => {
			console.debug("Saving snap config for widget", props.id);
			console.debug(snapConfig);
			widgetsDb.setSnapConfiguration(props.id, snapConfig);
		});

		EventHandler.on("widgetmover:save", props.id, () => {
			console.debug("Saving snap config for widget", props.id);
			console.debug(snapConfig);
			widgetsDb.setSnapConfiguration(props.id, snapConfig);
		})

		return () => {
			EventHandler.off("widgetmover:disabled", props.id);
			EventHandler.off("widgetmover:save", props.id);
		}
	}, [moverEnabled, snapConfig, props.id]);

	useEffect(() => {
		loadSnaplines();
	}, [moverEnabled, props.id, loadSnaplines]);

	const setSnap = useCallback((snapPos: SnapPos, snapLine: ISnapLine) => {
		let sn: any; // Note: top, bottom, right and left will be set automatically to pixels

		// Snap won't 100% be accurate because when the snapline changes direction, the snapline will move itself by a small amount making alingment impossible

		switch (snapPos) {
			case SnapPos.HTOP:
				if (snapConfigRef.current!.horizontal.top === snapLine.id) break;
				sn = snapLine as IHorizontalSnapLine;
				setSnapConfig((prev) => ({
					...prev,
					horizontal: {
						top: snapLine.id,
						mid: null,
						bottom: null,
						percentage: null,
					},
				}));
				setBoxPos((prev) => ({
					...prev,
					bottom: undefined,
					top: pixToPercH(sn.top! + SNAPLINE_WIDTH),
					shiftY: false,
				}));
				break;
			case SnapPos.HMID:
				if (snapConfigRef.current!.horizontal.mid === snapLine.id) break;				
				sn = snapLine as IHorizontalSnapLine;
				setSnapConfig((prev) => ({
					...prev,
					horizontal: {
						top: null,
						mid: snapLine.id,
						bottom: null,
						percentage: null,
					},
				}));
				setBoxPos((prev) => ({
					...prev,
					bottom: undefined,
					top: pixToPercH(sn.top! + (sn.bottom !== null ? SNAPLINE_WIDTH / 2 : 0)),
					shiftY: true,
				}));
				break;
			case SnapPos.HBOTTOM:
			 	if (snapConfigRef.current!.horizontal.bottom === snapLine.id) break;		
				sn = snapLine as IHorizontalSnapLine;		
				setSnapConfig((prev) => {
					return {
						...prev,
						horizontal: {
						top: null,
						mid: null,
						bottom: snapLine.id,
						percentage: null,
					},
				}});
				setBoxPos((prev) => ({
					...prev,
					top: undefined,
					bottom: sn.bottom !== null ? sn.bottom! : 100 - pixToPercH(sn.top!),
					shiftY: false,
				}));
				break;

			case SnapPos.VLEFT:
				if (snapConfigRef.current!.vertical.left === snapLine.id) break;
				sn = snapLine as IVerticalSnapLine;
				setSnapConfig((prev) => ({
					...prev,
					vertical: {
						left: snapLine.id,
						mid: null,
						right: null,
						percentage: null,
					},
				}));
				setBoxPos((prev) => ({
					...prev,
					right: undefined,
					left: pixToPercW(sn.left! + (sn.right === null ? SNAPLINE_WIDTH : 0)),
					shiftX: false,
				}));
				break;
			case SnapPos.VMID:
				if (snapConfigRef.current!.vertical.mid === snapLine.id) break;
				sn = snapLine as IVerticalSnapLine;
				setSnapConfig((prev) => ({
					...prev,
					vertical: {
						left: null,
						mid: snapLine.id,
						right: null,
						percentage: null,
					},
				}));
				setBoxPos((prev) => ({
					...prev,
					right: undefined,
					left: pixToPercW(sn.left! + (sn.right === null ? SNAPLINE_WIDTH / 2 : -SNAPLINE_WIDTH / 2)),
					shiftX: true,
				}));
				break;
			case SnapPos.VRIGHT:
				if (snapConfigRef.current!.vertical.right === snapLine.id) break;
				sn = snapLine as IVerticalSnapLine;
				setSnapConfig((prev) => ({
					...prev,
					vertical: {
						left: null,
						mid: null,
						right: snapLine.id,
						percentage: null,
					},
				}));
				setBoxPos((prev) => ({
					...prev,
					left: undefined,
					right: sn.right === null ? 100 - pixToPercW(sn.left!!) : sn.right!,
					shiftX: false,
				}));
				break;
		}
	}, [snapConfigRef]);

	const setPos = (axis: CoordinateAxis, percentage: number) => {
		switch (axis) {
			case CoordinateAxis.HORIZONTAL:
				setSnapConfig((prev) => ({
					...prev,
					horizontal: {
						top: null,
						mid: null,
						bottom: null,
						percentage,
					},
				}));
				setBoxPos((prev) => ({
					...prev,
					bottom: undefined,
					top: percentage,
					shiftY: false,
				}));
				break;

			case CoordinateAxis.VERTICAL:
				setSnapConfig((prev) => ({
					...prev,
					vertical: {
						left: null,
						mid: null,
						right: null,
						percentage,
					},
				}));
				setBoxPos((prev) => ({
					...prev,
					right: undefined,
					left: percentage,
					shiftX: false,
				}));
				break;
		}
	};

	const onMouseMove = useCallback((e: any) => {
		if (!box.current || snapLines === undefined) return;

		const [mouseX, mouseY, boxWidth, boxHeight] = [
			e.clientX,
			e.clientY,
			box.current.offsetWidth,
			box.current.offsetHeight,
		];
		const [boxLeft, boxRight, boxTop, boxBottom] = [
			mouseX - boxWidth / 2,
			mouseX + boxWidth / 2,
			mouseY - boxHeight / 2,
			mouseY + boxHeight / 2,
		];
		let verticalSnapLines: [IVerticalSnapLine, number][] = [];
		let horizontalSnapLines: [IHorizontalSnapLine, number][] = [];
		const configurations = [
			[boxLeft, boxTop],
			[boxLeft, boxBottom],
			[boxRight, boxTop],
			[boxRight, boxBottom],
			[mouseX, mouseY],
		];

		for (let config of configurations) {
			let [relX, relY] = config;
			let [vert, horiz] = applySnap(
				relX,
				relY,
				snapLines.map((s) => {
					const mod = { ...s } as any;

					if (s.axis === "horizontal") {
						if (s.bottom !== null)
							mod.top = percHToPix(100 - s.bottom);
						if (s.top !== null) mod.top = percHToPix(s.top);
					}

					if (s.axis === "vertical") {
						if (s.right !== null)
							mod.left = percWToPix(100 - s.right);
						if (s.left !== null) mod.left = percWToPix(s.left);
					}

					return mod;
				})
			);
			verticalSnapLines.push(...vert);
			horizontalSnapLines.push(...horiz);
		}

		verticalSnapLines = verticalSnapLines.sort((a, b) => {
			let [snapLineA, vertConfA]: [IVerticalSnapLine, number] = a;
			let [snapLineB, vertConfB]: [IVerticalSnapLine, number] = b;
			return (
				Math.abs(snapLineA.left!! - vertConfA) -
				Math.abs(snapLineB.left!! - vertConfB)
			);
		});

		horizontalSnapLines = horizontalSnapLines.sort((a, b) => {
			let [snapLineA, horizConfA]: [IHorizontalSnapLine, number] = a;
			let [snapLineB, horizConfB]: [IHorizontalSnapLine, number] = b;
			return (
				Math.abs(snapLineA.top!! - horizConfA) -
				Math.abs(snapLineB.top!! - horizConfB)
			);
		});

		if (verticalSnapLines.length > 0) {
			const [snapLine, vertConf] = verticalSnapLines[0];
			
			setSnap(
				vertConf === boxLeft
					? SnapPos.VLEFT
					: vertConf === mouseX
					? SnapPos.VMID
					: SnapPos.VRIGHT,
				snapLine
			);
		} else {
			setPos(CoordinateAxis.VERTICAL, pixToPercW(boxLeft));
		}

		if (horizontalSnapLines.length > 0) {
			const [snapLine, horizConf] = horizontalSnapLines[0];
			setSnap(
				horizConf === boxTop
					? SnapPos.HTOP
					: horizConf === mouseY
					? SnapPos.HMID
					: SnapPos.HBOTTOM,
				snapLine
			);
		} else {
			setPos(CoordinateAxis.HORIZONTAL, pixToPercH(boxTop));
		}
	}, [setSnap, snapLines]);

	const onMouseDown = () => {
		if (moverEnabled) {
			if (!selectedWidget) {
				setSelectedWidget(props.id);
			}

			document.body.addEventListener("mousemove", onMouseMove);
			document.body.addEventListener("mouseup", onMouseUp);
		}
	};

	const onMouseUp = () => {
		if (moverEnabled) {
			setSelectedWidget(null);
			document.body.removeEventListener("mousemove", onMouseMove);
			document.body.removeEventListener("mouseup", onMouseUp);
		}
	};

	return (
		<div
			className={`${styles.wrapper} ${
				moverEnabled ? styles.moverEnabled : ""
			}`}
			style={{
				top: boxPos.top !== undefined ? `${boxPos.top}%` : undefined,
				bottom:
					boxPos.bottom !== undefined
						? `${boxPos.bottom}%`
						: undefined,
				transform: `translate(${boxPos.shiftX ? "-50%" : "0%"}, ${
					boxPos.shiftY ? "-50%" : "0%"
				})`,
				left: boxPos.left !== undefined ? `${boxPos.left}%` : undefined,
				right:
					boxPos.right !== undefined ? `${boxPos.right}%` : undefined,
			}}
			ref={box}
		>
			<div className={styles.inner}>
				{/*@ts-ignore*/}
				{props.children}
				{moverEnabled && (
					<div className={styles.overlay} onMouseDown={onMouseDown} />
				)}
			</div>
		</div>
	);
};

export default WidgetMoverWrapper;
