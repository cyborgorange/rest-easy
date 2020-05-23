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
const path = "v2/auth/r/wallets"

// Instantiate the wrapper and send the request.
// As /wallets is a private endpoint, we must pass an object containing the API credentials to the constructor.
// The callback function will be triggered when a response is returned, and we should see the content in the console.
new ApiHelper(credentials).sendPostRequest(path, null, printResponse)