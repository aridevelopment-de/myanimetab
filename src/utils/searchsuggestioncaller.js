const SuggestionCaller = {
    makeJsonpRequest: function(url, callback) {
        var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
        window[callbackName] = function(data) {
            delete window[callbackName];
            document.body.removeChild(script);
            callback(data);
        };

        var script = document.createElement('script');
        script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'jsonp=' + callbackName;
        document.body.appendChild(script);
    },
    fetchSearchSuggestions: function(query, callback) {        
        query = encodeURIComponent(query);
        this.makeJsonpRequest("https://suggestqueries.google.com/complete/search?output=toolbar&hl=en&q=a&client=youtube&q=" + query, callback);        
    }
}

export default SuggestionCaller;