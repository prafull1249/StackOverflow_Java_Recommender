__author__ = 'Prafull'

from textblob import TextBlob as tb
from textblob import Word
import json, math

from gensim.models import Word2Vec

NOUNS = ["NNS","NN","NNP"]

W2V_MODEL_TITLE = Word2Vec.load("./models/title_unicode_final")
W2V_MODEL_QUESTION = Word2Vec.load("./models/questions_unicode_final")

title_model = W2V_MODEL_TITLE
question_model = W2V_MODEL_QUESTION


with open("./reformatted_metadata/dict_t_idf_reformatted.json",'r') as file_idf :
    title_idf_temp = json.load(file_idf)
    title_idf = {}
    for obj in title_idf_temp:
        title_idf[obj.get('word')] = obj.get('count')

with open("./reformatted_metadata/dict_q_idf_reformatted.json",'r') as file_idf :
    question_idf_temp = json.load(file_idf)
    question_idf = {}
    for obj in question_idf_temp:
        question_idf[obj.get('word')] = obj.get('count')

len_question_idf = len(question_idf)
len_title_idf = len(title_idf)

def get_nouns(blob):
    """
    Nouns extractor
    :param blob:
    :return:
    """
    nouns = set()
    try:
        for tag in blob.tags:
            if tag[1] in NOUNS:
                nouns.add(tag[0])
    except UnicodeDecodeError as ex:
        print str(ex)

    return list(nouns)


def calculate_tf_idf(nouns, input_str, type):

    dict_tf ={}
    words_input = input_str.split(' ')
    len_words_input = len(words_input)
    for word in words_input:
        new_w = word
        for c in word:
            if c in ['\'' ,'#' ,'$' ,'%' ,'*' ,'~'] or c.isdigit():
                new_w= word.replace(c,'')
            if c in ['&','(',',',')',';','_','=','.','!','?','[',']',':',"+",'\\','/','}','{','"','-']:
                new_w = new_w.replace(c,' ')
        word_list = new_w.split(' ')
        for w in word_list:
            if w in dict_tf:
                dict_tf[w] = dict_tf[w] + 1
            else:
                dict_tf[w] = 1

    dict_tfidf_score = []

    for noun in nouns:
        new_w = noun
        for c in noun:
            if c in ['\'' ,'#' ,'$' ,'%' ,'*' ,'~','@'] or c.isdigit():
                new_w= noun.replace(c,'')
            if c in ['&','(',',',')',';','_','=','.','!','?','[',']',':',"+",'\\','/','}','{','"','-']:
                new_w = new_w.replace(c,' ')
        word_list = new_w.split(' ')
        for word in word_list:
            # title processing
            number = dict_tf.get(word)
            if number is not None:
                tf = float(number)/float(len_words_input)
            else:
                continue
            if type == "t":
                count = title_idf.get(word)
                if count is None:
                    count = 0
                score = tf * math.log(float(len(title_idf)) /float( (1 + count)))
                dict_tfidf_score.append((score,word))
            # question processing
            else:
                count = question_idf.get(word)
                tf = float(dict_tf.get(word))/float(len_words_input)
                if count is None:
                    count = 0
                score = tf * math.log(float(len_question_idf) / float((1 + count)))
                dict_tfidf_score.append((score,word))

    return dict_tfidf_score


def get_input_for_tfidf(input_str,type):
    input_str = input_str.lower()
    blob = tb(input_str)
    nouns = get_nouns(blob)
    return nouns, calculate_tf_idf(nouns,input_str,type)


def get_idf_scores(input_str):
    return get_input_for_tfidf(input_str)


def order_scores(q_score, t_score):
    ordered_score_title = [x for (y,x) in sorted(t_score)]
    ordered_score_question = [x for (y,x) in sorted(q_score)]
    return ordered_score_question, ordered_score_title


def get_expanded_list_q(ordered_score_question):
    for word in ordered_score_question:
        if word in question_model.vocab:
            expanded_q_words = [y for (y,x) in question_model.most_similar(word,topn=5)]
            expanded_q_words.append(word)
        else:
            expanded_q_words = [word]

    return expanded_q_words


def get_expanded_list_t(ordered_score_title):
    for word in ordered_score_title:

        if word in title_model.vocab:
            expanded_t_words = [y for (y,x) in title_model.most_similar(word,topn=5)]
            expanded_t_words.append(word)
        else:
            expanded_t_words = [word]

        return expanded_t_words


def format_input_str_parameters(input_str):
    q_nouns, score_q = get_input_for_tfidf(input_str,"q")
    t_nouns,score_t = get_input_for_tfidf(input_str,"t")

    ordered_score_q = [x for (y,x) in sorted(score_q)]
    ordered_score_t = [x for (y,x) in sorted(score_t)]
    expanded_words_q = get_expanded_list_q(ordered_score_q[:5])
    expanded_words_t = get_expanded_list_t(ordered_score_t[:5])

    temp = dict()
    temp['q_tags'] = expanded_words_q
    temp['t_tags'] = expanded_words_t
    temp['t_nouns'] = t_nouns
    temp['q_nouns'] = q_nouns
    return temp
