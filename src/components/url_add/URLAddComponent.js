import Settings from '../../utils/settings';
import React from 'react';
import EventHandler from '../../utils/eventhandler';
import './urladdcomponent.css';

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
        EventHandler.triggerEvent("url_add_window", { open: false });
        EventHandler.triggerEvent("playlist_refresh", {});

        if (shouldAdd) {
            let images = Settings.get("images");
            images.push(this.state.url);
            Settings.set("images", images);
        }
    }

    onInputChange(e) {
        this.setState({
            url: e.target.value
        });
    }

    render() {
        return (
            <div className="url_add__container">
                <div className="url_add__background">
                    <div className="url_add">
                        <header>
                            <h2 className="url_add__heading">Add new Background</h2>
                        </header>
                        <div className="url_add__content">
                            <p id="url_add__hint">Recommended size: 1920x1080</p>
                            <input value={this.state.url} onInput={this.onInputChange}></input>
                        </div>
                        <div className="url_add__footer">
                            <button id="url_add__cancel_btn" onClick={() => this.buttonClick(false)}>Cancel</button>
                            <button id="url_add__add_btn" onClick={() => this.buttonClick(true)}>Add</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default URLAddComponent;