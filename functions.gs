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
  return "";
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
  return "http://www.octopart.com";
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
  return 0;
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
function OCTOPART_DISTRIBUTOR_PRICE(mpn_or_sku, manuf, distributor, qty, currency) {
  if (typeof mpn_or_sku === 'undefined')
    return 0;

  qty = typeof qty !== 'undefined'? qty: 1;
  currency = typeof currency !== 'undefined'? currency: "USD";

  var parts = Parts.match(mpn_or_sku, manuf, distributor);

  if (parts == null)
    return "server error";

  if (parts.results[0].hits == 0)
    return "no parts found";

  var part = parts.results[0].items[0];
  var offers = part.offers;

  var lowest_price = typeof distributor === undefined;

  if (lowest_price) {
    var offersByPrice = PartOffers.sortByPrice(offers, currency, qty);
    return PartOffer.getPrice(offersByPrice[0], currency, qty);
  } else {
    return PartOffer.getPrice(offers[0], currency, qty);
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
  return 0;
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
  return "http://www.octopart.com";
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
function OCTOPART_DISTRIBUTOR_MOQ(mpn_or_sku, manuf, distributor, qty, currency) {
  return 0;

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
  return "";
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
  return "";
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
  return 1;
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
  return 0;
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
