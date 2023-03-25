const SearchEngine = {
	search: function (
		query: string,
		search_engine_url: string = "https://www.google.com/search?q=",
		open_with: number = 0
	) {
		query = encodeURIComponent(query);

		if (query.length > 0) {
			let url = `${search_engine_url}${query}`;

			if (open_with === 1) {
				window.open(url, "_blank");
			} else {
				window.location.href = url;
			}
		}
	},
};

export default SearchEngine;
