const CryptoJS = require("crypto-js")
const request = require("request")

// Bitfinex Affiliate program: https://www.bitfinex.com/affiliate
const affiliateCode = "01hj1_9Mu"
const affiliateLink = "https://www.bitfinex.com/?refcode=01hj1_9Mu"

// Private helper functions
let setCredentials = function (key, secret) {
    if (!key || !secret) {
        key = ""
        secret = ""
    }
    this.key = key
    this.secret = secret
}

let setVerbose = function (isVerboseOutput) {
    this.isVerbose = isVerboseOutput
}

let setPath = function (path) {
    if (path.startsWith("/")) {
        path = path.substring(1)
    }
    if (path.startsWith("v1/")) {
        this.version = 1
    } else if (path.startsWith("v2/")) {
        this.version = 2
    } else {
        throw "Unable to determine endpoint version. Paths are expected to start with v1 || v2, Aborting."
    }

    this.path = path

    if (path.includes("?")) {
        this.path = path.split("?")[0]
        this.pathArgs = path.split("?")[1]
    }
}

let setBody = function (body) {
    if (!body) body = {}
    this.body = body
}

let setNonce = function () {
    this.nonce = Date.now().toString()
}

let setUrl = function (url) {
    this.url = url ? url : "https://api.bitfinex.com/"
}

// Private V1 request composition functions
let getHeaderV1 = function () {
    let payload = Buffer.from(JSON.stringify(body)).toString("base64")
    return {
        "X-BFX-APIKEY": key,
        "X-BFX-PAYLOAD": payload,
        "X-BFX-SIGNATURE": getSignatureV1(payload)
    }
}

let getSignatureV1 = function (payload) {
    return CryptoJS.HmacSHA384(payload, this.secret).toString(CryptoJS.enc.Hex)
}

let getRequestPayloadV1 = function () {
    this.body.nonce = this.nonce
    this.body.request = this.path.startsWith("/") ? this.path : `/${this.path}`
    let url = `${this.url}${this.path}`
    if (this.pathArgs) {
        this.body.request += `?${this.pathArgs}`
        url += `?${this.pathArgs}`
    }
    return {
        url: url,
        headers: getHeaderV1(),
        body: JSON.stringify(body),
    }
}

// Private V2 request composition functions
let getHeaderV2 = function () {
    return {
        "bfx-nonce": nonce,
        "bfx-apikey": key,
        "bfx-signature": getSignatureV2()
    }
}

let getSignatureV2 = function () {
    let signature = `/api/${this.path}${this.nonce}${JSON.stringify(this.body)}`
    return CryptoJS.HmacSHA384(signature, this.secret).toString()
}

let getRequestPayloadV2 = function () {
    let url = `${this.url}${this.path}`
    if (this.pathArgs) url += `?${this.pathArgs}`
    return {
        url: url,
        headers: getHeaderV2(),
        body: this.body,
        json: true
    }
}

// Private transmission function
let sendRequest = function (isPost, responseCallback = null) {
    let executeRequest = isPost ? request.post : request.get
    let requestPayload = this.version === 1 ? getRequestPayloadV1() : getRequestPayloadV2()

    if (this.isVerbose) console.log(`Request Payload:\n${JSON.stringify(requestPayload, null, 2)}`)

    executeRequest(requestPayload, (error, response, body) => {
        if (this.isVerbose) console.log(`Response Payload:\n${JSON.stringify(response, null, 2)}`)
        if (error)
            console.log(`Error:\n${JSON.stringify(error, null, 2)}`)
        let responseJson = this.version === 1 ? JSON.parse(body) : body
        if (responseCallback)
            responseCallback(responseJson, response, error)
    })
}

let initRequest = function (isPost, path, body, responseCallback) {
    if (!path) throw "Path is not set, unable to use the API without specifying an API path."
    setPath(path)
    insertAffiliateCode(path, body)
    setBody(body)
    setNonce()
    sendRequest(isPost, responseCallback)
}

// If an order is being created
// And the user is not supplying an affiliate code of their own
// Then insert the developers affiliate code
let insertAffiliateCode = function (path, body) {
    if (path === "v2/auth/w/order/submit" && body) {
        if (body.meta && !body.meta.aff_code) {
            body.meta.aff_code = affiliateCode
        } else {
            body.meta = {
                aff_code: affiliateCode
            }
        }
    } else if (path === "v1/order/new" && body && !body.aff_code) {
        body.aff_code = affiliateCode
    }
}

class ApiHelper {

    /**
    * Creates a version agnostic REST interface instance
    * @class
    * @param {Object} [credentials] Supply an optional credentials object e.g. {key: "key", secret: "secret"}
    */
    constructor(credentials = {}) {
        setUrl(credentials.url)
        setVerbose(credentials.verbose)
        setCredentials(credentials.key, credentials.secret)
    }

    /**
    * A function that will be called when a request is resolved. Arguments will contain the data returned from the API
    * @callback responseCallback
    * @param {Object} [responseBody] The request response. Contains the data returned from a successful request.
    * @param {Object} [response] The verbose response Contains request and response headers, useful for debugging.
    * @param {Object} [error] The error response. Contains details when a request fails for technical reasons, e.g. network failure, incorrect URL.
    */

    /**
    * Sends a GET request.
    * @param {string} path The required API endpoint path. Starts with the version number, and contains any path parameters, e.g.: v2/tickers?symbols=tBTC
    * @param {Object} [body] An optional JSON object containing request parameters, e.g.: {id: 12345}
    * @param {responseCallback} [responseCallback] An optional callback function to be executed when a response is received.
    */
    sendGetRequest(path, body = null, responseCallback = null) {
        initRequest(false, path, body, responseCallback)
    }

    /**
    * Sends a POST request.
    * @param {string} path The required API endpoint path. Starts with the version number, and contains any path parameters, e.g.: v2/tickers?symbols=tBTC
    * @param {Object} [body] An optional JSON object containing request parameters, e.g.: {id: 12345}
    * @param {responseCallback} [responseCallback] An optional callback function to be executed when a response is received.
    */
    sendPostRequest(path, body = null, responseCallback = null) {
        initRequest(true, path, body, responseCallback)
    }
}

// Expose the interface only
module.exports = ApiHelper