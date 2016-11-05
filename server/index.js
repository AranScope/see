var io = require('socket.io')();
var request = require('request');
var Promise = require('promise');
var fs = require('fs');
var clarifai = require('./clarifai.js');
var vision = require('./vision.js');
var shortid = require('shortid');

var save_image = function(data, filename) {
    return new Promise(function(fulfill, reject) {
        var base64Data = data.replace(/^data:image\/jpeg;base64,/, "");

        fs.writeFile(filename, base64Data, 'base64', function(err) {
            if (err) reject(err);
            fulfill('success');
        });
    });
};


io.on('connection', function(socket) {
    console.log('/connection');
    var id = shortid.generate();

    socket.on('description', function(image) {
        console.log('/description');

        save_image(image, '../images/' + id + '.jpg').then(function(success) {
            var image_url = 'https://images.aran.site/' + id + '.jpg';
            clarifai.tags(image_url).then(function(data) {
                console.log(data);
                var ret = data.results[0].result.tag.classes;
                socket.emit('describe', ret);
            });
            // vision.describe(image_url).then(function(data) {
            //     console.log(data);
            //     socket.emit('test', data);
            // })
        });

    });
});

io.listen(3004);
