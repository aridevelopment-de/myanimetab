import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useEvent, useSetting } from '../../../utils/eventhooks';
import SearchEngine from '../../../utils/searchengine';
import SuggestionCaller from '../../../utils/searchsuggestioncaller';
import getUserSettings from '../../../utils/settings';
import styles from './searchbar.module.css';
import SearchEngineChooser from './searchenginechooser';
import SearchSuggestions from './searchsuggestions';


const opacityValues = [1, 0, 0.7, 0.5, 0.3];
const verticalAlignValues = [styles.one, styles.two];
const searchEngines = ["Google", "Bing", "Ecosia", "Yahoo", "DuckDuckGo", "Baidu", "Ask", "WolframAlpha"];


function SearchBar(props) {
    const [ position, _1 ] = useSetting("cc.searchbar.vertical_align", "searchbar");
    const [ searchEngine, _2 ] = useSetting("cc.searchbar.search_engine", "searchbar");
    const [ modalChooseEngine, setModalChooseEngine ] = useState(false);
    const [ suggestions, setSuggestions ] = useState([]);
    const [ opacity, setOpacity ] = useState(0);
    const [ content, setContent ] = useState("");

    useEvent("blurall", "searchbar", 1, (data) => setOpacity(data.blur ? getUserSettings().get("cc.searchbar.auto_hide") : 0));

    return (
        <div
            className={`${styles.wrapper} ${verticalAlignValues[position]}`}
            style={{
                opacity: opacityValues[opacity]
            }}>
            <div className={styles.searchbar}>
                <div>
                    <div 
                        className={styles.engine_icon__container}
                        onClick={() => setModalChooseEngine(!modalChooseEngine)}>
                        <img 
                            className={styles.engine_icon} 
                            src={`/icons/engines/${searchEngines[searchEngine]?.toLowerCase()}.png`} 
                            alt={searchEngines[searchEngine]} />
                    </div>
                    {modalChooseEngine ? <SearchEngineChooser /> : null}
                </div>
                <input 
                    className={styles.input} 
                    onKeyUp={(e) => {if (e.keyCode === 13) { SearchEngine.search(e.target.value) }}} 
                    onInput={(event) => {
                        setContent(event.target.value)

                        if (event.target.value.length > 1) {
                            SuggestionCaller.fetchSearchSuggestions(event.target.value, (data) => {
                                setSuggestions(data.suggestions.slice(0, 5))
                            });
                        }
                    }} 
                    onBlur={(e) => e.target.setAttribute("readonly", "readonly")} 
                    onFocus={(e) => e.target.removeAttribute("readonly")}
                    value={content} 
                    type="text" 
                    spellCheck="false" 
                    placeholder="Search" 
                    autoComplete="off"
                    tabIndex="0" 
                    readOnly
                    autoFocus />
                <SearchIcon 
                    className={styles.icon} 
                    onClick={() => SearchEngine.search(content)} />
            </div>
            <SearchSuggestions 
                suggestions={suggestions} 
                showing={suggestions.length > 0 && content.length > 1} />
        </div>
    )
}

/* CustomComponentRegistry.register(
    "searchbar",
    <SearchBar />,
    {
        shouldRegister: true,
        author: "aridevelopment.de", 
        description: "Helps you searching through the internet"
    },
    {
        "name": "Search Bar",
        "id": "searchbar",
        "option": {
            "type": "toggle",
            "default": true
        },
        "content": [
            {
                "name": "Search Engine",
                "id": "search_engine",
                "type": "dropdown",
                "values": searchEngines,
                "displayedValues": ["Google", "Bing", "Ecosia", "Yahoo", "DuckDuckGo", "Baidu", "Ask", "WolframAlpha"]
            },
            {
                "name": "Open With",
                "id": "open_with",
                "type": "dropdown",
                "values": ["Current Tab", "New Tab"],
                "displayedValues": ["Current Tab", "New Tab"]
            },
            {
                "name": "When Autohiding",
                "id": "auto_hide",
                "type": "dropdown",
                "values": opacityValues,
                "displayedValues": ["Show", "Hide", "Opacity 0.7", "Opacity 0.5", "Opacity 0.3"]
            },
            {
                "name": "Vertical Alignment",
                "id": "vertical_align",
                "type": "dropdown",
                "values": verticalAlignValues,
                "displayedValues": ["Screen top", "Upper half"]
            }
        ]
    }
) */

export default SearchBar;