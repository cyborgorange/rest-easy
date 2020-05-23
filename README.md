# BFX-REST-EASY #

## Rest-Easy is a lightweight wrapper for the REST API offered by the crypto-currency trading site Bitfinex: https://www.bitfinex.com

The Bitfinex REST API has two versions available, however the wrapper is version agnostic.
Simply give a valid endpoint path and a correctly structured body to get a callback containing the response.

* V1 API Documentation: https://docs.bitfinex.com/v1/reference
* V2 API Documentation: https://docs.bitfinex.com/reference

The wrapper supports authenticated endpoints, simply pass a credentials object into the constructor, such as:
```javascript
{key: "api key", secret: "api secret"}
```

Source code available @ https://bitbucket.org/gaz-s/bfx-rest-easy

The wrapper has Developer Awards enabled: https://www.bitfinex.com/affiliate meaning that any orders created through it will earn the developer a small rebate.

If you would like to to show your support please also use this affiliates link when creating new accounts: https://www.bitfinex.com/?refcode=01hj1_9Mu or the affiliate code 01hj1_9Mu 👍

## Example: Get ticker data:
```javascript
// Import the package
const ApiHelper = require("bfx-rest-easy")

// Define what we want to do with the result of the API call - We're simply printing the response 
const printResponse = (response) => console.log(`\nResponse :\n${JSON.stringify(response, null, 2)}`)

// Specify the API endpoint that we will query
const path = "v2/ticker/tBTCUSD"

// Instantiate the wrapper and send the request
// The callback function will be triggered when a response is returned, and we should see the content in the console
new ApiHelper().sendGetRequest(path, null, printResponse)
```

## Example: Place an order
```javascript
// Import the package
const ApiHelper = require("bfx-rest-easy")

// For API endpoints that require authentication, a valid Key and Secret must be provided
const credentials = {
    key: "INSERT API KEY HERE",
    secret: "INSERT API SECRET HERE"
}

// Define what we want to do with the result of the API call - We're simply printing the response 
const printResponse = (response) => console.log(`\nResponse :\n${JSON.stringify(response, null, 2)}`)

// Specify the API endpoint that we will query
const path = "v2/auth/w/order/submit"

// Specify the request body contents as outlined in the API documentation
const body = {
    type: "EXCHANGE LIMIT",
    symbol: "tBTCUSD",
    price: "20",
    amount: "0.001"
}

// Instantiate the wrapper and send the request.
// As /order is a private endpoint, we must pass an object containing the API credentials to the constructor.
// The callback function will be triggered when a response is returned, and we should see the content in the console.
new ApiHelper(credentials).sendPostRequest(path, body, printResponse)
```