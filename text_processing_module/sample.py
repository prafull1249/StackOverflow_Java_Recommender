import zerorpc

import argparse
from CheckSimilarity import CheckSimilarity
from utils import *
import json
from  main_recommender import test




class HelloRPC(object):



    # input_str ="convert string to number in java"
    # input = {}
    # mainList = []
    # mainList.append("hello")
    # mainList.append("world")
    #
    # input["main"] = mainList


    def hello(self, name):
        print name
        #input_str = name
        res = test(name)
        #print res
        return  res
        #return self.input


    #
    # def test(self, input_str):
    #     with open("abc.txt",'w') as f:
    #         f.write("ae lavde ")
    #     input_str = input_str.lower()
    #     check_mod = CheckSimilarity(input_str)
    #     main = check_mod.check_similarity()
    #     network = check_mod.get_tags_similarity()
    #     result = {}
    #     result["main"] = main
    #     result["network"] = network
    #     print result
    #     if DEBUG:
    #         print result
    #     return result#json.dumps(result)

s = zerorpc.Server(HelloRPC())
s.bind("tcp://0.0.0.0:4242")
s.run()
