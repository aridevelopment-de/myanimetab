import React from "react";
import './playlistsettingscomponent.css';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import DeleteIcon from '@mui/icons-material/Delete';
import getUserSettings from '../../../utils/settings';
import EventHandler from '../../../utils/eventhandler';

function Image(props) {
    const onImageClick = () => {
        if (props.idx !== props.selectedIdx) {
            getUserSettings().set("selected_image", props.idx);
            EventHandler.triggerEvent("select_image", { idx: props.idx });
            EventHandler.triggerEvent("playlist_refresh", null);
        }
    }

    return (
        <div className={`image ${props.idx === props.selectedIdx ? 'selected' : ''}`} onClick={onImageClick}>
            <img src={props.url} alt={props.idx} />
            <div className="image_overlay">
                <div className="image_overlay__buttons">
                    <div className="image_overlay__button" onClick={() => props.resizeClickCallback(props.idx)}>
                        <FullscreenIcon />
                    </div>
                    <div className={`image_overlay__button ${props.idx === 0 ? 'disabled' : ''}`} onClick={() => {if (props.idx !== 0) { props.deleteClickCallback(props.idx) }}}>
                        <DeleteIcon />
                    </div>
                </div>
            </div>
        </div>
    );
}

class PlaylistSettingsComponent extends React.Component {
    constructor(props) {
        super(props);

        this.onResizeClick = this.onResizeClick.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.openURLAddWindow = this.openURLAddWindow.bind(this);

        this.state = {
            images: getUserSettings().get("images"),
            selectedIdx: getUserSettings().get("selected_image")
        };
    }

    componentDidMount() {
        EventHandler.listenEvent("playlist_refresh", "playlist_settings", () => {
            this.setState({
                images: getUserSettings().get("images"),
                selectedIdx: getUserSettings().get("selected_image")
            }) 
        });
    }

    componentWillUnmount() {
        EventHandler.unlistenEvent("playlist_refresh", "playlist_settings");
    }

    onResizeClick(idx) {
        EventHandler.triggerEvent("full_screen_image", { url: this.state.images[idx] });
    }

    onDeleteClick(idx) {
        let images = getUserSettings().get("images");
        images.splice(idx, 1);
        getUserSettings().set("images", images);
        
        this.setState({
            images: images
        });
    }

    openURLAddWindow() {
        EventHandler.triggerEvent("url_add_window", {open: true});
    }

    render() {
        return (
            <div className="playlist__container">
                <div className="images">
                    {this.state.images.map((image, index) => <Image url={image} key={index} idx={index} selectedIdx={this.state.selectedIdx} resizeClickCallback={this.onResizeClick} deleteClickCallback={this.onDeleteClick} />)}
                    
                    <div className="dragdrop__container">
                        <div className="dragdrop" onClick={this.openURLAddWindow}>
                            <div className="dragdrop__text">
                                <p>+</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PlaylistSettingsComponent;