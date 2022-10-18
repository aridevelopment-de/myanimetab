import { useLiveQuery } from "dexie-react-hooks";
import { useRef, useState, useEffect } from "react";
import { useMoverSettings, useMoverState } from "../../../hooks/widgetmover";
import {
	IHorizontalSnapLine,
	ISnapConfiguration,
	ISnapLine,
	IVerticalSnapLine,
	metaDb,
} from "../../../utils/db";
import { SNAPLINE_WIDTH } from "../snaplinerenderer/SnapLineRenderer";
import styles from "./styles.module.css";
import { applySnap } from "./utils";

const THRESHHOLD = 10;

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

const WidgetMoverWrapper = (props: any) => {
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
	const [boxPos, setBoxPos] = useState<{
		top?: number;
		right?: number;
		bottom?: number;
		left?: number;
		shiftX: boolean;
		shiftY: boolean;
	}>({ top: 0, left: 0, shiftX: false, shiftY: false });

	const setSnap = (snapPos: SnapPos, snapLine: ISnapLine) => {
		switch (snapPos) {
			case SnapPos.HTOP:
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
					top: pixToPercH((snapLine as IHorizontalSnapLine).top!! + SNAPLINE_WIDTH),
					shiftY: false,
				}));
				break;
			case SnapPos.HMID:
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
					top: pixToPercH((snapLine as IHorizontalSnapLine).top!! + SNAPLINE_WIDTH / 2),
					shiftY: true,
				}));
				break;
			case SnapPos.HBOTTOM:
				setSnapConfig((prev) => ({
					...prev,
					horizontal: {
						top: null,
						mid: null,
						bottom: snapLine.id,
						percentage: null,
					},
				}));
				setBoxPos((prev) => ({
					...prev,
					top: undefined,
					bottom: pixToPercH((snapLine as IHorizontalSnapLine).top!!),
					shiftY: false,
				}));
				break;

			case SnapPos.VLEFT:
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
					left: pixToPercW((snapLine as IVerticalSnapLine).left!! + SNAPLINE_WIDTH),
					shiftX: false,
				}));
				break;
			case SnapPos.VMID:
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
					left: pixToPercW((snapLine as IVerticalSnapLine).left!! + SNAPLINE_WIDTH / 2),
					shiftX: true,
				}));
				break;
			case SnapPos.VRIGHT:
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
					right: pixToPercW((snapLine as IVerticalSnapLine).left!!),
					shiftX: false,
				}));
				break;
		}
	};

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

	const onMouseMove = (e: any) => {
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
	};

	const onMouseDown = () => {
		if (!selectedWidget) {
			setSelectedWidget(props.id);
		}

		document.body.addEventListener("mousemove", onMouseMove);
		document.body.addEventListener("mouseup", onMouseUp);
	};

	const onMouseUp = () => {
		setSelectedWidget(null);
		document.body.removeEventListener("mousemove", onMouseMove);
		document.body.removeEventListener("mouseup", onMouseUp);
	};

	useEffect(() => {
		console.log(snapConfig);
	}, [snapConfig]);

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
