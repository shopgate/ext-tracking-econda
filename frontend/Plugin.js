/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import CryptoJs from 'crypto-js';
import TrackingPlugin from '@shopgate/tracking-core/plugins/Base';
import { getCurrentBaseProductFormatted } from '@shopgate/pwa-tracking/selectors/product';
import initSDK from './sdk';
import {
  getEmosproForUrl,
  getEmosproForUid,
  getProductEventData,
} from './helpers';

/**
 * Tracking plugin for default econda tracking
 */
class Econda extends TrackingPlugin {
  /**
   * Constructor
   *
   * @param {Object} options Config values for econda
   */
  constructor(options = {}) {
    super('econda');

    this.clientKey = options.clientKey;

    this.basicData = {
      siteid: options.siteid,
      countryid: options.countryid,
      langid: options.langid,
    };

    // These pages are not tracked as regular pageviews
    this.ignoredPageviews = ['search', 'item'];

    this.initPlugin();
  }

  /**
   * Initiate and setup the SDK
   */
  initPlugin() {
    window.emosTrackVersion = 2;
    window.emosClientKey = this.clientKey;

    // Load the econda SDK (emos2.js)
    initSDK();

    this.register.pageview(({ page }) => {
      // Some page should be ignored here
      if (this.ignoredPageviews.includes(page.shopgateUrl)) {
        return;
      }

      const emospro = getEmosproForUrl(page.merchantUrl);

      // Add additional data for some pages
      switch (page.shopgateUrl) {
        case 'cart':
        case 'cart_empty':
          emospro.orderProcess = '1_Warenkorb';
          break;
        case 'login':
          emospro.orderProcess = '2_Anmeldung';
          break;
        default:
      }

      this.send(emospro);
    });

    this.register.viewContent((data, { product }) => {
      const emospro = {
        ...getEmosproForUid(product.uid),
        ec_Event: [getProductEventData(product)],
      };

      this.send(emospro);
    });

    this.register.variantSelected((data, { baseProduct, variant }) => {
      const emospro = {
        type: 'event',
        ec_Event: [getProductEventData(baseProduct, variant)],
      };

      this.send(emospro, true);
    });

    this.register.addToCart((data, { products }, scope, state) => {
      const baseProduct = getCurrentBaseProductFormatted(state);
      const [variant] = products;

      const emospro = {
        ...getEmosproForUid(baseProduct.uid),
        ec_Event: [{
          ...getProductEventData(baseProduct, variant),
          type: 'c_add',
        }],
      };

      this.send(emospro);
    });

    this.register.loginSuccess((user) => {
      const emospro = {
        ...getEmosproForUrl('login'),
        login: [CryptoJs.MD5(user.id).toString(), 0],
      };

      this.send(emospro);
    });

    this.register.loginFailed(() => {
      const emospro = {
        ...getEmosproForUrl('login'),
        login: ['0', 1],
      };

      this.send(emospro);
    });

    let previousSearch = null;

    this.register.search((data) => {
      /**
       * Track a search result page only once per searchTerm.
       * Ignores pageviews where only the sorting changed.
       */
      if (previousSearch === data.query) {
        return;
      }

      const emospro = {
        ...getEmosproForUrl(`search?s=${data.query}`),
        search: [data.query, data.hits],
      };

      this.send(emospro);

      previousSearch = data.query;
    });

    this.register.purchase((data, { order }, scope, state) => {
      const userId = state.user.data ? state.user.data.id : '';

      const emospro = {
        ...getEmosproForUrl(`checkout_success/${order.number}`),
        orderProcess: '7_Bestaetigung',
        billing: [
          order.number,
          CryptoJs.MD5(userId).toString(),
          'NULL', // TODO: LOCATION. Not available at the moment
          parseFloat(order.amount.gross),
        ],
        ec_Event: order.products.map(product => ({
          ...getProductEventData(product),
          type: 'buy',
        })),
      };

      this.send(emospro);
    });
  }

  /**
   * Send data to econda
   * @param {Object} data Params for the event
   * @param {boolean} [sendAsEvent=false] Flag to send just a event
   */
  send = (data, sendAsEvent = false) => {
    // TODO: remove log after Plugin is completely done
    console.warn({
      ...(sendAsEvent ? {} : this.basicData),
      ...data,
    });

    window.emosPropertiesEvent({
      ...(sendAsEvent ? {} : this.basicData),
      ...data,
    });
  };

}

export default Econda;
