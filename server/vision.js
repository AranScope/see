var bodyParser = require('body-parser');
var request = require('request');
var Promise = require('promise');

var vision = function() {

};

vision.prototype.tags_url = function(image_url) {
    return new Promise(function(fulfill, reject) {
        request.post('https://api.projectoxford.ai/vision/v1.0/tag', {
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': '79929b9d080b4d3785274a075ce113ff'
            },
            json: {
                url: image_url
            }
        }, function(e, r, body) {
            if (e) reject(e);

            fulfill(body);
        });
    })

};

vision.prototype.describe = function(image_url) {
    console.log(image_url);
    return new Promise(function(fulfill, reject) {
        request.post('https://api.projectoxford.ai/vision/v1.0/describe?maxCandidates=5', {
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': '79929b9d080b4d3785274a075ce113ff'
            },
            json: {
                url: image_url
            }
        }, function(e, r, body) {
            if (e) reject(e);

            fulfill(body);
        });
    })
};

vision.prototype.analyze = function(image_url) {

    return new Promise(function(fulfill, reject) {
        request.post('https://api.projectoxford.ai/analyze/v1.0', {
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': '79929b9d080b4d3785274a075ce113ff'
            },
            json: { url: image_url }

        }, function(e, r, body) {
            if (e) reject(e);

            fulfill(body);
        });
    });
};

module.exports = new vision();
