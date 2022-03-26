import React from 'react';
import SearchSuggestions from './searchsuggestions';
import SearchIcon from '@mui/icons-material/Search';
import './searchbar.css';
import SearchEngine from '../../../utils/searchengine';
import SuggestionCaller from '../../../utils/searchsuggestioncaller';
import EventHandler from '../../../utils/eventhandler';
import getUserSettings from '../../../utils/settings';
import CustomComponentRegistry from '../../../utils/customcomponentregistry';


const opacityValues = [1, 0, 0.7, 0.5, 0.3];
const verticalAlignValues = ["one", "two", "three", "four"];


export default class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.onInputChange = this.onInputChange.bind(this);
        this.onInputBlur = this.onInputBlur.bind(this);
        this.onInputFocus = this.onInputFocus.bind(this);

        this.state = {
            showing: getUserSettings().get("cc.searchbar"),
            position: getUserSettings().get("cc.searchbar.vertical_align"),
            focused: true,
            content: "",
            opacity: getUserSettings().get("cc.searchbar") ? 0 : 1,
            suggestions: []
        };
    }

    register() {
        CustomComponentRegistry.register(
            "searchbar",
            <SearchBar />,
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
                        "values": ["Google", "Bing", "Ecosia", "Yahoo", "DuckDuckGo", "Baidu", "Ask", "WolframAlpha"],
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
                        "displayedValues": ["1/4", "2/4", "3/4", "4/4"]
                    }
                ]
            }
        )
    }

    componentDidMount() {
        EventHandler.listenEvent("blurall", "searchbar", (data) => {
            this.setState({
                opacity: data.blur ? getUserSettings().get("cc.searchbar.auto_hide") : (getUserSettings().get("cc.searchbar") ? 0 : 1)
            });
        });
        EventHandler.listenEvent("set.cc.searchbar", "searchbar", (data) => {
            this.setState({ showing: data.value });
        });
        EventHandler.listenEvent("set.cc.searchbar.vertical_align", "searchbar", (data) => {
            this.setState({ position: data.value });
        })
    }

    componentWillUnmount() {
        EventHandler.unlistenEvent("blurall", "searchbar");
        EventHandler.unlistenEvent("search_bar_state", "searchbar");
        EventHandler.unlistenEvent("set.cc.searchbar.vertical_align", "searchbar");
    }

    onInputChange(e) {
        this.setState({
            content: e.target.value
        });

        if (this.state.content.length > 0) {
            SuggestionCaller.fetchSearchSuggestions(e.target.value, (data) => {            
                this.setState({
                    suggestions: data[1].slice(0, 5).map((data) => data[0])
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

    render() {
        return (
            <div className={`search__wrapper ${this.state.showing ? 'visible' : 'invisible'}`}
                 style={{opacity: opacityValues[this.state.opacity]}}>
                <div className={`search_bar__wrapper ${verticalAlignValues[this.state.position]}`}>
                    <div className="search_bar">
                        <input className="search_bar__input" onKeyUp={(e) => {if (e.keyCode === 13) { SearchEngine.search(e.target.value) }}} onInput={this.onInputChange} onBlur={this.onInputBlur} onFocus={this.onInputFocus} value={this.state.content} type="text" spellCheck="false" placeholder="Search" tabIndex="0" autoFocus />
                        <SearchIcon className="search_bar__icon" onClick={() => SearchEngine.search(this.state.content)} />
                    </div>
                    <SearchSuggestions suggestions={this.state.suggestions} showing={this.state.focused && this.state.content.length > 1 ? 'visible' : 'invisible'} />
                </div>
            </div>
        )
    }
}
