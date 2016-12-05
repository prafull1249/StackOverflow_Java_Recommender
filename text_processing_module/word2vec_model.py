__author__ = 'Prafull'

from gensim.models import Word2Vec
import copy
BOOK_MODEL_PATH = "./models/complete_reference_book_model"
TITLE_MODEL_PATH = "./models/title_unicode_final"
QUESTION_MODEL_PATH = "./models/questions_unicode_final"


class Word2VecModel(object):
    """

    """

    def __init__(self):
        """
        :return:
        """
        self.book_model = Word2Vec.load(BOOK_MODEL_PATH)
        self.question_model = Word2Vec.load(QUESTION_MODEL_PATH)
        self.title_model = Word2Vec.load(TITLE_MODEL_PATH)

    def get_words_from_question_model(self, word, topn):
        """
        :param word:
        :param topn:
        :return:
        """
        return self.book_model.most_similar(word, topn)

    def get_words_from_title_model(self, word, topn):
        """
        :param word:
        :param topn:
        :return:
        """
        return self.title_model.most_similar(word, topn)

    def get_words(self, word, topn=3, from_question=True, from_title=True):
        """
        :param word:
        :param topn:
        :return:
        """
        words_dict = {}

        if from_question:
            words_dict['question'] = self.get_words_from_question_model(word,topn)

        if from_title:
            words_dict['title'] = self.get_words_from_question_model(word,topn)

        return words_dict

    def get_similarity_from_questions(self, list1,list2):

        list1_temp = copy.copy(list1)
        for word in list1_temp:
            if word not in self.question_model.vocab:
                list1.remove(word)

        list2_temp = copy.copy(list2)
        for word in list2_temp:
            if word not in self.question_model.vocab:
                list2.remove(word)

        if len(list1)>0 and len(list2)>0:
            return self.question_model.n_similarity(list1, list2)
        else:
            return 0

    def get_similarity_from_title(self, list1,list2):

        list1_temp = copy.copy(list1)
        for word in list1_temp:
            if word not in self.title_model.vocab:
                list1.remove(word)

        list2_temp = copy.copy(list2)
        for word in list2_temp:
            if word not in self.title_model.vocab:
                list2.remove(word)

        if len(list1) > 0 and len(list2) > 0:
            return self.title_model.n_similarity(list1, list2)
        else:
            return 0

    def get_sim_in_words(self, word1, word2):

        if word1 in self.question_model.vocab and word2 in self.question_model.vocab and word1 in self.title_model.vocab and word2 in self.title_model.vocab:
            sim = (self.question_model.similarity(word1, word2) + self.title_model.similarity(word1, word2))
            return sim/2.00
        return 0


    def get_similarity(self,list1, list2,from_question=True, from_answer=True):
        """
        :param list1:
        :param list2:
        :param from_question:
        :param from_answer:
        :return:
        """
        similarity_dict = {}
        similarity_dict["question"] = self.question_model.n_similarity(list1, list2)
        similarity_dict["title"] = self.title_model.n_similarity(list1, list2)
        return similarity_dict

