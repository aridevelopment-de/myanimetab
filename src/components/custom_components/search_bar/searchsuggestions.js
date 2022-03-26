import React from "react";
import SearchEngine from "../../../utils/searchengine";
import './searchsuggestion.css'

class SearchSuggestions extends React.Component {
    constructor(props) {
        super(props);

        this.onItemClick = this.onItemClick.bind(this);
    }

    onItemClick(e) {
        SearchEngine.search(e.target.innerHTML);
    }

    render() {
        return (
            <div className={`search_suggestions__wrapper ${this.props.showing}`}>
                <div className="search_suggestions">
                    {this.props.suggestions.map(element => 
                        <div className="search_suggestions__item__wrapper" key={element} onClick={this.onItemClick} tabIndex="0"> 
                            <p> {element} </p>
                        </div>  
                    )}
                </div>
            </div>
        )
    }
}

export default SearchSuggestions;