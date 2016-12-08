var Subjects =      require('./models/SubjectViews');
var zerorpc =       require("zerorpc");
var jsonFile  = require('jsonfile');

module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes	
	// sample api route
 app.get('/api/data', function(req, res) {
  // use mongoose to get all nerds in the database
  Subjects.find({}, {'_id': 0, 'school_state': 1, 'resource_type': 1, 'poverty_level': 1, 'date_posted': 1, 'total_donations': 1, 'funding_status': 1, 'grade_level': 1}, function(err, subjectDetails) {
   // if there is an error retrieving, send the error. 
       // nothing after res.send(err) will execute
   if (err) 
   res.send(err);
    res.json(subjectDetails); // return all nerds in JSON format
  });
 });

 



 // frontend routes =========================================================
 app.get('/results', function(req, res) {

  //console.log(req.params['search'])
  console.log("query : ", req.query['search'])
   console.log("Fetch Results")
  //res.send(req.query['search']);
    getResponse(res , req.query['search'])
  //jsonResult = JSON.stringify(getResponse(), function() {
    console.log("got response")
    

  
 });
}


function getResponse(res, query){

    

    var client = new zerorpc.Client({timeout  : 50000, heartbeatInterval: 500000});
    client.connect("tcp://127.0.0.1:4242");
    client.invoke("hello", query, function(error, res1, more) {
    console.log("Waiting....")
    console.log("error is ", error)
    jsonRes = JSON.stringify(res1);
    //console.log(jsonRes);  
    //return res;
        
    var jsonfile = require('jsonfile')
    console.log(require('path').dirname(require.main.filename))
    var file = 'public/data/test.json'
   // var obj = {name: 'JP'}
 
   // jsonfile.writeFileSync(file, res1)
   // var file = '/public/data/test.json';    
    //jsonfile.writeFileSync(file, jsonRes);
//    setTimeout(function(){
//    console.log('setTimeout');
//    
//    }   , 5000);   
      // res.json(jsonRes); 
     res.jsonp(jsonRes); 
    

  });
}