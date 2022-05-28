import React from "react";
import SearchEngine from "../../../utils/searchengine";
import styles from './searchsuggestion.module.css'

class SearchSuggestions extends React.Component {
    render() {
        return (
            <div className={`${styles.wrapper} ${this.props.showing ? '' : styles.invisible}`}>
                <div className={styles.suggestions}>
                    {this.props.suggestions.map(element => 
                        <div 
                            className={styles.item__wrapper}
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