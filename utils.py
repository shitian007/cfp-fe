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
                                            LEFT JOIN Organizations o ON po.org_id=o.id WHERE p.name LIKE \'%{}%\' GROUP BY\
                                            p.name, o.name LIMIT {}".format( search_val, num)

    org_search = lambda search_val, num: "SELECT id, name FROM Organizations WHERE name LIKE \'%{}%\' GROUP BY name LIMIT {}".format(search_val, num)

    conf_search = lambda search_val, num: "SELECT id, title FROM WikicfpConferences WHERE title LIKE \'%{}%\' GROUP BY title LIMIT {}".format(search_val, num)

    # Conference Lookup
    conf_title = lambda conf_id: "SELECT title FROM WikicfpConferences WHERE id={}".format(conf_id)

    conf_topics = lambda conf_id: "SELECT categories FROM WikicfpConferences WHERE id={}".format(conf_id)

    conf_pages = lambda conf_id: "SELECT url FROM ConferencePages WHERE conf_id={}".format(conf_id)

    conf_persons = lambda conf_id: "SELECT p.id, p.name, o.id, o.name, pr.role_type\
        FROM Persons p\
        JOIN PersonRole pr ON p.id=pr.person_id\
        LEFT JOIN PersonOrganization po ON po.person_id=p.id\
        LEFT JOIN Organizations o ON o.id=po.org_id\
        WHERE pr.conf_id={} ORDER BY p.id;".format(conf_id)