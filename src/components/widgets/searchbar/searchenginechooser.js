import React from 'react';
import styles from './searchenginechooser.module.css';
import { useSetting } from '../../../utils/eventhooks';

const searchEngines = ["Google", "Bing", "Ecosia", "Yahoo", "DuckDuckGo", "Baidu", "Ask", "WolframAlpha"];

function SearchEngineChooser(props) {
    const [ selectedSearchEngine, setSelectedSearchEngine ] = useSetting("cc.searchbar.search_engine", "search_engine_chooser");

    return (
        <div className={styles.container}>
            {searchEngines.map((searchEngine, index) => {
                return (
                    <div 
                        className={`${styles.item} ${index === selectedSearchEngine ? styles.active : ''}`} 
                        key={index}
                        onClick={() => setSelectedSearchEngine(index)}>
                        <div className={styles.icon}>
                            <img src={`/icons/engines/${searchEngine?.toLowerCase()}.png`} alt={searchEngine} />
                        </div>
                        <div>{searchEngine}</div>
                    </div>
                );
            })}
        </div>
    )
}

export default SearchEngineChooser;