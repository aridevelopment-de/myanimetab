import React from "react";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import DeleteIcon from '@mui/icons-material/Delete';
import getUserSettings from '../../../utils/settings';
import EventHandler from '../../../utils/eventhandler';
import styles from './playlistsettingscomponent.module.css';
import image_styles from './imagestyles.module.css';


function Image(props) {
    const onImageClick = () => {
        if (props.idx !== props.selectedIdx) {
            getUserSettings().set("selected_image", props.idx);
            EventHandler.triggerEvent("select_image", { idx: props.idx });
            EventHandler.triggerEvent("playlist_refresh", null);
        }
    }

    return (
        <div className={`${image_styles.image} ${props.idx === props.selectedIdx ? image_styles.selected : ''}`} onClick={onImageClick}>
            <img src={props.url} alt={props.idx} />
            <div>
                <div className={image_styles.overlay_buttons}>
                    <div 
                        className={image_styles.overlay__button} 
                        onClick={() => props.resizeClickCallback(props.idx)}
                    >
                        <FullscreenIcon />
                    </div>
                    <div 
                        className={`${image_styles.overlay__button} ${props.disabled === true ? image_styles.disabled : ''}`} 
                        onClick={() => {if (props.disabled === false) { props.deleteClickCallback(props.idx) }}}
                    >
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
        EventHandler.triggerEvent("full_screen_image_window_state", { url: this.state.images[idx] });
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
        EventHandler.triggerEvent("url_add_window_state", {opened: true});
    }

    render() {
        return (
            <div>
                <div className={styles.images}>
                    {
                        this.state.images.map((image, index) => {
                            return <Image 
                                url={image} 
                                key={index} 
                                idx={index} 
                                disabled={index === 0 && this.state.images.length === 1}
                                selectedIdx={this.state.selectedIdx} 
                                resizeClickCallback={this.onResizeClick} 
                                deleteClickCallback={this.onDeleteClick} 
                            />
                        })
                    }
                    
                    <div className={styles.dragdrop__container}>
                        <div 
                            className={styles.dragdrop} 
                            onClick={this.openURLAddWindow}
                        >
                            <div className={styles.dragdrop__text}>
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