import argparse
import sqlite3
from flask import Flask, request
from flask_cors import CORS, cross_origin
from utils import SearchQueries, Jsonifier

parser = argparse.ArgumentParser(description='')
parser.add_argument('db_filepath', type=str,
                    help="Specify database file to predict lines")
args = parser.parse_args()
db_filepath = args.db_filepath

app = Flask(__name__)
cors = CORS(app)

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
    with sqlite3.connect(db_filepath) as cnx:
        cur = cnx.cursor()
        person_name = cur.execute(SearchQueries.person_name(person_id)).fetchone()
        person_org = Jsonifier.id_name(cur.execute(SearchQueries.person_org(person_id)).fetchall(), 'org')
        person_confs = Jsonifier.person_confs(cur.execute(SearchQueries.person_confs(person_id)).fetchall())
    return {
        'name': person_name[0],
        'org': person_org[0] if person_org else "", # id_name processes for list 
        'conferences': person_confs
    }

@app.route('/org')
@cross_origin()
def get_org():
    org_id = request.args.get('id')
    with sqlite3.connect(db_filepath) as cnx:
        cur = cnx.cursor()
        org_name = cur.execute(SearchQueries.org_name(org_id)).fetchone()
        org_persons = Jsonifier.id_name(cur.execute(SearchQueries.org_persons(org_id)).fetchall(), 'person')
    return {
        'name': org_name,
        'persons': org_persons
    }

@app.route('/conf')
@cross_origin()
def get_conf():
    conf_id = request.args.get('id')
    with sqlite3.connect(db_filepath) as cnx:
        cur = cnx.cursor()
        conf_title = cur.execute(SearchQueries.conf_title(conf_id)).fetchone()
        conf_topics = cur.execute(SearchQueries.conf_topics(conf_id)).fetchone()
        conf_pages = cur.execute(SearchQueries.conf_pages(conf_id)).fetchall()
        conf_persons = cur.execute(SearchQueries.conf_persons(conf_id)).fetchall()
    return {
        'id': conf_id,
        'title': conf_title,
        'topics': eval(conf_topics[0]),
        'pages': conf_pages,
        'persons': Jsonifier.conf_persons(conf_persons)
    }

if __name__ == '__main__':
    app.run(debug=True)
    app.run()