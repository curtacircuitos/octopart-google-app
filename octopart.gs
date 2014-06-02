
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
};

var Parts = {};

Parts.match = function(mpn_or_sku, manuf, distributor) {
  var args = {};
  args.queries = [{"mpn_or_sku": mpn_or_sku, "brand": manuf, "seller": distributor}];

  return Octopart.request("/parts/match", args);
};

var PartOffer = {};

PartOffer.getPrice = function(offer, currency, qty) {
  var prices = offer[currency];
  for (var i = prices.length - 1; i >= 0; i--) {
    var price = prices[i];
    if (price[0] <= qty) {
      return price[1];
    }
  }

  return -1;
};

var PartOffers = {};

PartOffers.sortByPrice = function(offers, currency, qty) {

  var offers_same_currency = [];
  for (var i = 0; i < offers.length; i++)
    if (currency in offers[i])
      offers_same_currency.push(offers[i]);

  return offers_same_currency.sort(function (a, b) {
    var prices_a = a[currency];
    var prices_b = b[currency];

    var price_a = Infinity;
    var price_b = Infinity;

    for (var j = prices_a.length - 1; j >= 0; j--) {
      var price = prices_a[j];
      if (price[0] <= qty) {
        price_a = price[1];
        break;
      }
    }

    for (var j = prices_b.length - 1; j >= 0; j--) {
      var price = prices_b[j];
      if (price[0] <= qty) {
        price_b = price[1];
        break;
      }
    }

    return a < b;
  });
};
