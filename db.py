import sqlite3
from flask import Flask, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
db_filepath = '/Users/shitian/Github/cfp-mining/crawls/03_jan/full_dl_flair.db'

class Jsonifier:
    @staticmethod
    def id_name(results, result_type):
        return [{
            'type': result_type,
            'id': result[0],
            'text': result[1]
            } for result in results]

    @staticmethod
    def person_org(person_orgs):
        return [{
            'type': 'person',
            'id': po[0],
            'name': po[1],
            'org_id': po[2],
            'org': po[3],
        } for po in person_orgs]

    @staticmethod
    def conf_persons(persons):
        return [{
            'type': 'person',
            'id': person[0],
            'name': person[1],
            'org_id': person[2],
            'org': person[3],
            'role': person[4]
            } for person in persons]


class SearchQueries:
    # Generic Searches
    person_search = lambda search_val, num: "SELECT id, name FROM Persons WHERE name LIKE \'%{}%\' GROUP BY name LIMIT {}".format(
        search_val, num)

    person_org_search = lambda search_val, num: "SELECT p.id, p.name, o.id, o.name FROM Persons p\
                                            LEFT JOIN PersonOrganization po ON po.person_id=p.id\
                                            LEFT JOIN Organizations o ON po.org_id=o.id WHERE p.name LIKE \'%{}%\' GROUP BY p.name LIMIT {}".format(
                                                search_val, num)

    org_search = lambda search_val, num: "SELECT id, name FROM Organizations WHERE name LIKE \'%{}%\' GROUP BY name LIMIT {}".format(search_val, num)

    conf_search = lambda search_val, num: "SELECT id, title FROM WikicfpConferences WHERE title LIKE \'%{}%\' GROUP BY title LIMIT {}".format(search_val, num)

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

@app.route('/autocomplete_search')
@cross_origin()
def autocomplete_search():
    max_results = 30
    max_search_length = 300
    search_val = request.args.get('search_val')
    with sqlite3.connect(db_filepath) as cnx:
        cur = cnx.cursor()
        persons = Jsonifier.id_name(cur.execute(SearchQueries.person_search(search_val, max_results)).fetchall(), 'person')
        orgs = Jsonifier.id_name(cur.execute(SearchQueries.org_search(search_val, max_results)).fetchall(), 'org')
        confs = Jsonifier.id_name(cur.execute(SearchQueries.conf_search(search_val, max_results)).fetchall(), 'conf')
        results = list(filter(lambda r: len(r['text']) < max_search_length, persons + orgs + confs))
    return {
        'results': results
        }

@app.route('/search')
@cross_origin()
def search():
    search_val = request.args.get('search_val')
    with sqlite3.connect(db_filepath) as cnx:
        max_results = 10
        max_search_length = 300
        cur = cnx.cursor()
        person_orgs = Jsonifier.person_org(cur.execute(SearchQueries.person_org_search(search_val, max_results)).fetchall())
        orgs = Jsonifier.id_name(cur.execute(SearchQueries.org_search(search_val, max_results)).fetchall(), 'org')
        confs = Jsonifier.id_name(cur.execute(SearchQueries.conf_search(search_val, max_results)).fetchall(), 'conf')
    # Filter and sort by length of each category
    orgs = list(filter(lambda r: len(r['text']) < max_search_length, orgs))
    confs = list(filter(lambda r: len(r['text']) < max_search_length, confs))
    results = []
    for res_list, _ in sorted(list(map(lambda l: (l, len(l)), [person_orgs, orgs, confs])), key=lambda t: t[1], reverse=True):
        results += res_list
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
        'persons': Jsonifier.conf_persons(conf_persons)
    }

if __name__ == '__main__':
    app.run(debug=True)
    app.run()