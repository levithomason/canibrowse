Can I Browse
============

[![CircleCI](https://img.shields.io/circleci/project/github/levithomason/canibrowse.svg?style=flat-square)]()
[![David](https://img.shields.io/david/levithomason/canibrowse.svg?style=flat-square)]()

Determine if you user's are using a supported browser.

## Why?

- You want to display a message to your users to upgrade or change browsers.
- You don't want to ship and update browser lists and detection code with your client code.

## Usage

Hit the API with the browsers you support as query params:

https://canibrowse.now.sh?chrome=60

Response in Chrome >= 60:

```js
{
  canBrowse: true           // did the user agent meet the requirements?
}
```

## Examples

💡Detection is done with [bowser][1].  All of its [browser flags][2] are supported.

### IE >= 9

By default, browsers you do not specify are considered supported.

https://canibrowse.now.sh?msie=9

|Chrome  |Firefox |IE8     |IE9     |
|--------|--------|--------|--------|
|✅      |✅     |❌       |✅      |


### Only Chrome and Firefox

Use `strict` if you support only the specified browsers and no others.

https://canibrowse.now.sh?strict&chrome&firefox

|Chrome  |Firefox |IE      |Safari  |
|--------|--------|--------|--------|
|✅      |✅      |❌      |❌      |

### Blacklist specific browsers

Pass a browser as `false` to exclude all versions.

https://canibrowse.now.sh?msie=false

|Chrome  |Firefox |IE      |Safari  |
|--------|--------|--------|--------|
|✅      |✅      |❌     |✅       |

### Whitelist specific browsers

Pass a browser as `true` or without a value to include all versions.

https://canibrowse.now.sh?strict&chrome=true
https://canibrowse.now.sh?strict&chrome

|Chrome 1 |Chrome ∞   |Other browsers|
|----------|----------|--------------|
|✅        |✅        |❌            |

### Debug what is going on

Pass `debug` to see more info on the `detection` and `requirements`.

https://canibrowse.now.sh?debug&chrome=60

```js
{
  canBrowse: true,

  detected: {               // user agent detection results
    name: 'Chrome',
    chrome: true,
    version: '60.0',
    blink: true,
    mac: true,
    osversion: '10.12.5',
    a: true,
  },

  strict: false,            // value of strict passed

  requirements: {           // browser requirements generated form the request
    chrome: {
      minVersions: ['60'],
      whitelisted: false,
      blacklisted: false,
    },
  },
}
```

### Just get detection info

Only returns `detected`, perhaps to do your own checks against.

https://canibrowse.now.sh/detect

### Send a custom user agent

You can pass a `ua` query param or override the `User-Agent` header.

## Features I'd :heart: to see

These are possible with the current libraries we use, they just to be implemented.  PRs welcome. 

>### Query browser versions
>
>Specify supported browsers by a [Browserslist][3] `query` like `last 2 versions` or `> 5%`.
>
>https://canibrowse.now.sh?query=last 2 versions
>
>|Older   |2 version old |Current |
>|--------|--------------|--------|
>|❌      |✅           |✅      |
>
>### Specify mobile or tablet
>
>You can specify `mobile` or `tablet`.
>
>https://canibrowse.now.sh?mobile=false&tablet=false
>
>|Mobile  |Tablet  |Desktop |
>|--------|--------|--------|
>|❌      |❌      |✅     |

## Credits

Can I Browse is uses [bowser][1] for user agent parsing and compatibility checks and [Browserslist][3] for browser list queries.

Browser detection and browser list query issues should be opened on the main repos.

[1]: https://github.com/lancedikson/bowser
[2]: https://github.com/lancedikson/bowser#browser-flags
[3]: https://github.com/ai/browserslist
