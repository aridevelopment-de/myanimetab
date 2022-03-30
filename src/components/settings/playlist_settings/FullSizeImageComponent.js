import React from "react"
import CloseIcon from '@mui/icons-material/Close';
import './fullsizedimagecomponent.css';
import EventHandler from "../../../utils/eventhandler";


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
            <div className="zoomed_image__container">
                <div className="zoomed_image">
                    <div className="zoomed_image__image">
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