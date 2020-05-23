// Import the package
const ApiHelper = require("bfx-rest-easy")

// Define what we want to do with the result of the API call - We're simply printing the response 
const printResponse = (response) => console.log(`\nResponse :\n${JSON.stringify(response, null, 2)}`)

// Specify the API endpoint that we will query, including any path parameters
const path = "v2/candles/trade:1m:tBTCUSD/hist?limit=3"

// Instantiate the wrapper and send the request
// The callback function will be triggered when a response is returned, and we should see the content in the console
new ApiHelper().sendGetRequest(path, null, printResponse)