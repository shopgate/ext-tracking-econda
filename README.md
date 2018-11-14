# Shopgate Connect - Econda (emos2) Tracking Extension

[![GitHub license](http://dmlc.github.io/img/apache2.svg)](LICENSE)

Implementation of the default econda tracking plus ecommerce tracking.

## Configuration

The extension get the values for clientKey, siteid, langid, countryid and sendParentData from a shop config (Key: `sg_connect_tracking_econda`).

**Example Config:** 
```
{
    "siteid": "de",
    "clientKey": "1234-acbd-",
    "langid": "de",
    "countryid": "de",
    "sendParentData": true
}
```

## Supported Events
- Pageview
- Search
- Add to cart
- Login success/fail
- Purchase

## Not supported yet
- `group` field for product view
- `var1`, `var2`, `var3` fields for product view
- `location` field for purchase

## Documentation
- https://support.econda.de/display/INDE/Web-Tracking

## Changelog

See [CHANGELOG.md](CHANGELOG.md) file for more information.

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) file for more information.

## About Shopgate

Shopgate is the leading mobile commerce platform.

Shopgate offers everything online retailers need to be successful in mobile. Our leading
software-as-a-service (SaaS) enables online stores to easily create, maintain and optimize native
apps and mobile websites for the iPhone, iPad, Android smartphones and tablets.

## License

This extension is available under the Apache License, Version 2.0.

See the [LICENSE](./LICENSE) file for more information.
