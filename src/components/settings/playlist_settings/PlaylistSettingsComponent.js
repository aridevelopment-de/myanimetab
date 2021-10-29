import React from "react";
import './playlistsettingscomponent.css';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ZoomInIcon from '@mui/icons-material/ZoomIn';


class PlaylistSettingsComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="playlist__container">
                <div className="images">
                    <div className="image selected">
                        <img src="https://cdn.discordapp.com/attachments/901056399348473896/901056442730168351/bg-26.jpg" />
                        <div className="image_overlay">
                            <HighlightOffIcon />
                            <ZoomInIcon />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PlaylistSettingsComponent;