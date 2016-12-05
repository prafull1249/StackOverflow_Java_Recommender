__author__ = 'Prafull'

import argparse
from CheckSimilarity import CheckSimilarity
from utils import *
import json
import os

from pymongo import MongoClient



parser = argparse.ArgumentParser(description='Python module to search for similar questions in StackoverFlow')
parser.add_argument('input_str', help='Input string to check for similar questions')

#args = parser.parse_args()

#input_str = args.input_str.lower()

input_str ="how to run python program from java"

def test(input_str):
    input_str = input_str.lower()
    check_mod = CheckSimilarity(input_str)
    main = check_mod.check_similarity()
    network = check_mod.get_tags_similarity()
    result = {}
    result["main"] = main
    result["network"] = network
    #print "before"
    result = change_Data_Format(result)
    #print "after"
    if DEBUG:
        print result
    # print json.loads(result)
    return result



def change_Data_Format(result):

    mng_client = MongoClient('localhost', 27017)
    mng_db = mng_client['new_database'] #Replace mongo db name
    collection_name = 'question_collection' #Replace mongo db collection name
    collection_name_2 = 'answer_collection'
    db_cm = mng_db[collection_name]
    db_cm_2 = mng_db[collection_name_2]

    final = {}
    final["main"] = []

    js = result

    final["network"] = js['network']

    for obj in js['main']:
        temp_json = {}

        temp_json['id'] = obj['id']
        temp_json['question_sim'] = obj['question_sim']
        temp_json['title_sim'] = obj['title_sim']

        #print obj
        ques_id = obj['id']
        #print ques_id
        ques_data = db_cm.find({'id':ques_id})
        #print len(ques_data[0])
        ques_data_temp = {}
        for val in ques_data:
            for v in val:
                #print v
                if v != '_id':
                    #print v
                    ques_data_temp[v] = val[v]
        #print ques_data_temp
        #print len(ques_data_temp)

        temp_json["question"] = ques_data_temp

        ans_data = db_cm_2.find({'id':ques_id })
        #print len(ans_data[0])
        ans_data_temp_list = []
        #ans_data_temp = {}
        for val in ans_data:
            ans_data_temp = {}
            for v in val:
                if v!= '_id':
                    ans_data_temp[v] = val[v]
            ans_data_temp_list.append(ans_data_temp)

        #print len(ans_data_temp_list[0])
        temp_json["answer"] = ans_data_temp_list
        final["main"].append(temp_json)




    #print final['network']


    # with open("adi_json_file_new.json", "wb") as f:
    #     json.dump(final, f)



    mng_client.close()
    #print final

    return final




#start process
if __name__ == '__main__':

    test("convert string to number in java")
#args = ["{'voltage':120,'voltage':123}"]