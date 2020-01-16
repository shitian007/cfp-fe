import sqlite3
from flask import Flask, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)

db_filepath = '/Users/shitian/Github/cfp-mining/crawls/03_jan/full_dl_flair.db'

class SearchQueries:
    person_search = lambda search_val: "SELECT id, name FROM Persons WHERE name LIKE \'%{}%\' GROUP BY name LIMIT 30".format(search_val)
    org_search = lambda search_val: "SELECT id, name FROM Organizations WHERE name LIKE \'%{}%\' GROUP BY name LIMIT 30".format(search_val)
    conf_search = lambda search_val: "SELECT id, title FROM WikicfpConferences WHERE title LIKE \'%{}%\' GROUP BY title LIMIT 30".format(search_val)

@app.route('/home')
@cross_origin()
def hello():
    return "Home"

@app.route('/search')
@cross_origin()
def search():
    search_val = request.args.get('search_val')
    with sqlite3.connect(db_filepath) as cnx:
        cur = cnx.cursor()
        persons = cur.execute(SearchQueries.person_search(search_val)).fetchall()
        orgs = cur.execute(SearchQueries.org_search(search_val)).fetchall()
        confs = cur.execute(SearchQueries.conf_search(search_val)).fetchall()
        return {
            'results': persons + orgs + confs
            }

@app.route('/get_person')
@cross_origin()
def get_person():
    person_id = request.args.get('id')
    return person_id

@app.route('/get_org')
@cross_origin()
def get_org():
    org_id = request.args.get('id')
    return org_id

@app.route('/get_conf')
@cross_origin()
def get_conf():
    conf_id = request.args.get('id')
    return conf_id

if __name__ == '__main__':
    app.run(debug=True)
    app.run()