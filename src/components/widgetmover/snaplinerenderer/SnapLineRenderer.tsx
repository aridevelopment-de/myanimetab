import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { useSnapLineState } from "../../../hooks/widgetmover";
import { ISnapLine, metaDb } from "../../../utils/db";
import { EventType } from "../../../utils/eventhandler";
import { useEvent } from "../../../utils/eventhooks";

export const SNAPLINE_WIDTH = 3;

export const SnapLineRenderer = () => {
    const queriedSnapLines = useLiveQuery(() => metaDb.snapLines.toArray(), []);
    const [snapLines, setSnapLines] = useState<ISnapLine[]>([]);
    // do not remove glowLines as it serves for updating the component
    const [existsGlowSnapLine, glowLines] = useSnapLineState((state) => [state.exists, state.glown]);
    
    useEvent(EventType.UPDATE_SNAPLINE, "snapline_renderer", null, (data: {snapId: number; axis: "horizontal" | "vertical"; percentage: number}) => {
        // rerender this component
        metaDb.snapLines.toArray().then(setSnapLines);
    });

    useEffect(() => {
        if (queriedSnapLines) {
            setSnapLines(queriedSnapLines);
        }
    }, [queriedSnapLines]);

    if (!snapLines) return <></>;

    return (
        <>
            {snapLines.map((snapLine) => {
                let opacity = existsGlowSnapLine(snapLine.id) ? 1 : 0.3;

                if (snapLine.axis === "horizontal") {
                    return (
                        <div
                            key={snapLine.id}
                            style={{
                                position: "absolute",
                                height: `${SNAPLINE_WIDTH}px`,
                                width: "100%",
                                opacity: opacity,
                                top: `${snapLine.top}%` || undefined,
                                bottom: `${snapLine.bottom}%` || undefined,
                                pointerEvents: "none",
                                zIndex: 1000,
                                backgroundColor: "red",
                                boxShadow: opacity === 1 ? "0px 0px 10px red" : undefined,
                            }}
                        />
                    );
                } else if (snapLine.axis === "vertical") {
                    return (
                        <div
                            key={snapLine.id}
                            style={{
                                position: "absolute",
                                width: `${SNAPLINE_WIDTH}px`,
                                height: "100%",
                                opacity: opacity,
                                left: `${snapLine.left}%` || undefined,
                                right: `${snapLine.right}%` || undefined,
                                pointerEvents: "none",
                                zIndex: 1000,
                                backgroundColor: "red",
                                boxShadow: opacity === 1 ? "0px 0px 10px red" : undefined,
                            }}
                        />
                    );
                }

                return null;
            })}
        </>
    );
}