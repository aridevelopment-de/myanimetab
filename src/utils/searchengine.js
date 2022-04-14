import getUserSettings from "./settings";

const ENGINES = [
    "https://google.com/search?q=",  // Google
    "https://www.bing.com/search?q=",  // Bing
    "https://www.ecosia.org/search?q=",  // Ecosia
    "https://search.yahoo.com/search?p=",  // Yahoo
    "https://duckduckgo.com/?ia=web&q=",  // DuckDuckGo
    "https://www.baidu.com/s?wd=",  // Baidu
    "https://www.ask.com/web?q=",  // Ask
    "https://www.wolframalpha.com/input/?i=",  // WolframAlpha
];

const SearchEngine = {
    search: function(query) {
        query = encodeURIComponent(query);

        if (query.length > 0) {
            let url = `${ENGINES[getUserSettings().get('cc.searchbar.search_engine')]}${query}`;
            
            console.error(getUserSettings().get('cc.searchbar.search_engine'), url);

            if (getUserSettings().get("cc.searchbar.open_with") === 1) {
                window.open(url, "_blank");
            } else {
                window.location.href = url;
            }
        }
    }
}

export default SearchEngine;