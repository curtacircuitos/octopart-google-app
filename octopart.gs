
var Octopart = {
    api: "http://octopart.com/api/v3",
    apikey: "a76a384c"
};

Octopart.request = function(endpoint, args, includes) {

  var options = {
    'method': 'get'
  };

  var url = Octopart.api + endpoint + "?apikey=" + Octopart.apikey;

  for (var key in args)
    url += "&" + key + "=" + encodeURIComponent(JSON.stringify(args[key]));

  if (includes) {
    for (var i = 0; i < includes.length; i++)
      url += "&" + includes[i];
  }

  var response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
};

var Parts = {};

Parts.match = function(mpn_or_sku, manuf, distributor, includes) {
  var args = {};
  args.queries = [{"mpn_or_sku": mpn_or_sku, "brand": manuf, "seller": distributor}];

  return Octopart.request("/parts/match", args, includes);
};

var PartOffers = {};

PartOffers.getPrice = function(offers, currency, qty, distributor) {
  for (var i = 0; i < offers.length; i++) {
    if (!offers[i].prices.hasOwnProperty(currency))
      continue;

    if (distributor && offers[i].seller.name != distributor)
        continue;

    var prices = offers[i].prices[currency];

    for (var j = prices.length - 1; j >= 0; j--) {
      var price = prices[j];
      if (price[0] <= qty)
        return parseFloat(price[1]);
    }
  }

  return 0;
};

PartOffers.getInStockQuantity = function(offers, distributor, currency) {
  for (var i = 0; i < offers.length; i++) {
    if (!offers[i].prices.hasOwnProperty(currency))
      continue;

    if (distributor && offers[i].seller.name != distributor)
        continue;

    return offers[i].in_stock_quantity;
  }

  throw "no offer found for this distributor or currency.";
};


PartOffers.getAvg = function(offers, currency, qty) {
  var sum = 0.0;
  var sellers_count = 0;

  for (var i = 0; i < offers.length; i++) {
    if (!offers[i].prices.hasOwnProperty(currency))
      continue;

    var prices = offers[i].prices[currency];

    for (var j = prices.length - 1; j >= 0; j--) {
      var price = prices[j];
      if (price[0] <= qty) {
        sellers_count++;
        sum += parseFloat(price[1]);
      }
    }
  }

  return (sum / sellers_count);
};

PartOffers.sortByPrice = function(offers, currency, qty) {
  var offers_same_currency = [];
  for (var i = 0; i < offers.length; i++)
    if (currency in offers[i].prices)
      offers_same_currency.push(offers[i]);

  return offers_same_currency.sort(function (offer_a, offer_b) {
    var prices_a = offer_a.prices[currency];
    var prices_b = offer_b.prices[currency];

    var price_a = Infinity;
    var price_b = Infinity;

    for (var j = prices_a.length - 1; j >= 0; j--) {
      var price = prices_a[j];
      if (price[0] <= qty) {
        price_a = parseFloat(price[1], 10);
        break;
      }
    }

    for (var j = prices_b.length - 1; j >= 0; j--) {
      var price = prices_b[j];
      if (price[0] <= qty) {
        price_b = parseFloat(price[1], 10);
        break;
      }
    }

    return price_a - price_b;
  });
};
