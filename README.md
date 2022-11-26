[![License: MIT](https://img.shields.io/npm/l/@silverbirder/cotlin.svg)](https://opensource.org/licenses/MIT)
[![npm download](https://img.shields.io/npm/dt/@silverbirder/cotlin.svg)](https://www.npmjs.com/package/@silverbirder/cotlin)
[![npm version](https://img.shields.io/npm/v/@silverbirder/cotlin)](https://www.npmjs.com/package/@silverbirder/cotlin)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@silverbirder/cotlin)](https://www.npmjs.com/package/@silverbirder/cotlin)
[![github action](https://img.shields.io/github/workflow/status/Silver-birder/Cotlin/main)](https://github.com/Silver-birder/Cotlin/actions)
[![Coverage Status](https://coveralls.io/repos/github/Silver-birder/Cotlin/badge.svg?branch=master)](https://coveralls.io/github/Silver-birder/Cotlin?branch=master)
[![twitter](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Ftwitter.com%2Fsilverbirder)](https://twitter.com/silverbirder)

# Cotlin
Cotlin is tools that collect links in tweet by using the [Twitter API(Search Tweets)](https://developer.twitter.com/en/docs/tweets/search/overview). 

![overview](https://res.cloudinary.com/silverbirder/image/upload/v1584017984/cotlin/overview.png)

There are some filtering functions.

* Domain (ex. SlideShare)
* Date Range (ex. 2020-01-01 ~ 2020-01-02)
* Keywords (ex. #devops)

# Use By Google Apps Script

1. This tool uses Bearer Tokens. Follow the [here](https://developer.twitter.com/en/docs/basics/authentication/oauth-2-0/bearer-tokens) to get Consumer API Key and Consumer API Secret Key.
1. Access the Your [Google Apps Script](https://script.google.com).
1. Add the this library. (Cotlin)
   1. API ID is  **MPXXo-zG0agWiuZ0VceUiYXWuXGFJZPSs** 
1. Use it like [sample/api.js](https://github.com/Silver-birder/Cotlin/blob/master/sample/api.js).
    1. Set the Script Property: CONSUMER_API_KEY, CONSUMER_API_SECRET_KEY.
1. Follow [here](https://developers.google.com/apps-script/api/how-tos/execute#step_1_deploy_the_script_as_an_api_executable) and publish the API.

Please refer [sample/client.js](https://github.com/Silver-birder/Cotlin/blob/master/sample/client.js) for the client that calls the published API.

# Use By TypeScript

This library is published by npm.  
[@silverbirder/Cotlin](https://www.npmjs.com/package/@silverbirder/cotlin)

```
$ npm install @silverbirder/cotlin
```

# Motivation
At technical conferences, presentation materials are often published on twitter.  
I often miss it and regret it. This tool allows you to collect slideshare, speackerDeck, and googlePresentation materials.

# Caution
Tweet for the past 7 days uses [Standard search API](https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets). Free.  
Tweet for the past 30 days uses [Premium search API](https://developer.twitter.com/en/docs/tweets/search/api-reference/premium-search) 30day. Free if limited under sandbox environment.  
Tweet for the past older uses [Premium search API](https://developer.twitter.com/en/docs/tweets/search/api-reference/premium-search) fullarchive. Free if limited under sandbox environment.
