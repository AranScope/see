var socket = io("https://seeapi.aran.site");

socket.on("describe", function(data) {
    if (final_transcript.contains('describe')) {
        var memes = data.slice(0, 5)
        responsiveVoice.speak(memes.toString(), "UK English Male")
    } else {
        if(data.containsAny(final_nouns) && final_nouns.length > 0) {
            console.log(final_transcript);
            console.log(final_nouns);
            $('#text').html(final_transcript);

            responsiveVoice.speak('yes, that is in the room', "UK English Male");
        } else {
            responsiveVoice.speak('no, that is not in the room', "UK English Male");
        }
    }
    console.log(data);
});

socket.on("test", function(data) {
    console.log(data);
})

function take_snapshot() {
    Webcam.snap(function(data_uri) {
        socket.emit("description", data_uri)
    });
}

function nlp(words, cb) {
    var nlp_url = 'https://nlp.aran.site/nlp?text=';

    $.get(nlp_url + words, function(data, status) {
        cb(data);
    });
}

var final_transcript = '';
var final_nouns = [];

String.prototype.contains = function(substring) {
    return this.indexOf(substring) > -1;
}

Array.prototype.contains = function(substring) {
    return this.indexOf(substring) > -1;
}

String.prototype.containsAny = function(stringarray) {
    
    for(var i in stringarray) {
        if(this.contains(stringarray[i])) return true;
    }

    return false;
}

Array.prototype.containsAny = function(stringarray) {
    
    for(var i in stringarray) {
        if(this.contains(stringarray[i])) return true;
    }

    return false;
}


var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;

if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} else {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-GB";

    recognition.onstart = function() {
        recognizing = true;
    };

    recognition.onend = function() {
        recognizing = false;
        if (ignore_onend) {
            return;
        }

        console.log(final_transcript);
        final_nouns = [];
        nlp(final_transcript, function(data) {
            console.log(data);
            final_nouns = data['nouns'];

        });

        take_snapshot();
    };

    recognition.onresult = function(event) {
        var interim_transcript = '';
        if (typeof(event.results) == 'undefined') {
            recognition.onend = null;
            recognition.stop();
            return;
        }
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
                $('#text').html(interim_transcript);
            }
        }


    };
}


$(function() {
    Webcam.attach("#webcam")

    //setInterval(take_snapshot, 5000);
    var win_height = $(window).innerHeight();
    //$('#webcam').css('height', win_height + 'px');

    $('#button').click(function() {
        $('#button').html('Stop recording');
        $('#button').css('background-color', '#e74c3c');

        if (recognizing) {
            $('#button').html('Start recording');
            $('#button').css('background-color', '#2ecc71');
            recognition.stop();
            return;
        }
        final_transcript = '';
        recognition.start();
        ignore_onend = false;
        start_timestamp = event.timeStamp;
    });
});
