/**
 * <help goes here>
 *
 * @param {string} email refers to your email address. When you've entered it, the result will read: "Octopart Add-In is ready".
 * @returns {string}
 * @customfunction
 */
function OCTOPART_SET_USER(email) {
  return "Octopart Add-In is ready";
}

/**
 * <help goes here>
 *
 * @param {string} mpn_or_sku is the search term. Search for components by manufacturer and/or part number. Part number terms may contain wildcards (“*”) but must also contain at least three non-wildcard characters.
 * @param {string} [manuf=no limitation] limits the search result to the specified manufacturer, if desired
 * @returns {string}
 * @customfunction
 */
function OCTOPART_DETAIL_URL(mpn_or_sku, manuf) {
  if (typeof mpn_or_sku === 'undefined')
    return "not found";

  var parts = Parts.match(mpn_or_sku, manuf);

  if (!parts)
    return "server error";

  if (parts.results[0].hits == 0)
    return "not found";

  var part = parts.results[0].items[0];
  return part.octopart_url;
}

/**
 * <help goes here>
 *
 * @param {string} mpn_or_sku is the search term. Search for components by manufacturer and/or part number. Part number terms may contain wildcards (“*”) but must also contain at least three non-wildcard characters.
 * @param {string} [manuf=no limitation] limits the search result to the specified manufacturer, if desired
 * @returns {string}
 * @customfunction
 */
function OCTOPART_DATASHEET_URL(mpn_or_sku, manuf) {
  if (typeof mpn_or_sku === 'undefined')
    return "not found";

  var parts = Parts.match(mpn_or_sku, manuf, null, ["include[]=datasheets"]);

  if (!parts)
    return "server error";

  if (parts.results[0].hits == 0)
    return "not found";

  var part = parts.results[0].items[0];
  var datasheets = part.datasheets;
  if (!datasheets || datasheets.length == 0)
    return "not found";

  return datasheets[0].url;
}

/**
 * <help goes here>
 *
 * @param {string} mpn_or_sku is the search term. Search for components by manufacturer and/or part number. Part number terms may contain wildcards (“*”) but must also contain at least three non-wildcard characters.
 * @param {string} [manuf=no limitation] limits the search result to the specified manufacturer, if desired
 * @param {Number} [qty=1] searches for a particular quantity
 * @param {string} [currency=USD] searches for a particular currency
 * @returns {Number}
 * @customfunction
 */
function OCTOPART_AVERAGE_PRICE(mpn_or_sku, manuf, qty, currency) {
  if (typeof mpn_or_sku === 'undefined')
    return 0;

  qty = typeof qty !== 'undefined'? qty: 1;
  currency = typeof currency !== 'undefined'? currency: "USD";

  var parts = Parts.match(mpn_or_sku, manuf);

  if (!parts)
    return "server error";

  if (parts.results[0].hits == 0)
    return "not found";

  var part = parts.results[0].items[0];
  var offers = part.offers;

  return PartOffers.getAvg(offers, currency, qty);
}


/**
 * <help goes here>
 *
 * @param {string} mpn_or_sku is the search term. Search for components by manufacturer and/or part number. Part number terms may contain wildcards (“*”) but must also contain at least three non-wildcard characters.
 * @param {string} manuf limits the search result to the specified manufacturer, if desired (default: no limitation)
 * @param {string} distributor specifies the distributor to search for (default: pick the lowest price)
 * @param {number} qty searches for a particular quantity (default: 1)
 * @param {string} currency searches for a particular currency (default: USD)
 * @returns {number}
 * @customfunction
 */
function OCTOPART_DISTRIBUTOR_PRICE(mpn_or_sku, manuf, distributor, qty, currency) {
  if (typeof mpn_or_sku === 'undefined')
    return 0;

  qty = typeof qty !== 'undefined'? qty: 1;
  currency = typeof currency !== 'undefined'? currency: "USD";

  var parts = Parts.match(mpn_or_sku, manuf);

  if (!parts)
    return "server error";

  if (parts.results[0].hits == 0)
    return "not found";

  var part = parts.results[0].items[0];
  var offers = part.offers;

  if (!distributor) {
    var offers_by_price = PartOffers.sortByPrice(offers, currency, qty);
    return PartOffers.getPrice(offers_by_price, currency, qty);
  } else {
    return PartOffers.getPrice(offers, currency, qty, distributor);
  }
}

/**
 * <help goes here>
 *
 * @param {string} mpn_or_sku is the search term. Search for components by manufacturer and/or part number. Part number terms may contain wildcards (“*”) but must also contain at least three non-wildcard characters.
 * @param {string} [manuf=no limitation] limits the search result to the specified manufacturer, if desired
 * @param {string} [distributor=lowest price] specifies the distributor to search for
 * @param {Number} [qty=1] searches for a particular quantity
 * @param {string} [currency=USD] searches for a particular currency
 * @returns {Number}
 * @customfunction
 */
function OCTOPART_DISTRIBUTOR_STOCK(mpn_or_sku, manuf, distributor, qty, currency) {
  if (typeof mpn_or_sku === 'undefined')
    return 0;

  qty = typeof qty !== 'undefined'? qty: 1;
  currency = typeof currency !== 'undefined'? currency: "USD";

  var parts = Parts.match(mpn_or_sku, manuf, distributor);

  if (!parts)
    return "server error";

  if (parts.results[0].hits == 0)
    return "not found";

  var part = parts.results[0].items[0];
  var offers = part.offers;

  // FIXME: we must make sure that the offer we are working with really have the currency we want.
  var lowest_price = typeof distributor === "undefined";
  if (lowest_price) {
    var offers_by_price = PartOffers.sortByPrice(offers, currency, qty);
    return offers_by_price[0].in_stock_quantity;
  } else {
    return PartOffers.getInStockQuantity(offers, distributor, currency);
  }
}

/**
 * <help goes here>
 *
 * @param {string} mpn_or_sku is the search term. Search for components by manufacturer and/or part number. Part number terms may contain wildcards (“*”) but must also contain at least three non-wildcard characters.
 * @param {string} [manuf=no limitation] limits the search result to the specified manufacturer, if desired
 * @param {string} [distributor=lowest price] specifies the distributor to search for
 * @returns {string}
 * @customfunction
 */
function OCTOPART_DISTRIBUTOR_URL(mpn_or_sku, manuf, distributor) {
  if (typeof mpn_or_sku === 'undefined')
    return 0;

  qty = typeof qty !== 'undefined'? qty: 1;
  currency = typeof currency !== 'undefined'? currency: "USD";

  var parts = Parts.match(mpn_or_sku, manuf, distributor);

  if (!parts)
    return "server error";

  if (parts.results[0].hits == 0)
    return "not found";

  var part = parts.results[0].items[0];
  var offers = part.offers;

  // FIXME: we must make sure that the offer we are working with really have the currency we want.
  var lowest_price = typeof distributor === "undefined";
  if (lowest_price) {
    var offers_by_price = PartOffers.sortByPrice(offers, currency, qty);
    return offers_by_price[0].product_url;
  } else {
    return offers[0].product_url;
  }}

/**
 * <help goes here>
 *
 * @param {string} mpn_or_sku is the search term. Search for components by manufacturer and/or part number. Part number terms may contain wildcards (“*”) but must also contain at least three non-wildcard characters.
 * @param {string} [manuf=no limitation] limits the search result to the specified manufacturer, if desired
 * @param {string} [distributor=lowest price] specifies the distributor to search for
 * @param {Number} [qty=1] searches for a particular quantity
 * @param {string} [currency=USD] searches for a particular currency
 * @returns {Number}
 * @customfunction
 */
function OCTOPART_DISTRIBUTOR_MOQ(mpn_or_sku, manuf, distributor, qty, currency) {
  if (typeof mpn_or_sku === 'undefined')
    return 0;

  qty = typeof qty !== 'undefined'? qty: 1;
  currency = typeof currency !== 'undefined'? currency: "USD";

  var parts = Parts.match(mpn_or_sku, manuf, distributor);

  if (!parts)
    return "server error";

  if (parts.results[0].hits == 0)
    return "not found";

  var part = parts.results[0].items[0];
  var offers = part.offers;

  // FIXME: we must make sure that the offer we are working with really have the currency we want.
  var lowest_price = typeof distributor === "undefined";
  if (lowest_price) {
    var offers_by_price = PartOffers.sortByPrice(offers, currency, qty);
    return offers_by_price[0].moq;
  } else {
    return offers[0].moq;
  }
}

/**
 * <help goes here>
 *
 * @param {string} mpn_or_sku is the search term. Search for components by manufacturer and/or part number. Part number terms may contain wildcards (“*”) but must also contain at least three non-wildcard characters.
 * @param {string} [manuf=no limitation] limits the search result to the specified manufacturer, if desired
 * @param {string} [distributor=lowest price] specifies the distributor to search for
 * @param {Number} [qty=1] searches for a particular quantity
 * @param {string} [currency=USD] searches for a particular currency
 * @returns {string}
 * @customfunction
 */
function OCTOPART_DISTRIBUTOR_PACKAGING(mpn_or_sku, manuf, distributor, qty, currency) {
  if (typeof mpn_or_sku === 'undefined')
    return 0;

  qty = typeof qty !== 'undefined'? qty: 1;
  currency = typeof currency !== 'undefined'? currency: "USD";

  var parts = Parts.match(mpn_or_sku, manuf, distributor);

  if (!parts)
    return "server error";

  if (parts.results[0].hits == 0)
    return "not found";

  var part = parts.results[0].items[0];
  var offers = part.offers;

  // FIXME: we must make sure that the offer we are working with really have the currency we want.
  var lowest_price = typeof distributor === "undefined";
  if (lowest_price) {
    var offers_by_price = PartOffers.sortByPrice(offers, currency, qty);
    return offers_by_price[0].packaging;
  } else {
    return offers[0].packaging;
  }
}

/**
 * <help goes here>
 *
 * @param {string} mpn_or_sku is the search term. Search for components by manufacturer and/or part number. Part number terms may contain wildcards (“*”) but must also contain at least three non-wildcard characters.
 * @param {string} [manuf=no limitation] limits the search result to the specified manufacturer, if desired
 * @param {string} [distributor=lowest price] specifies the distributor to search for
 * @param {Number} [qty=1] searches for a particular quantity
 * @param {string} [currency=USD] searches for a particular currency
 * @returns {string}
 * @customfunction
 */
function OCTOPART_DISTRIBUTOR_LEAD_TIME(mpn_or_sku, manuf, distributor, qty, currency) {
  if (typeof mpn_or_sku === 'undefined')
    return 0;

  qty = typeof qty !== 'undefined'? qty: 1;
  currency = typeof currency !== 'undefined'? currency: "USD";

  var parts = Parts.match(mpn_or_sku, manuf, distributor);

  if (!parts)
    return "server error";

  if (parts.results[0].hits == 0)
    return "not found";

  var part = parts.results[0].items[0];
  var offers = part.offers;

  // FIXME: we must make sure that the offer we are working with really have the currency we want.
  var lowest_price = typeof distributor === "undefined";
  if (lowest_price) {
    var offers_by_price = PartOffers.sortByPrice(offers, currency, qty);
    return offers_by_price[0].factory_lead_days;
  } else {
    return offers[0].factory_lead_days;
  }
}

/**
 * <help goes here>
 *
 * @param {string} mpn_or_sku is the search term. Search for components by manufacturer and/or part number. Part number terms may contain wildcards (“*”) but must also contain at least three non-wildcard characters.
 * @param {string} [manuf=no limitation] limits the search result to the specified manufacturer, if desired
 * @param {string} [distributor=lowest price] specifies the distributor to search for
 * @param {Number} [qty=1] searches for a particular quantity
 * @param {string} [currency=USD] searches for a particular currency
 * @returns {Number}
 * @customfunction
 */
function OCTOPART_DISTRIBUTOR_ORDER_MUTIPLE(mpn_or_sku, manuf, distributor, qty, currency) {
  if (typeof mpn_or_sku === 'undefined')
    return 0;

  qty = typeof qty !== 'undefined'? qty: 1;
  currency = typeof currency !== 'undefined'? currency: "USD";

  var parts = Parts.match(mpn_or_sku, manuf, distributor);

  if (!parts)
    return "server error";

  if (parts.results[0].hits == 0)
    return "not found";

  var part = parts.results[0].items[0];
  var offers = part.offers;

  // FIXME: we must make sure that the offer we are working with really have the currency we want.
  var lowest_price = typeof distributor === "undefined";
  if (lowest_price) {
    var offers_by_price = PartOffers.sortByPrice(offers, currency, qty);
    return offers_by_price[0].order_multiple;
  } else {
    return offers[0].order_multiple;
  }
}

/**
 * <help goes here>
 *
 * @param {string} mpn_or_sku is the search term. Search for components by manufacturer and/or part number. Part number terms may contain wildcards (“*”) but must also contain at least three non-wildcard characters.
 * @param {string} [manuf=no limitation] limits the search result to the specified manufacturer, if desired
 * @param {string} [distributor=lowest price] specifies the distributor to search for
 * @returns {Number}
 * @customfunction
 */
function OCTOPART_DISTRIBUTOR_SKU(mpn_or_sku, manuf, distributor) {
  if (typeof mpn_or_sku === 'undefined')
    return 0;

  qty = typeof qty !== 'undefined'? qty: 1;
  currency = typeof currency !== 'undefined'? currency: "USD";

  var parts = Parts.match(mpn_or_sku, manuf, distributor);

  if (!parts)
    return "server error";

  if (parts.results[0].hits == 0)
    return "not found";

  var part = parts.results[0].items[0];
  var offers = part.offers;

  // FIXME: we must make sure that the offer we are working with really have the currency we want.
  var lowest_price = typeof distributor === "undefined";
  if (lowest_price) {
    var offers_by_price = PartOffers.sortByPrice(offers, currency, qty);
    return offers_by_price[0].sku;
  } else {
    return offers[0].sku;
  }
}

/**
 * <help goes here>
 *
 * This function simply returns the current version of the Add-In.
 *
 * @returns {string}
 * @customfunction
 */
function OCTOPART_GET_INFO() {
  return "0.1";
}

/**
 * <help goes here>
 *
 * This function is a placeholder for future configurable options.
 *
 * @returns {boolean}
 * @customfunction
 */
function OCTOPART_SET_OPTIONS() {
  return false;
}
