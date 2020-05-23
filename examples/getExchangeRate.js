// Import the package
const ApiHelper = require("bfx-rest-easy")

// Define what we want to do with the result of the API call - We're simply printing the response 
const printResponse = (response) => console.log(`\nResponse :\n${JSON.stringify(response, null, 2)}`)

// Specify the API endpoint that we will query
const path = "v2/calc/fx"

// Specify the request body contents as outlined in the API documentation
const body = {
    ccy1: "BTC",
    ccy2: "USD"
}

// Instantiate the wrapper and send the request
// The callback function will be triggered when a response is returned, and we should see the content in the console
new ApiHelper().sendPostRequest(path, body, printResponse)