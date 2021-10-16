import React from 'react';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import './gallerysettingscomponent.css'

class WidgetSettingsComponent extends React.Component {
    constructor(props) {
        super(props);

        this.switchImage = this.switchImage.bind(this);

        // url, selected, id
        let images = [];

        for (let i = 0; i < 40; i++) {
            let r = Math.random() > .5;
            console.log(r);
            images.push(["https://picsum.photos/1080/720?random=" + i, r, i+1]);
        }

        this.state = {
            images: images
        };
    }

    switchImage(id) {
        for (let i = 0; i < this.state.images.length; i++) {
            if (this.state.images[i][2] === id) {
                let data = [...this.state.images];
                data[i][1] = !this.state.images[i][1];

                this.setState({
                    images: data
                });
                break;
            }
        }
    }

    render() {
        return (
            <div className="gallery_container">
                <div className="gallery_categories">

                </div>
                <div className="gallery_images">
                    {
                        this.state.images.map(e => (
                                <div class={`gallery_image ${e[1] ? 'selected' : ''}`}>
                                    <img src={e[0]} key={e[0]}/>
                                    <div onClick={() => this.switchImage(e[2])} class={`gallery_image_overlay ${e[1] ? 'selected' : ''}`}>
                                        <div class="gallery_image_overlay__button">
                                            { e[1] ? <CheckCircleOutlineIcon /> : <RadioButtonUncheckedIcon /> }
                                        </div>
                                    </div>
                                </div>
                                )
                            )
                    }
                </div>
            </div>
        )
    }
}

export default WidgetSettingsComponent;