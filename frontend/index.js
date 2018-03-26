/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Plugin from './Plugin';
import config from './config';

/**
 * Read the config and create plugin instances
 */
export default function init() {
  // eslint-disable-next-line no-new
  new Plugin(config.econda);
}
