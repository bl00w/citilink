// ==UserScript==
// @name         Citilink show sale
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       You
// @match https://www.citilink.ru/*/
// @grant        none
// @downloadURL https://raw.githubusercontent.com/bl00w/citilink/master/citilink.js
// @updateURL https://raw.githubusercontent.com/bl00w/citilink/master/citilink.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const productPriceElements = document.getElementsByClassName('price price_break');
    if(productPriceElements.length === 0) {
        return;
    }

    const parsePrice = strPrice => Number(strPrice.split('').filter(c => c >= '0' && c <= '9').join(''));

    const productUrlRegexp = /https:\/\/www\.citilink\.ru\/.*\/(\d+)\//;

    const currentUrl = window.location.href;
    const match = currentUrl.match(productUrlRegexp);
    const productId = match[1];
    const onProductPage = match != null;

    if (!onProductPage) {
        return;
    }
    
    if (productPriceElements.length != 1) {
        console.log('expected 1 price element, ' + productPriceElements.length + ' found');
        return;
    }

    const priceText = productPriceElements[0].innerText;
    const price = parsePrice(priceText);

    const url = `https://api.citilink.ru/v1/product/perm_cl:/${productId}/`;

    fetch(url, {credentials: 'omit'})
        .then((response) => {
            return response.json();
        })
        .then(json => {
            const cardInfo = json && json.data && json.data.card;
            let textToInsert = '';

            if (cardInfo.priceColumnOne) {
                textToInsert = cardInfo.priceColumnOne + ' (' + (price / cardInfo.priceColumnOne).toFixed(2);
            } else {
                textToInsert = '??? (???';
            }

        productPriceElements[0].insertAdjacentHTML('afterEnd', '<div class="price price_break"><ins class="num">real ' + textToInsert + ')</ins><ins class="rub"> руб.</ins></div>');
    });
})();