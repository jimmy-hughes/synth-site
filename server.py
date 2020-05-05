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

if __name__ == '__main__':
   app.run(debug = True)

# @app.route('/search_results/<query>')
# def search_results(query=None):
# 	return render_template('search.html', results=[], query=query)
#
# @app.route('/view/<id>')
# def view(id=None):
# 	# find album data for id
# 	albumData = next(item for item in data if item["id"] == int(id))
# 	return render_template('view.html', albumData=albumData)
#
# @app.route('/search', methods=['GET', 'POST'])
# def search():
# 	global data
# 	global results
#
# 	json_data = request.get_json()
# 	searchString = json_data["searchString"].lower()
#
# 	# clear results and start searchin
# 	# note: string must exactly match album or band name
# 	results = []
# 	for x in data:
# 		if searchString in x["band"].lower():
# 			x["bandSub1"] = x["band"].lower().find(searchString)
# 			x["bandSub2"] = x["bandSub1"] + len(searchString)
# 		else:
# 			x["bandSub1"] = -1
# 			x["bandSub2"] = -1
#
# 		if searchString in x["album"].lower():
# 			x["albumSub1"] = x["album"].lower().find(searchString)
# 			x["albumSub2"] = x["albumSub1"] + len(searchString)
# 		else:
# 			x["albumSub1"] = -1
# 			x["albumSub2"] = -1
#
# 		if x["bandSub1"] != -1 or x["albumSub1"] != -1:
# 			results.append(x)
#
# 	return jsonify(results = results)
#
# @app.route('/update_summary', methods=['GET', 'POST'])
# def update_summary():
# 	global data
#
# 	json_data = request.get_json()
# 	summary = json_data["summary"]
# 	id = json_data["id"]
#
# 	for x in data:
# 		if x["id"] == id:
# 			x["summary"] = summary
# 			break
#
# 	return jsonify(data = x)
#
# @app.route('/update_genre', methods=['GET', 'POST'])
# def update_genre():
# 	global data
#
# 	json_data = request.get_json()
# 	genre = json_data["genre"]
# 	id = json_data["id"]
#
# 	for x in data:
# 		if x["id"] == id:
# 			x["genre"] = genre
# 			break
#
# 	return jsonify(data = x)
#
# @app.route('/save', methods=['GET', 'POST'])
# def save():
# 	global data
# 	global currentID
#
# 	json_data = request.get_json()
# 	newAlbum = json_data["album"]
# 	newAlbum["id"] = currentID
# 	# create list for keeping track of deleted tracks
# 	deleted = []
# 	for x in newAlbum["tracklist"]:
# 		deleted.append(False)
# 	newAlbum["mark_as_deleted"] = deleted
# 	data.append(newAlbum)
#
# 	newID = currentID
# 	currentID = currentID + 1
# 	return jsonify(id = newID)
#
# @app.route('/delete_album', methods=['GET', 'POST'])
# def delete_album():
# 	global data
#
# 	json_data = request.get_json()
# 	id = json_data
#
# 	# remove from data
# 	# get index
# 	idx = -1
# 	for i in range(len(data)):
# 		if data[i]["id"]==id:
# 			idx = i
# 			break
# 	# remove entry from array
# 	data.pop(idx)
#
# 	# remove from results
# 	# get index
# 	idx = -1
# 	for i in range(len(results)):
# 		if results[i]["id"]==id:
# 			idx = i
# 			break
# 	# remove entry from array
# 	results.pop(idx)
#
# 	#send back the array of search results, so the client can redisplay it
# 	return jsonify(results = results)
#
# @app.route('/delete_track', methods=['GET', 'POST'])
# def delete_track():
# 	global data
# 	json_data = request.get_json()
# 	num = json_data["trackNum"]
# 	id = json_data["id"]
#
# 	for x in data:
# 		if x["id"] == id:
# 			x["mark_as_deleted"][int(num)-1] = True
# 			break
#
# 	return jsonify(data = x)
#
# @app.route('/undo_delete_track', methods=['GET', 'POST'])
# def undo_delete_track():
# 	global data
# 	json_data = request.get_json()
# 	num = json_data["trackNum"]
# 	id = json_data["id"]
#
# 	for x in data:
# 		if x["id"] == id:
# 			x["mark_as_deleted"][int(num)-1] = False
# 			break
#
# 	return jsonify(data = x)




