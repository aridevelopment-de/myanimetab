import React from 'react';
import EventHandler from '../../../utils/eventhandler';
import getUserSettings from '../../../utils/settings';
import styles from './searchenginechooser.module.css';


const searchEngines = ["Google", "Bing", "Ecosia", "Yahoo", "DuckDuckGo", "Baidu", "Ask", "WolframAlpha"];

class SearchEngineChooser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedSearchEngine: getUserSettings().get("cc.searchbar.search_engine")
        }
    }

    componentDidMount() {
        EventHandler.listenEvent("set.cc.searchbar.search_engine", "search_engine_chooser", (data) => {
            this.setState({
                selectedSearchEngine: data.value
            });
        });
    }

    componentWillUnmount() {
        EventHandler.unlistenEvent("set.cc.searchbar.search_engine", "search_engine_chooser");
    }

    chooseEngine(index) {
        getUserSettings().set("cc.searchbar.search_engine", index);
    }

    render() {
        return (
            <div className={styles.container}>
                {searchEngines.map((searchEngine, index) => {
                    return (
                        <div 
                            className={`${styles.item} ${index === this.state.selectedSearchEngine ? styles.active : ''}`} 
                            key={index}
                            onClick={() => this.chooseEngine(index)}    
                        >
                            <div className={styles.icon}>
                                <img src={`/icons/engines/${searchEngine.toLowerCase()}.png`} alt={searchEngine} />
                            </div>
                            <div>{searchEngine}</div>
                        </div>
                    );
                })}
            </div>
        )
    }
}

export default SearchEngineChooser;