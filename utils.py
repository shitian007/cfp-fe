class Jsonifier:
    @staticmethod
    def id_name(results, result_type):
        return [{
            'type': result_type,
            'id': result[0],
            'text': result[1],
            'score': result[2]
            } for result in results]

    @staticmethod
    def conf_years(confs):
        return [{
            'id': conf[0],
            'title': conf[1],
            'year': conf[2],
            'score': conf[3]
        } for conf in confs]

    @staticmethod
    def person_org(person_orgs):
        return [{
            'type': 'person',
            'id': po[0],
            'name': po[1],
            'score': po[2],
            'org_id': po[3],
            'org': po[4],
        } for po in person_orgs]

    @staticmethod
    def conf_persons(persons):
        return [{
            'type': 'person',
            'id': person[0],
            'name': person[1],
            'score': person[2],
            'org_id': person[3],
            'org': person[4],
            'org_score': person[5],
            'role': person[6]
            } for person in persons]

    @staticmethod
    def person_confs(confs):
        return [{
            'type': 'conf',
            'role': conf[0],
            'id': conf[1],
            'title': conf[2],
            'score': conf[3]
        } for conf in confs]


class SearchQueries:

    # Home
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
    conf_topics = lambda conf_id: "SELECT categories FROM WikicfpConferences WHERE id={}".format(conf_id)
    conf_pages = lambda conf_id: "SELECT url FROM ConferencePages WHERE conf_id={}".format(conf_id)
    conf_persons = lambda conf_id: "SELECT p.id, p.name, p.score, o.id, o.name, o.score, pr.role_type\
        FROM Persons p\
        JOIN PersonRole pr ON p.id=pr.person_id\
        LEFT JOIN Organizations o ON o.id=p.org_id\
        WHERE pr.conf_id={} ORDER BY p.id;".format(conf_id)