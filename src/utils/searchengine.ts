const ENGINES = [
	"https://google.com/search?q=", // Google
	"https://www.bing.com/search?q=", // Bing
	"https://www.ecosia.org/search?q=", // Ecosia
	"https://search.yahoo.com/search?p=", // Yahoo
	"https://duckduckgo.com/?ia=web&q=", // DuckDuckGo
	"https://www.baidu.com/s?wd=", // Baidu
	"https://www.ask.com/web?q=", // Ask
	"https://www.wolframalpha.com/input/?i=", // WolframAlpha
];

const SearchEngine = {
	search: function (
		query: string,
		search_engine: number = 0,
		open_with: number = 0
	) {
		query = encodeURIComponent(query);

		if (query.length > 0) {
			let url = `${ENGINES[search_engine]}${query}`;

			if (open_with === 1) {
				window.open(url, "_blank");
			} else {
				window.location.href = url;
			}
		}
	},
};

export default SearchEngine;
