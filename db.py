import sqlite3
from flask import Flask, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
db_filepath = '/Users/shitian/Github/cfp-mining/crawls/03_jan/full_dl_flair.db'

def jsonify_search_results(results, result_type):
    """ Given list of results as List[Tuple], jsonifies each entry

    Args:
        results (List[Tuple]): List of tuples retrieved from database
        result_type (string): Either of person / organization / conference

    Returns:
        [type]: [description]
    """
    return [{
        'type': result_type,
        'id': result[0],
        'text': result[1]
          } for result in results]

def jsonify_conf_persons(persons):
    return [{
        'person_id': person[0],
        'name': person[1],
        'org_id': person[2],
        'org': person[3],
        'role': person[4]
        } for person in persons]

class SearchQueries:
    # Generic Search
    person_search = lambda search_val: "SELECT id, name FROM Persons WHERE name LIKE \'%{}%\' GROUP BY name LIMIT 30".format(search_val)
    org_search = lambda search_val: "SELECT id, name FROM Organizations WHERE name LIKE \'%{}%\' GROUP BY name LIMIT 30".format(search_val)
    conf_search = lambda search_val: "SELECT id, title FROM WikicfpConferences WHERE title LIKE \'%{}%\' GROUP BY title LIMIT 30".format(search_val)
    # Conference Lookup
    conf_title = lambda conf_id: "SELECT title FROM WikicfpConferences WHERE id={}".format(conf_id)
    conf_pages = lambda conf_id: "SELECT url FROM ConferencePages WHERE conf_id={}".format(conf_id)
    conf_persons = lambda conf_id: "SELECT p.id, p.name, o.id, o.name, pr.role_type\
        FROM Persons p\
        JOIN PersonRole pr ON p.id=pr.person_id\
        LEFT JOIN PersonOrganization po ON po.person_id=p.id\
        LEFT JOIN Organizations o ON o.id=po.org_id\
        WHERE pr.conf_id={} ORDER BY p.id;".format(conf_id)

@app.route('/home')
@cross_origin()
def hello():
    return "Home"

@app.route('/search')
@cross_origin()
def search():
    max_search_length = 300
    search_val = request.args.get('search_val')
    with sqlite3.connect(db_filepath) as cnx:
        cur = cnx.cursor()
        persons = jsonify_search_results(cur.execute(SearchQueries.person_search(search_val)).fetchall(), 'person')
        orgs = jsonify_search_results(cur.execute(SearchQueries.org_search(search_val)).fetchall(), 'org')
        confs = jsonify_search_results(cur.execute(SearchQueries.conf_search(search_val)).fetchall(), 'conf')
        results = list(filter(lambda r: len(r['text']) < max_search_length, persons + orgs + confs))
    return {
        'results': results
        }

@app.route('/person')
@cross_origin()
def get_person():
    person_id = request.args.get('id')
    return person_id

@app.route('/org')
@cross_origin()
def get_org():
    org_id = request.args.get('id')
    return org_id

@app.route('/conf')
@cross_origin()
def get_conf():
    conf_id = request.args.get('id')
    with sqlite3.connect(db_filepath) as cnx:
        cur = cnx.cursor()
        conf_title = cur.execute(SearchQueries.conf_title(conf_id)).fetchone()
        conf_pages = cur.execute(SearchQueries.conf_pages(conf_id)).fetchall()
        conf_persons = cur.execute(SearchQueries.conf_persons(conf_id)).fetchall()
    return {
        'id': conf_id,
        'title': conf_title,
        'pages': conf_pages,
        'persons': jsonify_conf_persons(conf_persons)
    }

if __name__ == '__main__':
    app.run(debug=True)
    app.run()