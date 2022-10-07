import { useLiveQuery } from "dexie-react-hooks";
import { useSnapLineState } from "../../../hooks/widgetmover";
import { metaDb } from "../../../utils/db";

export const SnapLineRenderer = () => {
    const snapLines = useLiveQuery(() => metaDb.snapLines.toArray(), []);
    // do not remove glowLines as it serves for updating the component
    const [existsGlowSnapLine, glowLines] = useSnapLineState((state) => [state.existsGlowSnapLine, state.glownSnapLines]);
    
    if (!snapLines) return <></>;

    return (
        <>
            {snapLines.map((snapLine) => {
                let opacity = 0.3;

                if (existsGlowSnapLine(snapLine.id, snapLine.axis)) {
                    opacity = 1;
                }

                if (snapLine.axis === "horizontal") {
                    return (
                        <div
                            key={snapLine.id}
                            style={{
                                position: "absolute",
                                height: "5px",
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
                                width: "5px",
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