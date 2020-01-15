import sqlite3
from flask import Flask, request
app = Flask(__name__)

@app.route('/home')
def hello():
    return "Home"

@app.route('/get_person')
def get_person():
    person_id = request.args.get('id')
    return person_id

@app.route('/get_org')
def get_org():
    org_id = request.args.get('id')
    return org_id

@app.route('/get_conf')
def get_conf():
    conf_id = request.args.get('id')
    return conf_id

if __name__ == '__main__':
    app.run(debug=True)
    app.run()