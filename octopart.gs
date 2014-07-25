
function toBytes(str) {
  return Utilities.newBlob(str).getBytes();
}

function Octopart() {
  this._api = "http://octopart.com/api/v3";
  this._apikey = "a76a384c";

  this.request = function (endpoint, args, includes) {
    var url = this._api + endpoint + "?apikey=" + this._apikey;

    for (var key in args)
      url += "&" + key + "=" + encodeURIComponent(JSON.stringify(args[key]));

    if (includes) {
      for (var i = 0; i < includes.length; i++)
        url += "&" + includes[i];
    }

    // we cache requests publicaly so all users will be able to benefit from it.
    var cache = CacheService.getPublicCache();
    var cached = cache.get(url);
    if (cached != null)
      return JSON.parse(cached);

    var lock = LockService.getPublicLock();
    var locked = lock.tryLock(30000);
    if (!locked)
      throw "too many concurrent users";

    var response = UrlFetchApp.fetch(url, {method: 'get', muteHttpExceptions: true});
    // rate limiter?
    if (response.getResponseCode() == 429) {
      // wait and try again, we hold the lock, so everyone is waiting, be quick!
      Utilities.sleep(1000);
      response = UrlFetchApp.fetch(url, {method: 'get', muteHttpExceptions: true});
    }

    if (response.getResponseCode() != 200) {
      lock.releaseLock();
      throw "something wrong... (HTTP " + response.getResponseCode() + ")";
    }

    cache.put(url, response, 60 * 60);

    lock.releaseLock();

    Utilities.sleep(400);

    return JSON.parse(response.getContentText());
  };

  this.match = function(mpn_or_sku, manuf, includes) {
    if (typeof mpn_or_sku === "undefined")
      throw "mpn or sku is required";

    var args = {};
    args.queries = [{"mpn_or_sku": mpn_or_sku, "brand": manuf}];

    return new PartsMatchResponse(this.request("/parts/match", args, includes));
  };

  this.upload = function() {
    var url = "https://octopart.com/bom-lookup/upload";

    var boundary = "15b909e62efccd31a1b0098eae5dba3db361743f";
    var boundaryFull = "\r\n--" + boundary + "\r\n";

    // start multipart bounday
    var payload = toBytes(boundaryFull);
    payload = payload.concat(toBytes("Content-Disposition: form-data; name=\"datafile\"; filename=\"filename.csv\"\r\n\r\n"));

    // spreadsheet data
    var sheet = SpreadsheetApp.getActiveSheet();
    var range = sheet.getDataRange();
    var data = range.getValues();

    for (var i = 0; i < data.length; i++)
      payload = payload.concat(toBytes(data[i].toString() + "\r\n"));

    // end multipart boundary
    payload = payload.concat(toBytes(boundaryFull));

    var options = {
      method: 'post',
      payload: payload,
      contentType: "multipart/form-data; boundary=" + boundary,
      followRedirects: false,
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch(url, options);

    if (response.getResponseCode() == 302)
      return response.getHeaders()["Location"];
    else
      throw "There was an error while uploading your BOM. Please try again later.";
  };
}

function PartsMatchResponse(response) {
  this._response = response;

  this.getResult = function(index) {
    return new PartsMatchResult(this._response.results[index]);
  }

};

function PartsMatchResult(result) {
  this._result = result;

  this.getPart = function(index) {
    if (index >= this._result.hits)
      throw "No parts found.";
    return new Part(this._result.items[index]);
  }
};

function Part(part) {
  this._part = part;

  this.getAveragePrice = function(qty, currency) {
    var sum = 0;
    var sellers = 0;

    qty = typeof qty !== "undefined"? qty: 1;
    currency = typeof currency !== "undefined"? currency: "USD";

    for (var i = 0; i < this._part.offers.length; i++) {
      var offer = new PartOffer(this._part.offers[i]);
      var price = offer.getPrice(qty, currency);
      if (!isNaN(price)) {
        sum += price;
        sellers += 1;
      }
    }

    return sellers > 0? sum/sellers: 0;
  }

  this.getOffer = function(distributor, qty, currency) {
    qty = typeof qty !== "undefined"? qty: 1;
    currency = typeof currency !== "undefined"? currency: "USD";

    if (distributor) {
      for (var i = 0; i < this._part.offers.length; i++) {
        var offer = new PartOffer(this._part.offers[i]);
        if (offer.hasPriceInCurrency(currency) && offer.getSellerName() == distributor)
          return offer;
      }
    } else {
      var lowest_offer = null;

      for (var i = 0; i < this._part.offers.length; i++) {
        var new_offer = new PartOffer(this._part.offers[i]);

        if (!lowest_offer && new_offer.hasPriceInCurrency(currency)) {
          var new_offer_price = new_offer.getPrice(qty, currency);

          if (!isNaN(new_offer_price))
            lowest_offer = new_offer;
        } else {
          var new_offer_price = new_offer.getPrice(qty, currency);

          if (!isNaN(new_offer_price))
            lowest_offer = new_offer_price < lowest_offer.getPrice(qty, currency)? new_offer: lowest_offer;
        }
      }

      if (lowest_offer != null)
        return lowest_offer;
      else
        throw "No offers found.";
    }

    throw "No offers found.";
  };

  this.getOctopartUrl = function() {
    return this._part.octopart_url;
  }

  this.getDatasheetUrl = function(index) {
    if (!"datasheets" in this._part || this._part.datasheets.length <= index)
      throw "No datasheets found.";

    return this._part.datasheets[0].url;
  }
};

function PartOffer(offer) {
  this._offer = offer;

  this.getPrice = function(qty, currency) {
    qty = typeof qty !== "undefined"? qty: 1;
    currency = typeof currency !== "undefined"? currency: "USD";

    if (!this.hasPriceInCurrency(currency))
      return NaN;

    var price = NaN;

    for (var i = 0; i < this._offer.prices[currency].length; i++) {
      if (this._offer.prices[currency][i][0] > qty)
        return parseFloat(price);

      price = this._offer.prices[currency][i][1];
    }

    if (isNaN(price))
      throw "No price found for this quantity/currency";

    return parseFloat(price);
  }

  this.hasPriceInCurrency = function(currency) {
    currency = typeof currency !== "undefined"? currency: "USD";
    return currency in this._offer.prices;
  }

  this.getInStockQuantity = function() {
    return this._offer.in_stock_quantity !== null? parseInt(this._offer.in_stock_quantity): "unknown";
  }

  this.getSellerName = function() {
    return this._offer.seller.name;
  }

  this.getSellerUrl = function() {
    return this._offer.product_url;
  }

  this.getMoq = function() {
    return this._offer.moq !== null? parseInt(this._offer.moq): "unknown";
  }

  this.getPackaging = function() {
    return this._offer.packaging !== null? this._offer.packaging: "unknown";
  }

  this.getFactoryLeadTime = function() {
    return this._offer.factory_lead_days !== null? parseInt(this._offer.factory_lead_days): "unknown";
  }

  this.getOrderMultiple = function() {
    return this._offer.order_multiple !== null? parseInt(this._offer.order_multiple): "unknown";
  }

  this.getSku = function() {
    return this._offer.sku !== null? this._offer.sku: "unknown";
  }
};
