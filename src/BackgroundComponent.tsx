/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLiveQuery } from "dexie-react-hooks";
import React, { useEffect, useState } from "react";
import styles from './App.module.css';
import { metaDb, useMeta, widgetsDb } from "./utils/db";
import EventHandler from "./utils/eventhandler";
import { useSetting } from "./utils/eventhooks";
import TimeUtils from "./utils/timeutils";


const blurValues = [5, 10, 30, 60, 300];
const switchValues = [null, 10, 60, 120, 300, 600, 1800, 3600];
const playlistOrderValues = ["Ordered", "Shuffled"];

function Background(props: any) {
    const [ blur, setBlur ] = useState(false);
    const [ lastAction, setLastAction ] = useState(TimeUtils.getSeconds(new Date()));
    const [ currentBackgroundUrl, setCurrentBackgroundUrl ] = useState("");
    const currentBackgroundIdx = useMeta("selected_image", (idx: number) => {
        metaDb.getMeta("images").then((images: string[]) => setCurrentBackgroundUrl(images[idx]));
    });
    const [ whenWallpaperSwitch, _1 ] = useSetting("wallpaper-0", "when_switch");
    const [ shouldWallpaperSwitch, _2 ] = useSetting("wallpaper-0", "state");
    const [ autoHideTimeLapse, _3 ] = useSetting("autohide-0", "time_lapse");
    const [ shouldAutoHide, _4 ] = useSetting("autohide-0", "state");

    const nextImage = () => {        
        widgetsDb.getSetting("wallpaper-0", "playlist_order").then((value: number) => {
            const playlistOrder: string = playlistOrderValues[value];

            metaDb.getMeta("images").then((images: string[]) => {
                if (images.length >= 1) {
                    if (playlistOrder === "Ordered") {
                        let idx = currentBackgroundIdx || 0;                        
                        idx = (idx + 1) % images.length;
                        metaDb.setMeta("selected_image", idx);
                    } else if (playlistOrder === "Shuffled") {
                        const idx = Math.floor(Math.random() * images.length);
                        metaDb.setMeta("selected_image", idx);
                    }
                }
            })
        });
    }

    EventHandler.on("skip_image", "background", nextImage);
    EventHandler.on("select_image", "background", (data: {idx: number}) => {
        metaDb.setMeta("selected_image", data.idx);
        console.log(data.idx);
    });
    
    // Background switch interval
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        const switchInterval: number | null = switchValues[whenWallpaperSwitch];
        
        if (shouldWallpaperSwitch) {
            if (switchInterval !== null) {
                interval = setInterval(nextImage, 1000 * switchInterval || 60000);
            }

            return () => clearInterval(interval);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [whenWallpaperSwitch, shouldWallpaperSwitch]);

    // Blur interval
    useEffect(() => {
        if (shouldAutoHide) {
            let interval = setInterval(() => {
                const now = TimeUtils.getSeconds(new Date());
                const diff = now - lastAction;
        
                if (diff > blurValues[autoHideTimeLapse]) {
                    setBlur(true);
                } else if (blur) {
                    setBlur(false);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoHideTimeLapse, shouldAutoHide]);

    const resetLastAction = (_e: any) => {
        if (blur) {
            setBlur(false);
        }

        setLastAction(TimeUtils.getSeconds(new Date()));
    }

    return (
        <div className={styles.background}
            style={{backgroundImage: `url(${currentBackgroundUrl})`}}
            onMouseMove={resetLastAction}
            onMouseDown={resetLastAction}>
            {props.children}
{/*             {React.cloneElement(props.children, { blur })}
 */}        </div>
    );
}

export default Background;