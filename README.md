# Econda (emos2) tracking plugin

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

