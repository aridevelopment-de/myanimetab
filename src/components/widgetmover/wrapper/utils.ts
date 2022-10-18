import { IHorizontalSnapLine, ISnapLine, IVerticalSnapLine } from "../../../utils/db";
import { SNAPLINE_WIDTH } from '../snaplinerenderer/SnapLineRenderer';

export const THRESHHOLD = 20;

export const applySnap = (
	snapXRel: number,
	snapYRel: number,
	availableSnapLines: ISnapLine[]
): [[IVerticalSnapLine, number][], [IHorizontalSnapLine, number][]] => {
	/* const snapYRel = boxTop;
  const snapXRel = boxLeft; */
	
	const snapLines: ISnapLine[] = availableSnapLines.filter((snapLine) => {
		if (snapLine.axis === "horizontal") {
			if (!snapLine.top)
				throw new Error("Snapline wrong data!");
			
			let yDist = Math.abs(snapLine.top + SNAPLINE_WIDTH / 2 - snapYRel);
			return yDist < THRESHHOLD;
		} else if (snapLine.axis === "vertical") {
			if (!snapLine.left)
				throw new Error("Snapline wrong data!");

			let xDist = Math.abs(snapLine.left + SNAPLINE_WIDTH / 2 - snapXRel);
			return xDist <= THRESHHOLD;
		}

		return false;
	});

  // @ts-ignore
	const verticalSnapLines: [IVerticalSnapLine, number][] = snapLines
		.filter((snapLine: ISnapLine) => snapLine.axis === "vertical")
		.map((snapLine: ISnapLine) => [snapLine, snapXRel]);
  // @ts-ignore
	const horizontalSnapLines: [IHorizontalSnapLine, number][] = snapLines
		.filter((snapLine: ISnapLine) => snapLine.axis === "horizontal")
		.map((snapLine: ISnapLine) => [snapLine, snapYRel]);

	return [verticalSnapLines, horizontalSnapLines];
};
