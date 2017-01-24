1. ABSTRACT:

A Visual Recommendation System serves two major purposesit gives the user the results they want in a visual format which can be more  comprehensible and it provides the user more control in terms of the kind of results they want. It is user driven and this makes it more effective and satisfying. In our project, we focus on the dataset from StackOverflow-Java and use it to design a visual recommendation system around it. As the system is visual, the results are displayed in the form of visual charts and graphs. Also, these visualizations are highly interactive giving the user the experience of interacting with the data as they see fit. This system lets the users navigate and explore the StackOverflow dataset in a way which is both easy and effective. The system strives to be beneficial to users of all
kinds of experience levels in Java. This makes it adaptable and flexible to the user’s needs without the user having to explicitly specifying any of this information. We hope to make it a userfriendly and user-centric portal for all things Java.

2.    VISUALIZATION DESIGN

2.1 Research Question #1 – Recommendations summary
Why does the Visualization solve the issue: The visual recommender system tries to address the problem of depicting most of the resultant recommendation and search queries to a user in single page in form of a Bubble chart and a list of color coded recommendations. This prevents the user to skim through pages of search results which is highly inconvenient to keep track of. The Bubble chart as shown in the picture can be visualized in two states – 
A cohesive bubble chart– The picture shown below shows different bubbles of varying size and color. In this visualization, the results of all the given questions are quantified by Title similarity and question text similarity as Title and Question capture the semantical context of the post more than anything else in a given question. Moreover, there is a provision to weight question and title similarity so that the resultant similarity being calculated is inclined towards the more weighted parameter. 
Hence, we have considered color and size to depict title and question’s text similarity respectively. 
 
Categorization of recommendations: The second part of the visualization are 3 different bubble charts varied according to user reputation, acceptance and votes. This visualization helps the user to do perceive the results from a qualitative viewpoint. It gives an overall comprehensive view of the results with the entries divided in high, medium and low number of votes, user reputation or acceptance rate each at different times. We considered these 3 parameters as they are the most reliable ones which a user generally resorts to while measuring the quality of a particular post. 

Listing the color coded recommendation: The question and title similarity is combined together by the weights provided by the user. This similarity is reflected in the green shades of the color coded recommendations result. The darker the color is more similar it is to the given input string considering the weighted similarity.
How does the visualization solve the issue: This section addresses this question with reference to the two visualization patterns referenced above – 
A cohesive bubble chart: The qualities of the attributes of this visualization which helps the visualization to address different aspect of the research question are discussed below: 
	Color – The color signifies how similar the title of each of resulting posts are similar to the input string. The darkest blue being the most similar and the similarity decreases as it the color intensity fades.
	Size - The size of each bubble also varies which signifies how similar the question text of each resulting posts is similar to the given input string. The larger the bubble, more similar the question text of it is to the input string.
Categorization of recommendations: The categorization of the recommendations in to high, low and medium categories of 3 carefully selected parameters helps the user analyze the recommendations qualitatively. The visual recommender emphasizes to visualize these results based on three main categories: Votes, User reputation and Acceptance rate of answers. To visualize the results based on these categories, the user can click the buttons shown below to classify them into high, low and medium category of the respective categories.  
Listing the color coded recommendation: The weighted title and Question’s text overall similarity of the resulting posts are color coded in green shades. The darker the shade is, more similar it is to the input string.

2.1 Research Question #2 – Directions to new inexperienced recommendation

Why does the visualization solve the issue: This research question is addressed by the network graph in the visual recommender. The visualization of a network diagram represents all the keywords related to the important terms extracted from the given input query. Specifically, we select top 5 most similar words to the keywords extracted that conveys that if there are 5 extracted keywords from a given input string, we get 25 total words. These keywords are the topmost similar words to all the keywords extracted from the given string through POS tagging and TF-IDF. 
How does the visualization solve the issue: The user can go through each of the keywords in the network and explore the keywords related to the keywords in the input string. The similarity values of a given keyword with others is depicted by the thickness of the edge. So these words which are related to a given keyword by thick edges are most probably the words the user should start exploring on.
In this case, if a user just types a keyword of interest to him, he will also get a network graph related to the given word which will inform him of the different associated topics input query word.

3.    METHODOLOGY

The recommender system built for StackOverFlow Java Dataset is a full stack web application with front-end developed in Jquery, Javascript, D3.js and the backend in NodeJs. The backend communicates with a ZeroMQ server running in Python to serve the queries to find similar questions for an input string given by the user. 
Following is the architecture of our web application – 

 
The visual recommender is implemented using different NLP techniques like TF-IDF, specifically trained Word2Vec model and POS tagging to extract similar results. As data exchange is easiest in the form of JSON format, it was impending on us to use MongoDB as our database to store all the processed and given data. Moreover, it makes easier to work in Python owing to its compatibility to dictionaries. The following steps were followed in order to implement the entire recommendation system – 
	Data Cleaning and Preprocessing
	Data analysis
	Data preprocessing
	Setting up Database
	Questions
	Answers
	Tags for each question
	Questions for each Tag
	POS tagging and Extraction of nouns
	TF-IDF 
	Training the Word2Vec model
These steps are described as follows in subsequent sections.
An overview of the entire implementation is shown below demonstrating the techniques used at each stage and its output. 

 

3.1.   Data Preprocessing and Analysis

Data Analysis: A quick inspection of the dataset available, we recognized that tags, questions text and title are of prime importance in finding similar questions to a given input string. As the answers to a given question share similar title, it was decided to generate a id against title of a given post. We had a total of 215968 entries of Stackoverflow and hence we generated equal number of ids corresponding to each title.
Data Preprocessing: The data available was required to be used as it is while displaying it in a forum style along with some processed results. Data preprocessing was mainly required for populating the database and setting up data for calculating TF-IDF of the extracted keywords of a given query. Moreover, data preprocessing was also required while training the Word2Vec model where contextual words are taken into consideration and similarity is calculated accordingly. So we followed the following steps to make sure that we get optimum results from Word2Vec trained model. 
	Inspect the user written posts and curate a list of extra stopwords specific to the data available.
	Extract questions text and title separately from all the posts in the given data.
	For each question text and title, replace punctuations with empty strings and remove stopwords from the curated list of stopwords.
	Store the resultant set of words as a list and store these set of words corresponding to each title and question’s text as a list to get a matrix of words. Thus we get a two list of list of words respectively corresponding to titles and question’s text. 
	We make these two list to train two Word2Vec models corresponding to title and Question’s text to get the respective similarity values.
Setting up the Database:
As the task at hand of mining text and recommending based on its results is computation heavy, it was mandatory on our part to process the text available beforehand and store it in database. As already mentioned, we did the text processing in Python using NLTK and Textblob packages, JSON was the most obvious data format used for data exchange owing to its compatibility with python dictionary. And hence we used MongoDB as our preferred database for this implementation. We produced the following collections in MongoDB to store already processed information. They are described as follows – 
	Questions – Contains all the entries of type questions available in the dataset. It has all the columns id, code, user_id, title, text, tag,, content, reputation, accept_rate, time, vote and type.
	Answers - Contains all the entries of type questions available in the dataset. It has all the columns id, code, user_id, title, text, tag,, content, reputation, accept_rate, time, vote and type.
	Tags for each question- We could find that each of the question has a set of tags which are most relevant to the question. However, it was observed that the set of tags are too limited to check similarity to other questions. Hence, each tag was input to Word2vec trained model to get its 5 most similar words and stored against the id of the question in a collection named tags_for_each_question.
	Questions for each Tag – As there are 216568 questions, computing similarity of a given input string to all the questions is unacceptable. To expedite this process, a hash was created where all the questions in which of a particular tag occurs or is related is recorded.
	TF-IDF – The idf value which is described later is already calculated for all the tokenized words in question’s text and titles. The idf collections are specific to all the words in title of questions and the text of questions.

3.2.    POS tagging and Extraction of nouns 

POS tagging refers to parts of speech tagging. It helps to extract different parts of speech by employing different nltk natural language processing techniques. In our case, only nouns are extracted as they are the only words which can approximately capture what is the given input string about. Thus, we extract all the common nouns and proper nouns from the tagged string. We use Textblob python module to do so.
3.3.    TF-IDF 

We take TF-IDF value of all the extracted keywords to sort them according to their significance. If we get more than 10 keywords from an input string, the processing time to process results for 10 keywords will be relatively longer. Therefore, to prevent unimportant words from being processed, we sort the values of the extracted keywords according to its Tf-IDF values and take top 5 important keywords. The text of title and questions is tokenized in words and are counted for its occurrence in the all the 215968 questions. The stop words are removed from the tokenized list of words. Once the count of the occurrences of all the keywords is obtained, idf of each keyword is calculated by the given formula.

for a given word i,

IDF(i)=ln⁡((Number of total questions)/(Total occurences of i in all questions))

So the value of IDF of all the keywords is stored in the database already to prevent computation time while processing the recommendations of a given query. The Term frequency refers count of words occurring in the given input string. TF-IDF value is the multiplication of Term frequency and IDF value.

3.4.    Word2Vec Model

The Word2Vec model lays the foundation of our recommendation system. It is responsible to measure similarity between two given list of tags which is used to list title and question similarity. It also finds out the most similar words to the extracted keywords in the given input string which is used in the network graph. The text of questions and title is used to train the Word2Vec model. We trained the models by varying the number of layers(as it is a deep learning based model) and minimum count of words. We observed the best results at 100 layers and 10 minimum count of words.
