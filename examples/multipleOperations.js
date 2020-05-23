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
const path1 = "v2/auth/r/wallets"
const path2 = "v2/auth/w/order/cancel"

// Instantiate the wrapper and send the request.
// As we are querying private endpoints, we must pass an object containing the API credentials to the constructor.
const api = new ApiHelper(credentials)

// When sending multiple authenticated requests they must be sent synchronously, otherwise the nonce will be invalid.
// After a response from the first request to the /wallet endpoint is received, we can safely send a second request to cancel an order.
api.sendPostRequest(path1, null, (response) => {
    printResponse(response)
    api.sendPostRequest(path2, { id: 12345 }, printResponse)
})