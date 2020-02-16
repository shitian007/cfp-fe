import itertools

class Jsonifier:
    @staticmethod
    def id_name(results, result_type):
        return [{
            'type': result_type,
            'id': result[0],
            'text': result[1],
            'score': round(result[2], 2)
            } for result in results]

    @staticmethod
    def conf_years(confs):
        return [{
            'id': conf[0],
            'title': conf[1],
            'year': conf[2],
            'score': round(conf[3], 2)
        } for conf in confs]

    @staticmethod
    def person_org(person_orgs):
        return [{
            'type': 'person',
            'id': po[0],
            'name': po[1],
            'score': round(po[2], 2),
            'org_id': po[3],
            'org': po[4],
        } for po in person_orgs]

    @staticmethod
    def conf_persons(persons):
        return [{
            'type': 'person',
            'id': person[0],
            'name': person[1],
            'score': round(person[2], 2),
            'org_id': person[3],
            'org': person[4],
            'org_score': round(person[5], 2),
            'role': person[6]
        } for person in persons]

    @staticmethod
    def person_confs(confs):
        return [{
            'type': 'conf',
            'role': conf[0],
            'id': conf[1],
            'title': conf[2],
            'score': round(conf[3], 2)
        } for conf in confs]

    @staticmethod
    def external_ids(ids):
        return {
            'gscholar_id': ids[0],
            'orcid': ids[1],
            'dblp_id': ids[2],
            'aminer_id': ids[3],
        }

    @staticmethod
    def home_series(series):
        # Sort by (score, year) to facilitate filtering of duplicates by id, keeping most current
        series = sorted(series, key=lambda s: (s[2], [4]) , reverse=True)
        series = [next(s) for _, s in itertools.groupby(series, lambda s: s[0])]
        return [{
            'id': s[0],
            'title': s[1],
            'score': s[2],
            'conf_id': s[3],
            'conf_year': s[4],
        } for s in series]



class SearchQueries:

    # Home
    home_series = lambda num: "SELECT s.id, s.title, s.score, wc.id, wc.year FROM (SELECT id, title, score FROM Series s\
                            ORDER BY score DESC LIMIT {}) s\
                            LEFT JOIN WikicfpConferences wc ON wc.series_id=s.id".format(num)
    series_by_letter = lambda letter: "SELECT s.id, s.title, s.score, wc.id, wc.year FROM\
                                (SELECT id, title, score FROM Series WHERE title LIKE \'{}%\') s\
                                LEFT JOIN WikicfpConferences wc ON s.id=wc.series_id".format(letter)
    home_confs = lambda min_year, max_year, num: "SELECT id, title, year, score FROM WikicfpConferences\
        WHERE year>={} and year<={} ORDER BY score DESC LIMIT {}".format(min_year, max_year, num)
    home_person_orgs = lambda num: "SELECT p.id, p.name, p.score, o.id, o.name FROM Persons p\
        LEFT JOIN Organizations o ON p.org_id=o.id\
        ORDER BY p.score DESC LIMIT {}".format(num)
    home_orgs = lambda num: "SELECT id, name, score FROM Organizations ORDER BY score DESC LIMIT {}".format(num)

    # Generic Searches
    person_search = lambda search_val, num: "SELECT id, name, score FROM Persons WHERE name LIKE \'%{}%\' GROUP BY name LIMIT {}".format(
        search_val, num)
    person_org_search = lambda search_val, num: "SELECT p.id, p.name, p.score, o.id, o.name FROM Persons p\
                                            LEFT JOIN Organizations o ON p.org_id=o.id WHERE p.name LIKE \'%{}%\' GROUP BY\
                                            p.name, o.name LIMIT {}".format( search_val, num)
    org_search = lambda search_val, num: "SELECT id, name, score FROM Organizations WHERE name LIKE \'%{}%\' GROUP BY name LIMIT {}".format(search_val, num)
    conf_search = lambda search_val, num: "SELECT id, title, score FROM WikicfpConferences WHERE title LIKE \'%{}%\' GROUP BY title LIMIT {}".format(search_val, num)

    # Person Lookup
    person_name = lambda person_id: "SELECT name FROM Persons WHERE id={}".format(person_id)
    person_score = lambda person_id: "SELECT score FROM Persons WHERE id={}".format(person_id)
    person_org = lambda person_id: "SELECT o.id, o.name, o.score\
        FROM Persons p\
        JOIN Organizations o ON p.org_id=o.id WHERE p.id={}".format(person_id)
    person_external_ids = lambda person_id: "SELECT gscholar_id, orcid, dblp_id, aminer_id FROM Persons WHERE id={}".format(person_id)
    person_confs = lambda person_id: "SELECT pr.role_type, wc.id, wc.title, wc.score\
        FROM Persons p\
        JOIN PersonRole pr ON pr.person_id=p.id\
        JOIN WikicfpConferences wc ON pr.conf_id=wc.id WHERE p.id={}".format(person_id)

    # Organization Lookup
    org_name = lambda org_id: "SELECT name FROM Organizations WHERE id={}".format(org_id)
    org_score = lambda org_id: "SELECT score FROM Organizations WHERE id={}".format(org_id)
    org_persons = lambda org_id: "SELECT p.id, p.name, p.score\
        FROM Persons p\
        JOIN Organizations o ON p.org_id=o.id WHERE o.id={} ORDER BY p.id;".format(org_id)

    # Conference Lookup
    conf_title = lambda conf_id: "SELECT title FROM WikicfpConferences WHERE id={}".format(conf_id)
    conf_score = lambda conf_id: "SELECT score FROM WikicfpConferences WHERE id={}".format(conf_id)
    conf_topics = lambda conf_id: "SELECT t.topic FROM WikicfpConferences wc\
        JOIN ConferenceTopics ct ON wc.id=ct.conf_id\
        JOIN Topics t ON ct.topic_id=t.id WHERE wc.id={}".format(conf_id)
    conf_pages = lambda conf_id: "SELECT url FROM ConferencePages WHERE conf_id={}".format(conf_id)
    conf_persons = lambda conf_id: "SELECT p.id, p.name, p.score, o.id, o.name, o.score, pr.role_type\
        FROM Persons p\
        JOIN PersonRole pr ON p.id=pr.person_id\
        LEFT JOIN Organizations o ON o.id=p.org_id\
        WHERE pr.conf_id={} ORDER BY p.id;".format(conf_id)

    # Series Popover
    conf_series = lambda conf_id: "SELECT s.title FROM WikicfpConferences wc\
        JOIN Series s ON wc.series_id=s.id WHERE wc.id={}".format(conf_id)
    sister_confs = lambda conf_id: "SELECT wc.id, wc.title, wc.score FROM WikicfpConferences wc\
                    WHERE wc.series_id=(SELECT series_id FROM WikicfpConferences WHERE id={})\
                    AND wc.id!={}".format(conf_id, conf_id)