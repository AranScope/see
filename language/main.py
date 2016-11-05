import nltk
from nltk.corpus import wordnet as wn

from flask import Flask
from flask import request
from flask import json
app = Flask(__name__)

directions = ['left', 'right', 'infront']

@app.route("/similar")
def similarity():
	w1 = request.args.get('w1','')
	w2 = request.args.get('w2', '')

	similar_words = []

	w1_similar_set = wn.synsets(w1)
	w2_similar_set = wn.synsets(w2)

	if w1_similar_set and w2_similar_set:
		w1_synset = w1_similar_set[0]
		w2_synset = w2_similar_set[0]
		similar_words.append(w1_synset.wup_similarity(w2_synset))

	return str((w1, w2, max(similar_words)))

@app.route("/synonyms")
def synonyms():
	w1 = request.args.get('w','')
	
	w1_similar_set = wn.synsets(w1)
	
	return str(w1_similar_set);


@app.route("/nlp")
def nlp():
	text = request.args.get('text', '')
	tokens = nltk.word_tokenize(text)
	tags = nltk.pos_tag(tokens, tagset='universal')
	nouns = [tag[0] for tag in tags if tag[1] == 'NOUN']
	response = json.jsonify({'nouns': nouns});
	response.headers.add('Access-Control-Allow-Origin', '*')
	return response

@app.route("/")
def hello():
    return "Hello World!"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3005)