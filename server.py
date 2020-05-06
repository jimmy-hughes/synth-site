from flask import Flask
from flask import render_template
from flask import Response, request, jsonify, url_for

app = Flask(__name__)

@app.route('/')
def home():
	return render_template('home.html')

@app.route('/quiz')
def quiz():
	return render_template('quiz.html')

@app.route('/mod')
def mod1():
	return render_template('mod.html')

@app.route('/vco')
def vco():
	return render_template('vco.html')

@app.route('/vca')
def vca():
	return render_template('vca.html')

@app.route('/fm')
def fm():
	return render_template('fm.html')

if __name__ == '__main__':
   app.run(debug = True)