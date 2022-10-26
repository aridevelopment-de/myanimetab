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

	useEffect(() => {
		EventHandler.on("widgetmover:disabled", props.id, () => {
			console.debug("Saving snap config for widget", props.id);
			widgetsDb.setSnapConfiguration(props.id, snapConfig);
		})
	}, [moverEnabled, snapConfig, props.id]);

	useEffect(() => {
		(async () => {
			const sn = await metaDb.snapLines.toArray();
			widgetsDb.getSetting(props.id, "snaps").then((config: ISnapConfiguration) => {
				if (config) {
					console.debug("Loading snap config for widget", props.id);
					setSnapConfig(config);
					
					const newBoxPos: any = {};
	
					if (config.horizontal.percentage) {
						newBoxPos.top = config.horizontal.percentage;
					} else {
						if (config.horizontal.top) {
							const snapLine = getSnapLine(config.horizontal.top, sn) as IHorizontalSnapLine;
							newBoxPos.top = snapLine.top ? snapLine.top : 100 - snapLine.bottom!;
						} else if (config.horizontal.mid) {
							const snapLine = getSnapLine(config.horizontal.mid, sn) as IHorizontalSnapLine;
							newBoxPos.top = snapLine.top ? snapLine.top : 100 - snapLine.bottom!;
							newBoxPos.shiftY = true;
						} else if (config.horizontal.bottom) {
							const snapLine = getSnapLine(config.horizontal.bottom, sn) as IHorizontalSnapLine;
							newBoxPos.bottom = snapLine.top ? 100 - snapLine.top : snapLine.bottom!;
						}
					}
	
					if (config.vertical.percentage) {
						newBoxPos.left = config.vertical.percentage;
					} else {
						if (config.vertical.left) {
							const snapLine = getSnapLine(config.vertical.left, sn) as IVerticalSnapLine;
							newBoxPos.left = snapLine.left ? snapLine.left : 100 - snapLine.right!;
						} else if (config.vertical.mid) {
							const snapLine = getSnapLine(config.vertical.mid, sn) as IVerticalSnapLine;
							newBoxPos.left = snapLine.left ? snapLine.left : 100 - snapLine.right!;
							newBoxPos.shiftX = true;
						} else if (config.vertical.right) {
							const snapLine = getSnapLine(config.vertical.right, sn) as IVerticalSnapLine;
							newBoxPos.right = snapLine.left ? 100 - snapLine.left! : snapLine.right!;
						}
					}
	
					setBoxPos(newBoxPos);
				}
			})
		})();
	}, [moverEnabled, props.id]);

	const setSnap = useCallback((snapPos: SnapPos, snapLine: ISnapLine) => {
		let sn: any;
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
					top: pixToPercH(sn.top! + (sn.bottom === undefined ? SNAPLINE_WIDTH : 0)),
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
					bottom: sn.bottom !== undefined ? sn.bottom! : 100 - pixToPercH(sn.top!),
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
					left: pixToPercW(sn.left! + (sn.right === undefined ? SNAPLINE_WIDTH : 0)),
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
				console.log(sn.right === undefined ? SNAPLINE_WIDTH / 2 : 0)
				setBoxPos((prev) => ({
					...prev,
					right: undefined,
					left: pixToPercW(sn.left! + (sn.right === undefined ? SNAPLINE_WIDTH / 2 : -SNAPLINE_WIDTH / 2)),
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
					right: sn.right === undefined ? 100 - pixToPercW(sn.left!!) : pixToPercW(percWToPix(sn.right!) + SNAPLINE_WIDTH),
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
						if (s.bottom !== undefined)
							mod.top = percHToPix(100 - s.bottom);
						if (s.top !== undefined) mod.top = percHToPix(s.top);
					}

					if (s.axis === "vertical") {
						if (s.right !== undefined)
							mod.left = percWToPix(100 - s.right);
						if (s.left !== undefined) mod.left = percWToPix(s.left);
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
