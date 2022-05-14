import React from "react"
import CloseIcon from '@mui/icons-material/Close';
import EventHandler from "../../../utils/eventhandler";
import styles from './fullsizedimagecomponent.module.css';


class ZoomedImage extends React.Component {
    constructor(props) {
        super(props);

        this.onImageClose = this.onImageClose.bind(this);
    }

    onImageClose() {
        EventHandler.triggerEvent("full_screen_image_window_state", { url: null });
    }

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.inner}>
                    <div className={styles.image}>
                        <img src={this.props.url} alt="" />
                        <footer className="zoomed_image__footer">
                            <button onClick={this.onImageClose}>
                                <CloseIcon />
                            </button>    
                        </footer>
                    </div>
                </div>
            </div>
        )
    }
}

export default ZoomedImage;