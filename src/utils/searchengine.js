import Settings from './settings';

const SearchEngine = {
    search: function(query) {
        if (query.length > 0) {
            window.location.href = `https://google.com/search?q=${query}`;
        }
    }
}

export default SearchEngine;