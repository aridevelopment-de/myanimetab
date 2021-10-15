import Settings from "./settings";

const ENGINES = {
    "Google": "https://google.com/search?q=",
    "Bing": "https://www.bing.com/search?q=",
    "Yahoo": "https://search.yahoo.com/search?p=",
    "DuckDuckGo": "https://duckduckgo.com/?ia=web&q=",
    "Baidu": "https://www.baidu.com/s?wd=",
    "Ask": "https://www.ask.com/web?q=",
    "WolframAlpha": "https://www.wolframalpha.com/input/?i="
};

const SearchEngine = {
    search: function(query) {
        query = encodeURIComponent(query);

        // TODO: Add language

        if (query.length > 0) {
            let url = `${ENGINES[Settings.getUserSetting('search_bar.search_engine')]}${query}`;
            
            if (Settings.getUserSetting("search_bar.open_with") === "New Tab") {
                window.open(url, "_blank");
            } else {
                window.location.href = url;
            }
        }
    }
}

export default SearchEngine;