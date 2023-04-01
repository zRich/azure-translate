const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
const path = require('path')

require('dotenv').config()

const fs = require('fs');

let key = process.env.TRANSLATOR_TEXT_SUBSCRIPTION_KEY;

let endpoint = process.env.TRANSLATOR_TEXT_ENDPOINT;

// location, also known as region.
// required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
let location = process.env.TRANSLATOR_TEXT_REGION_AKA_LOCATION;

const filename = process.argv[2]

let writefile = path.parse(filename).name + '-cn' + path.parse(filename).ext

let content = fs.readFileSync(filename,'utf-8')

axios({
    baseURL: endpoint,
    url: '/translate',
    method: 'post',
    headers: {
        'Ocp-Apim-Subscription-Key': key,
        // location required if you're using a multi-service or regional (not global) resource.
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
    },
    params: {
        'api-version': '3.0',
        'from': 'en',
        'to': ['zh-cn']
    },
    data: [{
        'text': content
    }],
    responseType: 'json'
}).then(function (response) {
    fs.writeFile(writefile, JSON.stringify(response.data[0].translations[0].text, null, 4), err => {
        if (err) {
            console.error(err)
        }}
        )

        console.log(JSON.stringify(response.data[0].translations[0].text, null, 4))
    }
)