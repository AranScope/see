var request = require('request');
var Promise = require('promise');

var clarifai = function() {};

clarifai.prototype.tags = function(image_url) {
    console.log('/tags ' + image_url);

    return new Promise(function(fulfill, reject) {

        request.post('https://api.clarifai.com/v1/tag', {
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'Bearer NqX9HrU7Mr56hhIhXmNtqjT9oTI0Pn'
                },
                body: JSON.stringify({
                    url: image_url
                })
            },
            function(e, r, body) {
                if (e) reject(e);
                fulfill(JSON.parse(body));
            });
    });
};

module.exports = new clarifai();
