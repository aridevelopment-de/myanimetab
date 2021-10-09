import React from 'react';
import SearchSuggestions from './searchsuggestions';
import SearchIcon from '@material-ui/icons/Search';
import './searchbar.css';
import SearchEngine from '../../utils/searchengine';
import SuggestionCaller from '../../utils/searchsuggestioncaller';
import EventHandler from '../../utils/eventhandler';
import Settings from '../../utils/settings';

export default class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.onKeyUp = this.onKeyUp.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onIconClick = this.onIconClick.bind(this);
        this.onInputBlur = this.onInputBlur.bind(this);
        this.onInputFocus = this.onInputFocus.bind(this);

        this.onBlurTrigger = this.onInputFocus.bind(this);
        this.onSearchbarDisable = this.onSearchbarDisable.bind(this);

        this.state = {
            showing: props.showing,
            focused: true,
            content: "",
            opacity: props.showing ? 1 : 0,
            suggestions: []
        };
    }

    onBlurTrigger(data) {
        this.setState({
            opacity: data.blur ? Settings.getUserSetting("search_bar.auto_hide") : 1
        });
    }

    onSearchbarDisable(data) {
        this.setState({ showing: data.checked });
    }

    componentDidMount() {
        EventHandler.listenEvent("blurall", "searchbar", this.onBlurTrigger);
        EventHandler.listenEvent("search_bar_state", "searchbar", this.onSearchbarDisable);
    }

    componentWillUnmount() {
        EventHandler.unlistenEvent("blurall", "searchbar");
    }

    onIconClick(e) {
        SearchEngine.search(this.state.content);
    }

    onKeyUp(e) {
        if (e.keyCode === 13) {
            SearchEngine.search(e.target.value);
        }
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
    }
    
    onInputFocus(e) {
        this.setState({
            focused: true
        });
    }

    render() {
        return (
            <div className={`search__wrapper ${this.state.showing ? 'visible' : 'invisible'}`}
                 style={{opacity: this.state.opacity}}>
                <div className={`search_bar__wrapper ${this.props.position}`}>
                    <div className="search_bar">
                        <input className="search_bar__input" onKeyUp={this.onKeyUp} onInput={this.onInputChange} onBlur={this.onInputBlur} onFocus={this.onInputFocus} value={this.state.content} type="text" spellCheck="false" placeholder="Search" tabIndex="0" autoFocus />
                        <SearchIcon className="search_bar__icon" onClick={this.onIconClick} />
                    </div>
                    <SearchSuggestions suggestions={this.state.suggestions} showing={this.state.focused && this.state.content.length > 1 ? 'visible' : 'invisible'} />
                </div>
            </div>
        )
    }
}
