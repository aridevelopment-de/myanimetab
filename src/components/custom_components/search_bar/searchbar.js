import React from 'react';
import SearchSuggestions from './searchsuggestions';
import SearchIcon from '@mui/icons-material/Search';
import SearchEngineChooser from './searchenginechooser';
import './searchbar.css';
import SearchEngine from '../../../utils/searchengine';
import SuggestionCaller from '../../../utils/searchsuggestioncaller';
import EventHandler from '../../../utils/eventhandler';
import getUserSettings from '../../../utils/settings';
import CustomComponentRegistry from '../../../utils/customcomponentregistry';


const opacityValues = [1, 0, 0.7, 0.5, 0.3];
const verticalAlignValues = ["one", "two"];
const searchEngines = ["Google", "Bing", "Ecosia", "Yahoo", "DuckDuckGo", "Baidu", "Ask", "WolframAlpha"];


class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.onInputChange = this.onInputChange.bind(this);
        this.onInputBlur = this.onInputBlur.bind(this);
        this.onInputFocus = this.onInputFocus.bind(this);
        this.toggleSearchEngineChooser = this.toggleSearchEngineChooser.bind(this);

        this.state = {
            showing: getUserSettings().get("cc.searchbar.state"),
            position: getUserSettings().get("cc.searchbar.vertical_align"),
            focused: true,
            content: "",
            opacity: getUserSettings().get("cc.searchbar.state") ? 0 : 1,
            suggestions: [],
            searchEngine: getUserSettings().get("cc.searchbar.search_engine"),
            chooseSearchEngine: false
        };
    }
    
    componentDidMount() {
        EventHandler.listenEvent("blurall", "searchbar", (data) => {
            this.setState({
                opacity: data.blur ? getUserSettings().get("cc.searchbar.auto_hide") : (getUserSettings().get("cc.searchbar.state") ? 0 : 1)
            });
        });
        EventHandler.listenEvent("set.cc.searchbar.state", "searchbar", (data) => {
            this.setState({ showing: data.value });
        });
        EventHandler.listenEvent("set.cc.searchbar.vertical_align", "searchbar", (data) => {
            this.setState({ position: data.value });
        });
        EventHandler.listenEvent("set.cc.searchbar.search_engine", "searchbar", (data) => {
            this.setState({
                searchEngine: data.value,
                chooseSearchEngine: false
            });
        });
    }

    componentWillUnmount() {
        EventHandler.unlistenEvent("blurall", "searchbar");
        EventHandler.unlistenEvent("search_bar_state", "searchbar");
        EventHandler.unlistenEvent("set.cc.searchbar.vertical_align", "searchbar");
        EventHandler.unlistenEvent("set.cc.searchbar.search_engine", "searchbar");
    }

    onInputChange(e) {
        this.setState({
            content: e.target.value
        });

        if (this.state.content.length > 0) {
            SuggestionCaller.fetchSearchSuggestions(e.target.value, (data) => {            
                this.setState({
                    suggestions: data.suggestions.slice(0, 5)
                });
            });
        }
    }

    onInputBlur(e) {
        this.setState({
            focused: false
        });

        EventHandler.triggerEvent("searchbar_inputstate", {focus: false});
    }
    
    onInputFocus(e) {
        this.setState({
            focused: true
        });

        EventHandler.triggerEvent("searchbar_inputstate", {focus: true});
    }

    toggleSearchEngineChooser() {
        this.setState({
            chooseSearchEngine: !this.state.chooseSearchEngine
        })
    }

    render() {
        return (
            <div
                className={`search_bar__wrapper ${verticalAlignValues[this.state.position]}`}
                style={{
                    opacity: opacityValues[this.state.opacity],
                    display: this.state.showing ? 'unset' : 'none'
                }}    
            >
                <div className="search_bar">
                    <div className="search_bar__engine_container">
                        <div 
                            className="search_bar__engine_icon__container"
                            onClick={this.toggleSearchEngineChooser}
                        >
                            <img 
                                className="search_bar__engine_icon" 
                                src={`/icons/engines/${searchEngines[this.state.searchEngine].toLowerCase()}.png`} 
                                alt={searchEngines[this.state.searchEngine]} 
                            />
                        </div>
                        {this.state.chooseSearchEngine ? <SearchEngineChooser /> : null}
                    </div>
                    <input 
                        className="search_bar__input" 
                        onKeyUp={(e) => {if (e.keyCode === 13) { SearchEngine.search(e.target.value) }}} 
                        onInput={this.onInputChange} 
                        onBlur={this.onInputBlur} 
                        onFocus={this.onInputFocus} 
                        value={this.state.content} 
                        type="text" 
                        spellCheck="false" 
                        placeholder="Search" 
                        tabIndex="0" 
                        autoFocus 
                    />
                    <SearchIcon 
                        className="search_bar__icon" 
                        onClick={() => SearchEngine.search(this.state.content)} 
                    />
                </div>
                <SearchSuggestions 
                    suggestions={this.state.suggestions} 
                    showing={this.state.suggestions.length > 0 && this.state.content.length > 1 ? 'visible' : 'invisible'} 
                />
            </div>
        )
    }
}

CustomComponentRegistry.register(
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
)

export default SearchBar;