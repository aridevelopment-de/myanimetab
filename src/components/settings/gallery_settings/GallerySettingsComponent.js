import React from 'react';
import axios from 'axios';
import Settings from '../../../utils/settings';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import './gallerysettingscomponent.css'

class WidgetSettingsComponent extends React.Component {
    constructor(props) {
        super(props);

        this.switchImage = this.switchImage.bind(this);
        this.switchPage = this.switchPage.bind(this);
        this.switchCategory = this.switchCategory.bind(this);
        this.fetchCategories = this.fetchCategories.bind(this);
        this.fetchImages = this.fetchImages.bind(this);
        
        this.state = {
            images: {'loading...': [['loading...']]}, // Cached urls
            selectedCategory: 'loading...',
            selectedPage: 0,
            pageCount: 5
        };
    }

    componentDidMount() {
        this.fetchCategories(this.fetchImages);
    }

    fetchCategories(callback) {
        axios.get(Settings.get('apiserver') + "images/categories")
            .then(response => {
                let o = {};

                for (let cat of response.data.categories) {
                    o[cat] = [[]];
                }

                this.setState({
                    images: o,
                    selectedCategory: response.data.categories[0]
                }, callback);
            });
    }

    fetchImages() {
        // url, selected, id
        if (this.state.images[this.state.selectedCategory] !== undefined) {
            if (this.state.images[this.state.selectedCategory].length > 0) {
                if (this.state.images[this.state.selectedCategory][this.state.selectedPage].length !== undefined) {
                    if (this.state.images[this.state.selectedCategory][this.state.selectedPage].length > 0) {
                        return;
                    }
                }
            }
        }

        axios.get(Settings.get('apiserver') + "images/" + this.state.selectedCategory + "?page=" + (this.state.selectedPage + 1))
            .then(response => {
                let pageCount = response.data.pages;

                let images = [];
                for (let i = 0; i < response.data.images.length; i++) {
                    images.push([
                        Settings.get('apiserver').substr(0, Settings.get('apiserver').length - 1) + response.data.images[i],
                        false, // TODO: check if selected,
                        i
                    ])
                }

                let wholeData = JSON.parse(JSON.stringify(this.state.images));

                for (let key of Object.keys(wholeData)) {
                    for (let j = 0; j < pageCount; j++) {
                        wholeData[key].push([]);
                    }
                }

                wholeData[this.state.selectedCategory][this.state.selectedPage] = images;
                
                this.setState({
                    images: wholeData,
                    pageCount: pageCount
                });
            })
    }

    switchImage(id) {
        let category =  this.state.selectedCategory;
        let page = this.state.selectedPage;

        for (let i = 0; i < this.state.images[category][page].length; i++) {
            if (this.state.images[category][page][i][2] === id) {
                let wholeData = JSON.parse(JSON.stringify(this.state.images));
                
                wholeData[category][page][i][1] = !this.state.images[category][page][i][1];

                this.setState({
                    images: wholeData
                });
                break;
            }
        }
    }

    switchCategory(name) {
        this.setState({
            selectedCategory: name,
            selectedPage: 0
        }, this.fetchImages);
    }

    switchPage(newPage) {
        this.setState({
            selectedPage: newPage
        }, this.fetchImages);
    }

    render() {
        return (
            <div className="gallery_container">
                <div className="gallery_categories">
                    {
                        Object.keys(this.state.images).map(e => (
                            <div className={`gallery_category ${e === this.state.selectedCategory ? 'selected' : ''}`} key={e} onClick={() => this.switchCategory(e)}>
                                <p> {e} </p>    
                            </div>
                        ))
                    }
                </div>
                <div className="gallery_images">
                    {
                        this.state.images[this.state.selectedCategory][this.state.selectedPage].map(e => (
                                <div className={`gallery_image ${e[1] ? 'selected' : ''}`} key={e[0]}>
                                    <img src={e[0]} alt={this.state.selectedCategory + "-" + e[0]}/>
                                    <div onClick={() => this.switchImage(e[2])} className={`gallery_image_overlay ${e[1] ? 'selected' : ''}`}>
                                        <div className="gallery_image_overlay__button">
                                            { e[1] ? <CheckCircleOutlineIcon /> : <RadioButtonUncheckedIcon /> }
                                        </div>
                                    </div>
                                </div>
                                )
                            )
                    }
                </div>
                <div className="pages">
                    {
                        Array.from(Array(this.state.pageCount).keys()).map(e => 
                            <div className={`page ${this.state.selectedPage == e ? 'selected' : ''}`} onClick={() => this.switchPage(e)} key={e+1}>
                                <p> {e+1} </p>
                            </div>
                            )
                    }
                </div>
            </div>
        )
    }
}

export default WidgetSettingsComponent;