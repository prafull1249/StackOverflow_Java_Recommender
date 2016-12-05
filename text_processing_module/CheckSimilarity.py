__author__ = 'Prafull'

from database_operations import DataInstanceHelper
from word2vec_model import Word2VecModel
from recommender import *
from utils import DEBUG,NO_OF_QUESTIONS


class CheckSimilarity(object):
    """
        Check similarity connecting results from database and word2vecModel
    """

    _model = Word2VecModel()
    _db_helper = DataInstanceHelper()

    def __init__(self, input_str):
        self.input_str = input_str
        self.input_str_param = format_input_str_parameters(input_str)

    def convert_to_json_str(self,json_obj):
        return json.dumps(json_obj)

    def get_question_set(self, tags):
        set_from_tags = set()
        for tag in tags:
            set_result = CheckSimilarity._db_helper.get_questions_from_tag(tag)
            if DEBUG:
                print "for tag {tag} set_result is of length {length}".format(tag=tag, length=len(set_result))
            set_from_tags.update(set_result)
        return set_from_tags

    def get_similarity(self, qset):
        helper = CheckSimilarity._db_helper
        model = CheckSimilarity._model
        result_arr = []
        for i, question_id in enumerate(qset):
            # print i
            temp = {}
            temp["id"] = question_id
            tags_dict = helper.get_tags_dict_from_id(question_id)
            if tags_dict is None:
                continue
            question_tags = tags_dict.get("question")
            title_tags = tags_dict.get("title")
            temp["title_sim"] = model.get_similarity_from_questions(question_tags, self.input_str_param.get("q_tags"))
            temp["question_sim"] = model.get_similarity_from_title(title_tags, self.input_str_param.get("t_tags"))
            result_arr.append(temp)
        return (result_arr)

    def check_similarity(self):
        q_tags = self.input_str_param.get("q_tags")
        t_tags = self.input_str_param.get("t_tags")
        q_set_from_qtags = self.get_question_set(q_tags)
        q_set_from_ttags = self.get_question_set(t_tags)
        q_set_from_qtags.update(list(q_set_from_ttags))
        total_set = list(q_set_from_qtags)[:NO_OF_QUESTIONS]

        if DEBUG:
            print "total len of questions from questions and tags ", len(q_set_from_qtags)
        result = self.get_similarity(total_set)
        return result

    def get_similarity_words(self,tag1,tag2):
        return CheckSimilarity._model.get_sim_in_words(tag1, tag2)

    def get_tags_similarity(self):

        dict_network = {}
        tags = self.input_str_param.get("q_tags") + self.input_str_param.get("t_tags")
        nodes = []
        links = []

        for ind in range(len(tags)):
            tag = tags[ind]
            temp = {}
            temp["group"] = 1
            temp["id"] = tag
            nodes.append(temp)
            for j in range(ind+1, len(tags)):
                temp_links = {}
                tag2 = tags[j]
                temp_links["source"] = tag
                temp_links["target"] = tag2

                temp_links["value"] = self.get_similarity_words(tag,tag2)

                if temp_links.get("value") == 0:
                    continue
                links.append(temp_links)

        dict_network["nodes"] = nodes
        dict_network["links"] = links
        return dict_network

def test(input_str):
    input_str = input_str.lower()
    check_mod = CheckSimilarity(input_str)
    main = check_mod.check_similarity()
    network = check_mod.get_tags_similarity()
    result = {}
    result["main"] = main
    result["network"] = network
    print result

# test("exception nullpointer application is not able to display CSS")
