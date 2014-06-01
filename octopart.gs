
var Octopart = {
    api: "http://octopart.com/api/v3",
    apikey: "a76a384c"
};

Octopart.request = function(endpoint, args) {

  var options = {
    'method': 'get'
  };

  var url = Octopart.api + endpoint + "?apikey=" + Octopart.apikey;

  for (var key in args)
    url += "&" + key + "=" + encodeURIComponent(JSON.stringify(args[key]));

  var response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
}

var Parts = {};

Parts.match = function(mpn_or_sku, manuf) {
  var args = {};
  args.queries = [{"mpn_or_sku": mpn_or_sku, "brand": manuf}];

  return Octopart.request("/parts/match", args);
}
