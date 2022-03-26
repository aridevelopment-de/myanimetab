import React from "react";
import TimeUtils from "./utils/timeutils";
import EventHandler from "./utils/eventhandler";
import CustomComponentRegistry from "./utils/customcomponentregistry";
import getUserSettings from "./utils/settings";


const blurValues = [5, 10, 30, 60, 300];
const switchValues = [null, 10, 60, 120, 300, 600, 1800, 3600];
const playlistOrderValues = ["Ordered", "Shuffled"];

class Background extends React.Component {
    constructor(props) {
        super(props);

        this.resetLastAction = this.resetLastAction.bind(this);
        this.switchBackground = this.switchBackground.bind(this);
        this.startBlurInterval = this.startBlurInterval.bind(this);
        this.startBackgroundInterval = this.startBackgroundInterval.bind(this);
        
        this.registerSettings();

        this.state = {
            blur: false,
            blurIntervalId: undefined,
            backgroundIntervalId: undefined,
            lastAction: TimeUtils.getSeconds(new Date()),
            searchbarFocus: false,
            currentBackground: getUserSettings().get("images")[getUserSettings().get("selected_image")]
        }
    }

    registerSettings() {
        CustomComponentRegistry.registerNonComponent(
            "wallpaper",
            {
                "name": "Switch Wallpaper",
                "id": "wallpaper",
                "option": {
                    "type": "toggle",
                    "default": true
                },
                "content": [
                    {
                        "name": "When to switch",
                        "id": "when_switch",
                        "type": "dropdown",
                        "values": switchValues,
                        "displayedValues": [
                            "Only on Page Visit",
                            "Every 10 seconds",
                            "Every minute", "Every 2 minutes", "Every 5 minutes", "Every 10 minutes", "Every 30 minutes", 
                            "Every hour"
                        ]
                    },
                    {
                        "name": "Playlist Order",
                        "id": "playlist_order",
                        "type": "dropdown",
                        "values": playlistOrderValues,
                        "displayedValues": ["Ordered", "Shuffled"]
                    }
                ]
            }
        );

        CustomComponentRegistry.registerNonComponent(
            "auto_hide",
            {
                "name": "Auto Hide",
                "id": "auto_hide",
                "option": {
                    "type": "toggle",
                    "default": true
                },
                "content": [
                    {
                        "name": "Time Lapse",
                        "id": "time_lapse",
                        "type": "dropdown",
                        "values": blurValues,
                        "displayedValues": ["5 s", "10 s", "30 s", "1 min", "5 min"]
                    }
                ]
            },
        );
    }

    resetLastAction(e) {
        if (this.state.blur) {
            EventHandler.triggerEvent("blurall", { blur: false });
            this.setState({ blur: false });
        }
    
        this.setState({
            lastAction: TimeUtils.getSeconds(new Date())
        });
    }

    switchBackground() {
        if (playlistOrderValues[getUserSettings().get("cc.wallpaper.playlist_order")] === "Ordered") {
            let idx = getUserSettings().get("selected_image");
            idx = (idx + 1) % getUserSettings().get("images").length;
            getUserSettings().set("selected_image", idx);
            
            return idx;
        } else if (playlistOrderValues[getUserSettings().get("cc.wallpaper.playlist_order")] === "shuffled") {
            let idx = Math.floor(Math.random() * getUserSettings().get("images").length);
            getUserSettings().set("selected_image", idx);
            
            return idx;
        }
    }

    startBlurInterval() {
        this.setState({
            blurIntervalId: setInterval(() => {
                if (this.state.searchbarFocus === false && TimeUtils.getSeconds(new Date()) - blurValues[getUserSettings().get("cc.auto_hide.time_lapse")] > this.state.lastAction) {
                    if (!this.state.blur) {
                        EventHandler.triggerEvent("blurall", { blur: true });
                        this.setState({ blur: true });
                    }
                } else if (this.state.blur) {
                    EventHandler.triggerEvent("blurall", { blur: false });
                    this.setState({ blur: false });
                }
            }, 1000)
        });
    }

    startBackgroundInterval() {
        this.setState({
            backgroundIntervalId: setInterval(() => {
                if (playlistOrderValues[getUserSettings().get("cc.wallpaper.playlist_order")] === "Ordered") {
                    this.setState({
                        currentBackground: getUserSettings().get("images")[this.switchBackground()]
                    });
                }
            }, 1000 * switchValues[getUserSettings().get("cc.wallpaper.when_switch")] || 60000)
        });
    }

    componentDidMount() {
        EventHandler.listenEvent("set.cc.auto_hide", "background", (data) => {
            if (this.state.blurIntervalId != null) {
                clearInterval(this.state.blurIntervalId);
            }

            if (data.value) {
                this.startBlurInterval();
            }
        })

        EventHandler.listenEvent("set.cc.auto_hide.time_lapse", "background", (data) => {
            if (this.state.blurIntervalId != null) {
                clearInterval(this.state.blurIntervalId);
            }

            if (getUserSettings().get("cc.auto_hide")) {
                this.startBlurInterval();
            }
        })

        EventHandler.listenEvent("set.cc.wallpaper", "background", (data) => {
            if (this.state.backgroundIntervalId != null) {
                clearInterval(this.state.backgroundIntervalId);
            }
            
            if (data.value) {
                this.startBackgroundInterval();
            }
        });

        EventHandler.listenEvent("set.cc.wallpaper.when_switch", "background", (data) => {
            if (this.state.backgroundIntervalId != null) {
                clearInterval(this.state.backgroundIntervalId);
            }

            if (getUserSettings().get("cc.wallpaper")) {
                this.startBackgroundInterval();
            }
        })

        EventHandler.listenEvent("searchbar_inputstate", "background", (data) => {
            this.setState({
                searchbarFocus: data.focus,
                lastAction: TimeUtils.getSeconds(new Date())
            });
        });

        EventHandler.listenEvent("skip_image", "background", () => {
            this.setState({
                currentBackground: getUserSettings().get("images")[this.switchBackground()]
            });
        })

        EventHandler.listenEvent("select_image", "background", (data) => {
            this.setState({
                currentBackground: getUserSettings().get("images")[data.idx]
            });
        });

        if (getUserSettings().get("cc.auto_hide") === true) {
            this.startBlurInterval();
        }
  
        if (getUserSettings().get("cc.wallpaper") === true) {
            if (switchValues[getUserSettings().get("cc.wallpaper.when_switch")] != null) {
                this.startBackgroundInterval();
            } else {
                this.setState({
                    currentBackground: getUserSettings().get("images")[this.switchBackground()]
                });
            }
        }
    }

    componentWillUnmount() {
        if (this.blurIntervalId !== undefined) {
            clearInterval(this.state.blurIntervalId);
        }
    
        if (this.backgroundIntervalId !== undefined) {
            clearInterval(this.state.backgroundIntervalId);
        }

        EventHandler.unlistenEvent("searchbar_inputstate", "background");
        EventHandler.unlistenEvent("skip_image", "background");
        EventHandler.unlistenEvent("select_image", "background");
        EventHandler.unlistenEvent("set.cc.wallpaper", "background");
        EventHandler.unlistenEvent("set.cc.wallpaper.when_switch", "background");
    }

    render() {
        return (
            <div className="background"
                style={{backgroundImage: `url(${this.state.currentBackground})`}}
                onMouseMove={this.resetLastAction}
                onMouseDown={this.resetLastAction}
                >
                {this.props.children}
            </div>
        );
    }
}

export default Background;