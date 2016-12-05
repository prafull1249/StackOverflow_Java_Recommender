__author__ = 'Prafull'

from pymongo import MongoClient

import json
from utils import IP, PORT


class DataInstance(object):
    """
    Singleton Class for Database instantiation
    """
    _client = None
    _db = None

    def __init__(self, ip, port):
        if DataInstance._client is None:
            DataInstance._client = MongoClient('{}:{}'.format(ip, port))
            DataInstance._db = DataInstance._client['new_database']

    def get_db_instance(self):
        """
        :return:
        """
        return DataInstance._db


class DataInstanceHelper(object):

    def __init__(self,ip=IP, port=PORT):
        self.db = DataInstance(ip,port).get_db_instance()

    def get_db_instance(self):
        return self.db

    def get_questions_from_tag(self, tag):
        """
        :param tag:
        :return:
        """
        filter = {"tag":"{}".format(tag)}
        json_obj = self.db.tag2question_reformatted.find(filter)

        try:
            if json_obj.count() == 0:
                raise Exception("Tags have more than 1 row for questions")
        except Exception:
            print "No questions found for tag ", tag
            return []

        return json_obj[0].get("questions")

    def get_tags_dict_from_id(self, id, question=True, title=True):
        """
        :param id:
        :return:
        """
        filter = {"id":"{}".format(id)}
        json_obj = self.db.json_tags_datase.find(filter)

        try:
            if json_obj.count()>1:
                print "more than one for id ",id
                raise Exception("more than one for id ",id)
            if json_obj.count() != 1:
                raise Exception("More than one row found for id ", id)
        except Exception:
            print "Error of less value json_obj"
            return

        tags_dict = {}

        if question:
            tags_dict["question"] = json_obj[0].get("q_tags")
        if title:
            tags_dict["title"] = json_obj[0].get("t_tags")
        # print "tags_from_id for tag {} is {}".format(id, len(tags_dict))

        return tags_dict


def get_lines_from_json():

    filepath = "./json tag for each question/json_tags_datase_[{}]t.json"
    db = DataInstanceHelper().get_db_instance()
    question_id_set = set()
    question_id_list = list()
    for i in range(1,217):
        filepath = "./json tag for each question/json_tags_datase_[" + str(i) + "]t.json"
        # filepath = filepath.format(i)
        with open(filepath, 'r') as file_w:
            json_obj = json.load(file_w)
        for obj in json_obj:
            db.json_tags_datase.insert_one(obj)
            question_id_list.append(obj.get("id"))
            question_id_set.add(obj.get("id"))


def test():
    helper = DataInstanceHelper()
    db = helper.get_db_instance()
    question_result = db.tag2question_reformatted.find()[0]

    for i in question_result.get("questions"):
        print helper.get_tags_dict_from_id(i)


def get_lines_from_json_check():

    question_id_set = set()
    question_id_list = list()
    for i in range(1, 217):
        filepath = "./json tag for each question/json_tags_datase_[" + str(i) + "]t.json"
        # filepath = filepath.format(i=i)
        with open(filepath, 'r') as file_w:
            json_obj = json.load(file_w)
        for entry in json_obj:
            question_id_list.append(entry.get("id"))
            question_id_set.add(entry.get("id"))
    print len(question_id_list)

    print len(set(question_id_list))
    # print len(question_id_set )
    return question_id_set


# test Database helper functionality
# test()
