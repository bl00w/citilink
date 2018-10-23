// ==UserScript==
// @name         Citilink show sale
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match https://www.citilink.ru/*/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const parser = new DOMParser();
    const parsePrice = strPrice => Number(strPrice.split('').filter(c => c >= '0' && c <= '9').join(''));

    const productUrlRegexp = /https:\/\/www\.citilink\.ru\/.*\/\d+\//;

    const currentUrl = window.location.href;
    const onProductPage = currentUrl.match(productUrlRegexp) != null;

    if (!onProductPage) {
        return;
    }

    const productPriceElements = document.getElementsByClassName('price price_break');

    if (productPriceElements.length != 1) {
        console.log('expected 1 price element, ' + productPriceElements.length + ' found');
        return;
    }

    const priceText = productPriceElements[0].innerText;
    const price = parsePrice(priceText);

    fetch(currentUrl, {credentials: 'omit'}).then((response) => {
        return response.text();

    }).then(text => {
        const match = text.match(/<div class="price price_break"><ins class="num">(.+?)<\/ins>/);

        let textToInsert = '';

        if (match && match[1]) {
            const commonPrice = parsePrice(match[1]);

            textToInsert = commonPrice + ' (' + (price / commonPrice).toFixed(2);
        } else {
            textToInsert = '??? (???';
        }

        productPriceElements[0].insertAdjacentHTML('afterEnd', '<div class="price price_break"><ins class="num">real ' + textToInsert + ')</ins><ins class="rub"> руб.</ins></div>');

        //console.log(match);
    });

   // alert(price);
})();