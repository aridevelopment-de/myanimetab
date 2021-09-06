import React from 'react';
import SearchSuggestions from './searchsuggestions';
import SearchEngine from '../../utils/searchengine';
import SuggestionCaller from '../../utils/searchsuggestioncaller';
import SearchIcon from '@material-ui/icons/Search';
import './searchbar.css';

export default class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.onKeyUp = this.onKeyUp.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onIconClick = this.onIconClick.bind(this);
        this.onInputBlur = this.onInputBlur.bind(this);
        this.onInputFocus = this.onInputFocus.bind(this);

        this.state = {
            showing: true,
            focused: true,
            content: "",
            suggestions: ["Apfel", "Arzt", "Abeth", "Armanda", "Arol"]
        };
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

        if (this.state.content.length > 1) {
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
            <div className={`search__wrapper ${this.state.showing ? 'visible' : 'invisible'}`}>
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