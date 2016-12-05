d3.json("data/test.json", function(data)
{
    /*  var question_array = [];
     data.main.forEach(function(d) {question_array.push(d.question)});
     var container = d3.select("#table")
     .append("li")
     .attr("class","active")
     .append("a").attr("href","#").append("i").attr("class","fa-fw").text(question_array[0].title).on("click",function()
     {
     d3.selectAll("#full_disc").text(" ");
     var disc = d3.selectAll("#full_disc").append("div").attr("class","col-md-9 well");
     disc.append("p").text("Title:" + question_array[0].title);
     disc.append("p").text("Number of votes:" + question_array[0].vote);
     });
     for(var i =1; i<question_array.length;i++)
     {
     var j = i;
     var temp = question_array[j];
     console.log(temp);
     var container1 = d3.select("#table")
     .append("li")
     .append("a").attr("href","#").append("i").attr("class","fa-fw").text(question_array[j].title).on("click",function(d)
     {
     console.log(d);
     d3.selectAll("#full_disc").text(" ");
     var disc1 = d3.selectAll("#full_disc").append("div").attr("class","col-md-9 well");
     disc1.append("p").text("Title:" + question_array[j].title);
     disc1.append("p").text("Number of votes:" + question_array[j].vote);
     });
     }
     */


    var slider1 = document.getElementById("titlesim");
  	var slider2 = document.getElementById("questionsim");
  	var max_sim = 0;

  	data.main.forEach(function(d){
        if((slider2.value * (d.question_sim) + slider1.value * (d.title_sim)) > max_sim)
        {  
            max_sim = slider2.value * (d.question_sim) + slider1.value * (d.title_sim);
        }
    });

	var question_array = []; 
	data.main.forEach(function(d){
        question_array.push(d.id);
        //	console.log(JSON.stringify(d.answer.type));
    });   
  	/*var weight_array = [];
  	var weight_id = []
    var weight = 0;
    data.main.forEach(function(d){
    	weight = (slider2.value * d.question_sim) + (slider1.value * d.title_sim);
    	weight_array.push(parseInt(weight));
    	question_array.push(d.id);
    	//console.log(weight);
    });
    weight_array.sort();
    question_array.sort();
    data.main.forEach(function(d){
    	if(d.id == question_array[0])
    	{
    		console.log((slider2.value * d.question_sim) + (slider1.value * d.title_sim));
    	}
    });*/
    var fill_color = ["#04A44B","#22B247","#40C144","#5FD040","#7DDE3D","#9BED39", "#BAFC36"];
    /*var i = 0;
	while(i<weight_array.length)
	{
		data.main.forEach(function(d){
			temp = (slider2.value * d.question_sim) + (slider1.value * d.title_sim);
			if(temp == weight_array[i])
			{
				question_array.push(d.question.id);
				i++;			
			}
		});
	}*/
	//console.log(question_array.length);
	var weight_color = 0;
	var cat3 = 0;


    var answer_array=[];
    data.main.forEach(function(d){
        answer_array.push(d.answer);
        //	console.log(JSON.stringify(d.answer.type));
    });
  //  console.log(answer_array[0]);
    var container = d3.select("#scrollable");

    var list= container.selectAll("div")
        .data(data.main)
        .enter()
        .append("div")
        .attr("class","parent")
        .attr("id",function(d){
            return d.question.id;
        })
        .text(function(d){
            return d.question.title;
        })
        .style("background-color", "gainsboro")
        .on("click",expand);
//-------------------------------------------------------------------------------------------

    data.main.forEach(function(d){
    	idq = "#" + d.question.id;
    	var cat3 = 0;

          var sim = slider2.value * (d.question_sim) + slider1.value * (d.title_sim);
          //console.log(d.title_sim);
          //max_sim = 100*max_sim
          //console.log(max_sim);
          if (sim <= 0.0)
          {
            cat3 = 6;
          }
          if(sim <= max_sim/6 && sim > 0.0)
          {
            cat3 = 5;
          }
          if(sim <= ((max_sim/6)*2) && sim > (max_sim/6))
          {
            cat3 = 4;
          }
          if(sim <= ((max_sim/6)*3) && sim > ((max_sim/6)*2))
          {
            cat3 = 3;
          }
          if(sim <= ((max_sim/6)*4) && sim > ((max_sim/6)*3))
          {
            cat3 = 2;
          }
          if(sim <= ((max_sim/6)*5) && sim > ((max_sim/6)*4))
          {
            cat3 = 1;
          }
          if(sim <= ((max_sim/6)*6) && sim > ((max_sim/6)*5))
          {
            cat3 = 0;
          }
          //console.log(cat3);
          //console.log(idq)
    	var selection =  document.getElementById(d.question.id)
                        selection.setAttribute('style','background-color:'+ fill_color[cat3] + ';');
    });


    //------------------------------------------------------------------------------------------
    //	console.log(JSON.stringify(question_array));

    function expand(){
        d3.select(this)
            .on("click",collapse)
            .append("p")
            .text(function(d){
                console.log("here");
                console.log(d);


                return "QUESTION: "+d.question.text;
            })
            .append("p")
            .text(function(d){
                var s ="";
                d.answer.forEach(function(x){
                    s = s +"\n\n ANSWER: "+x.text;
                });
                return s;
            });
    }
    function collapse(){
        d3.select(this)
            .on("click", expand)
            .select("p")
            .remove();
    }

    var scrollable = d3.select("#scrollable");

    d3.select("#bb").on('click', function() {
        var scrollheight = scrollable.property("scrollHeight");
        //console.log(scrollheight);
        //console.log(scrollheight);
        d3.select("#scrollable").transition().duration(3000)
            .tween("uniquetweenname", scrollTopTween(scrollheight/2));
    });

    d3.select("#up").on('click', function() {
        d3.select("#scrollable").transition().duration(1000)
            .tween("uniquetweenname", scrollTopTween(0));
    });
    //console.log("bhfaeij");
    var clickable = d3.select("#svg_vis")
        .selectAll("circle")
        .on("click",function(){
            var questionid = this.id.split("_");
           // console.log(questionid);
            for(var i = 0 ;i<question_array.length;i++){
                if(questionid[1]==question_array[i]){
                    var sending = parseInt(question_array.length/(i+1));
                    //var selection = "#"+questionid[1];
                    //d3.selectAll(".parent")
                        //.style("background-color",'gainsboro');

                    var selection =  document.getElementById(questionid[1])
                        selection.setAttribute('style','background-color:#42CAFF;');
                    d3.select("#scrollable")
                        .transition().duration(1000).
                    tween("uniquetween",scrollTopTween(sending));

                }
            }


        });

    function scrollTopTween(scrollTop) {
        return function() {
           // console.log(scrollTop);
            var scrollHeight = scrollable.property("scrollHeight");
            var i = d3.interpolateNumber(this.scrollTop, ((scrollHeight/scrollTop)-150));
            //console.log(this.scrollTop);
            //console.log(scrollTop);
            return function(t) { this.scrollTop = i(t); };
        };
    }

});