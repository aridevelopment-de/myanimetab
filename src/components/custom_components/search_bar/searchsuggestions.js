import React from "react";
import SearchEngine from "../../../utils/searchengine";
import './searchsuggestion.css'

class SearchSuggestions extends React.Component {
    render() {
        return (
            <div className={`search_suggestions__wrapper ${this.props.showing}`}>
                <div className="search_suggestions">
                    {this.props.suggestions.map(element => 
                        <div 
                            className="search_suggestions__item__wrapper" 
                            key={element} 
                            onClick={(e) => SearchEngine.search(e.target.innerHTML)} 
                            tabIndex="0"
                        > 
                            <p>{element}</p>
                        </div>  
                    )}
                </div>
            </div>
        )
    }
}

export default SearchSuggestions;