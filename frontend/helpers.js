/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import CryptoJs from 'crypto-js';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';

/**
 * Returns emospro data for a given url
 * @param {string} url The url of the page
 * @return {Object} emospro data for the given url
 */
export const getEmosproForUrl = url => ({
  content: url,
  pageId: CryptoJs.MD5(url).toString(),
});

/**
 * Returns emospro data for a product page
 * @param {string} uid Uid of the product
 * @return {Object} emospro data for the given uid
 */
export const getEmosproForUid = uid => ({
  ...getEmosproForUrl(`item/${bin2hex(uid)}`),
});

/**
 * Returns the data for the ec_Event of a product or variant.
 * @param {Object} [baseProduct] The base (parent) product.
 * @param {Object} [variant] The selected variant.
 * @return {Object} ec_Event data of the given product
 */
export const getProductEventData = (baseProduct = {}, variant = {}) => {
  const variantAvailable = !!Object.keys(variant).length;
  const product = variantAvailable ? variant : baseProduct;

  return {
    type: 'view',
    pid: baseProduct ? baseProduct.uid : '',
    sku: variant.uid ? variant.uid : '',
    name: product.name,
    price: parseFloat(product.amount.net),
    group: 'NULL',
    count: product.quantity || 1,
    var1: 'NULL',
    var2: 'NULL',
    var3: 'NULL',
  };
};
