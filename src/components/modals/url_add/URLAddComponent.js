import getUserSettings from '../../../utils/settings';
import React from 'react';
import EventHandler from '../../../utils/eventhandler';
import styles from './urladdcomponent.module.css';

class URLAddComponent extends React.Component {
    constructor(props) {
        super(props);
        
        this.buttonClick = this.buttonClick.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.state = {
            url: ""
        }
    }
    
    buttonClick(shouldAdd) {
        EventHandler.triggerEvent("url_add_window_state", { opened: false });
        EventHandler.triggerEvent("playlist_refresh", {});

        if (shouldAdd) {
            let images = getUserSettings().get("images");
            images.push(this.state.url);
            getUserSettings().set("images", images);
        }
    }

    onInputChange(e) {
        this.setState({
            url: e.target.value
        });
    }

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.background}>
                    <div className={styles.url_add}>
                        <header>
                            <h2 className={styles.heading}>Add new Background</h2>
                        </header>
                        <div className={styles.content}>
                            <p id="hint">Recommended size: 1920x1080</p>
                            <input value={this.state.url} onInput={this.onInputChange}></input>
                        </div>
                        <div className={styles.footer}>
                            <button id={styles.cancel_button} onClick={() => this.buttonClick(false)}>Cancel</button>
                            <button id={styles.add_button} onClick={() => this.buttonClick(true)}>Add</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default URLAddComponent;