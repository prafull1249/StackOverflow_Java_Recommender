  var BubbleChart, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  var max_vote = 0;
  var max_sim = 0;
  var slider1 = document.getElementById("titlesim");
  var slider2 = document.getElementById("questionsim");
  buttontitle = document.getElementById("titlebutton");

  /*var inputElement = document.getElementById("sim_submit");
  inputElement.addEventListener('click', function(){
    slider_values(slider1,slider2);
  });*/

  function slider_values(a,b){
    slider1 = a;
    slider2 = b;
  }

  //console.log(slider1.value + " = " + slider2.value);

  BubbleChart = (function() {
    function BubbleChart(data) {
      this.hide_details = __bind(this.hide_details, this);
      this.show_details = __bind(this.show_details, this);
      this.hide_votes = __bind(this.hide_votes, this);
      this.hide_rep = __bind(this.hide_rep, this);
      this.hide_acc = __bind(this.hide_acc, this);
      this.display_votes = __bind(this.display_votes, this);
      this.display_rep = __bind(this.display_rep, this);
      this.display_acc = __bind(this.display_acc, this);
      this.move_towards_votes = __bind(this.move_towards_votes, this);
      this.move_towards_rep = __bind(this.move_towards_rep, this);
      this.move_towards_acc = __bind(this.move_towards_acc, this);
      this.display_by_votes = __bind(this.display_by_votes, this);
      this.display_by_rep = __bind(this.display_by_rep, this);
      this.display_by_acc = __bind(this.display_by_acc, this);
      this.move_towards_center = __bind(this.move_towards_center, this);
      this.display_group_all = __bind(this.display_group_all, this);
      this.start = __bind(this.start, this);
      this.create_vis = __bind(this.create_vis, this);
      this.create_nodes = __bind(this.create_nodes, this);
      var max_amount;
      this.data = data.main;
      this.width = 820;
      this.height = 600;
        
        d3.select('#gates_tooltip').remove();
      this.tooltip = CustomTooltip("gates_tooltip", 240);
      this.center = {
        x: this.width / 2,
        y: this.height / 2
      };
      this.vote_centers = {
        "High votes": {
          x: this.width / 3,
          y: this.height / 2
        },
        "Medium votes": {
          x: this.width / 2,
          y: this.height / 2
        },
        "Low votes": {
          x: 2 * this.width / 3,
          y: this.height / 2
        }
      };
      this.rep_centers = {
        "High user reputation": {
          x: this.width / 3,
          y: this.height / 2
        },
        "Medium user reputation": {
          x: this.width / 2,
          y: this.height / 2
        },
        "Low user reputation": {
          x: 2 * this.width / 3,
          y: this.height / 2
        }
      };
      this.acc_centers = {
        "High acceptance rate": {
          x: this.width / 3,
          y: this.height / 2
        },
        "Medium acceptance rate": {
          x: this.width / 2,
          y: this.height / 2
        },
        "Low acceptance rate": {
          x: 2 * this.width / 3,
          y: this.height / 2
        }
      };
      this.layout_gravity = -0.01;
      this.damper = 0.1;
      this.vis = null;
      this.nodes = [];
      this.force = null;
      this.circles = null;


      
      this.fill_color = d3.scale.ordinal().domain([1,2,3,4,5,6,7]).range(["#3C05B8","#3C2BC1","#3C51CA","#3D78D3","#3D9EDC","#3DC4E5", "#3EEBEF"]); 

      //this.fill_color = d3.scale.ordinal().domain(["High title_sim", "Medium title_sim", "Low title_sim"]).range(["#003F87", "#0075FB", "#71B3FF"]);
      max_amount = d3.max(this.data, function(d) {
        var tmp = 10 * (d.question_sim);
        return parseInt(tmp);
      });
        max_sim = 0;
      data.main.forEach(function(d){
        if(d.title_sim > max_sim)
        {  
            max_sim = d.title_sim;
        }
        for(var i = 0; i<d.answer.length; i++)
        {
          if(d.answer[i].vote > max_vote)
          {

            max_vote = d.answer[i].vote;
          }
        }
      });
      max_sim = 10* slider1.value *max_sim;
      console.log(max_sim);

        slider1 = document.getElementById("titlesim");
        slider2 = document.getElementById("questionsim");
        buttontitle = document.getElementById("titlebutton");

        buttontitle.addEventListener("click",function(){
            console.log("Here!");
            console.log(slider1.value);
            console.log(slider2.value);
            slider_values(slider1,slider2);
            d3.select("#svg_vis").remove();
            render_vis(data);
            text_box(data);
        });
        function slider_values(a,b){
            slider1 = a;
            slider2 = b;
        }
        
        //console.log(max_sim);
      this.radius_scale = d3.scale.pow().exponent(0.7).domain([0, max_amount]).range([2, 40]);
      this.create_nodes();
      this.create_vis();
    }

    BubbleChart.prototype.create_nodes = function() {

      this.data.forEach((function(_this) {
        return function(d) {
          var node;
          var cat3;

          var sim = 100 * d.title_sim;
          //console.log(d.title_sim);
          //max_sim = 100*max_sim
          //console.log(max_sim);
          if (sim <= 0.0)
          {
            cat3 = 7;
          }
          if(sim <= max_sim/6 && sim > 0.0)
          {
            cat3 = 6;
          }
          if(sim <= ((max_sim/6)*2) && sim > (max_sim/6))
          {
            cat3 = 5;
          }
          if(sim <= ((max_sim/6)*3) && sim > ((max_sim/6)*2))
          {
            cat3 = 4;
          }
          if(sim <= ((max_sim/6)*4) && sim > ((max_sim/6)*3))
          {
            cat3 = 3;
          }
          if(sim <= ((max_sim/6)*5) && sim > ((max_sim/6)*4))
          {
            cat3 = 2;
          }
          if(sim <= ((max_sim/6)*6) && sim > ((max_sim/6)*5))
          {
            cat3 = 1;
          }
          //console.log(sim +" = "+ cat3);

          var cat;
          var max = 0;
          for(var i = 0; i<d.answer.length; i++)
          {
            //console.log(i +" "+ d.answer[i].vote);
            if(d.answer[i].vote > max)
            {
              max = d.answer[i].vote;
            }
          }
          if (max == 0)
          {
            cat = "Low votes";
          }
          if(max > 0)
          {
            cat = "Medium votes";
          }
          if(max > (max_vote/3))
          {
            cat = "High votes";
          }
          //console.log(cat);


          var cat1;
          var rep = d.question.reputation;
          //console.log(rep);
          if (rep > 400)
          {
            cat1 = "High user reputation";
          }
          if(rep < 400)
          {
            cat1 = "Medium user reputation";
          }
          if(rep < 10)
          {
            cat1 = "Low user reputation";
          }
          //console.log(cat1);

          var acc = 0;
          for(var i = 0; i<d.answer.length; i++)
          {
            //console.log(i +" "+ d.answer[i].vote);
            if(d.answer[i].accept_rate > max)
            {
              acc = d.answer[i].accept_rate;
            }
          }
          //console.log(acc);
          if (acc > 80)
          {
            cat2 = "High acceptance rate";
          }
          if(acc < 80)
          {
            cat2 = "Medium acceptance rate";
          }
          if(acc < 26)
          {
            cat2 = "Low acceptance rate";
          }
          //console.log();
          node = {
            id: d.id,
            radius: _this.radius_scale(slider2.value * (d.question_sim)),
            value: parseInt(slider2.value * (d.question_sim) + slider1.value * (d.title_sim)),
            name: d.question.title,
            vote: max,
            color_value: cat3,
            vote_category: cat,
            rep_category: cat1,
            rep: rep,
            acc_category: cat2,
            acc: acc,
            x: Math.random() * 900,
            y: Math.random() * 800
          };
          return _this.nodes.push(node);
        };
      })(this));
      return this.nodes.sort(function(a, b) {
        return b.value - a.value;
      });
    };

    BubbleChart.prototype.create_vis = function() {
      var that;
      this.vis = d3.select("#vis").append("svg").attr("width", this.width).attr("height", this.height).attr("id", "svg_vis");
      this.circles = this.vis.selectAll("circle").data(this.nodes, function(d) {
        return d.id;
      });
      that = this;
      this.circles.enter().append("circle").attr("r", 0).attr("fill", (function(_this) {
        return function(d) {
          return _this.fill_color(d.color_value);
        };
      })(this)).attr("stroke-width", 2).attr("stroke", (function(_this) {
        return function(d) {
          return d3.rgb(_this.fill_color(d.color_value)).darker();
        };
      })(this)).attr("id", function(d) {
        return "bubble_" + d.id;
      }).on("mouseover", function(d, i) {
        return that.show_details(d, i, this);
      }).on("mouseout", function(d, i) {
        return that.hide_details(d, i, this);
      });
      return this.circles.transition().duration(2000).attr("r", function(d) {
        return d.radius;
      });
    };

    BubbleChart.prototype.charge = function(d) {
      return -Math.pow(d.radius, 2.0) / 8;
    };

    BubbleChart.prototype.start = function() {
      return this.force = d3.layout.force().nodes(this.nodes).size([this.width, this.height]);
    };

    BubbleChart.prototype.display_group_all = function() {
      this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function(_this) {
        return function(e) {
          return _this.circles.each(_this.move_towards_center(e.alpha)).attr("cx", function(d) {
            return d.x;
          }).attr("cy", function(d) {
            return d.y;
          });
        };
      })(this));
      this.force.start();
      this.hide_rep();
      this.hide_acc();
      return this.hide_votes();
    };

    BubbleChart.prototype.move_towards_center = function(alpha) {
      return (function(_this) {
        return function(d) {
          d.x = d.x + (_this.center.x - d.x) * (_this.damper + 0.02) * alpha;
          return d.y = d.y + (_this.center.y - d.y) * (_this.damper + 0.02) * alpha;
        };
      })(this);
    };

    BubbleChart.prototype.display_by_votes = function() {
      this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function(_this) {
        return function(e) {
          return _this.circles.each(_this.move_towards_votes(e.alpha)).attr("cx", function(d) {
            return d.x;
          }).attr("cy", function(d) {
            return d.y;
          });
        };
      })(this));
      this.force.start();
      return this.display_votes();
    };

    BubbleChart.prototype.display_by_rep = function() {
      this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function(_this) {
        return function(e) {
          return _this.circles.each(_this.move_towards_rep(e.alpha)).attr("cx", function(d) {
            return d.x;
          }).attr("cy", function(d) {
            return d.y;
          });
        };
      })(this));
      this.force.start();
      return this.display_rep();
    };

    BubbleChart.prototype.display_by_acc = function() {
      this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function(_this) {
        return function(e) {
          return _this.circles.each(_this.move_towards_acc(e.alpha)).attr("cx", function(d) {
            return d.x;
          }).attr("cy", function(d) {
            return d.y;
          });
        };
      })(this));
      this.force.start();
      return this.display_acc();
    };

    BubbleChart.prototype.move_towards_votes = function(alpha) {
      return (function(_this) {
        return function(d) {
          var target;
          target = _this.vote_centers[d.vote_category];
          d.x = d.x + (target.x - d.x) * (_this.damper + 0.02) * alpha * 1.1;
          return d.y = d.y + (target.y - d.y) * (_this.damper + 0.02) * alpha * 1.1;
        };
      })(this);
    };

    BubbleChart.prototype.move_towards_rep = function(alpha) {
      return (function(_this) {
        return function(d) {
          var target;
          target = _this.rep_centers[d.rep_category];
          d.x = d.x + (target.x - d.x) * (_this.damper + 0.02) * alpha * 1.1;
          return d.y = d.y + (target.y - d.y) * (_this.damper + 0.02) * alpha * 1.1;
        };
      })(this);
    };

    BubbleChart.prototype.move_towards_acc = function(alpha) {
      return (function(_this) {
        return function(d) {
          var target;
          target = _this.acc_centers[d.acc_category];
          d.x = d.x + (target.x - d.x) * (_this.damper + 0.02) * alpha * 1.1;
          return d.y = d.y + (target.y - d.y) * (_this.damper + 0.02) * alpha * 1.1;
        };
      })(this);
    };

    BubbleChart.prototype.display_votes = function() {
      this.hide_rep();
      this.hide_acc();
      var votes, votes_data, votes_x;
      votes_x = {
        "High votes": 160,
        "Medium votes": this.width / 2,
        "Low votes": this.width - 160
      };
      votes_data = d3.keys(votes_x);
      votes = this.vis.selectAll(".votes").data(votes_data);
      return votes.enter().append("text").attr("class", "votes")
          .style("font-color","white")
          .attr("x", (function(_this) {
        return function(d) {
          return votes_x[d];
        };
      })(this)).attr("y", 40).attr("text-anchor", "middle").text(function(d) {
        return d;
      });
    };

    BubbleChart.prototype.display_rep = function() {
      this.hide_votes();
      this.hide_acc();
      var reps, reps_data, reps_x;
      reps_x = {
        "High user reputation": 160,
        "Medium user reputation": this.width / 2,
        "Low user reputation": this.width - 160
      };
      reps_data = d3.keys(reps_x);
      reps = this.vis.selectAll(".reps").data(reps_data);
      return reps.enter().append("text").attr("class", "reps").attr("x", (function(_this) {
        return function(d) {
          return reps_x[d];
        };
      })(this)).attr("y", 40).attr("text-anchor", "middle").text(function(d) {
        return d;
      });
    };

    BubbleChart.prototype.display_acc = function() {
      this.hide_votes();
      this.hide_rep();
      var accs, accs_data, accs_x;
      accs_x = {
        "High acceptance rate": 160,
        "Medium acceptance rate": this.width / 2,
        "Low acceptance rate": this.width - 160
      };
      accs_data = d3.keys(accs_x);
      accs = this.vis.selectAll(".accs").data(accs_data);
      return accs.enter().append("text").attr("class", "accs").attr("x", (function(_this) {
        return function(d) {
          return accs_x[d];
        };
      })(this)).attr("y", 40).attr("text-anchor", "middle").text(function(d) {
        return d;
      });
    };

    BubbleChart.prototype.hide_votes = function() {
      var votes;
      return votes = this.vis.selectAll(".votes").remove();
    };

    BubbleChart.prototype.hide_rep = function() {
      var reps;
      return reps = this.vis.selectAll(".reps").remove();
    };

    BubbleChart.prototype.hide_acc = function() {
      var accs;
      return accs = this.vis.selectAll(".accs").remove();
    };

    BubbleChart.prototype.show_details = function(data, i, element) {
      var content;
      d3.select(element).attr("stroke", "black");
      content = "<span class=\"name\">Title: </span><span class=\"value\"> " + data.name + "</span><br/>";
      content += "<span class=\"name\">Weight: </span><span class=\"value\"> " + data.value + "</span><br/>";
      content += "<span class=\"name\">Votes: </span><span class=\"value\"> " + data.vote_category + "</span><br/>";
      content += "<span class=\"name\">User Reputation: </span><span class=\"value\"> " + data.rep_category + "</span><br/>";
      content += "<span class=\"name\">Acceptance answer rate: </span><span class=\"value\"> " + data.acc_category + "</span>";
       
      return this.tooltip.showTooltip(content, d3.event);
        
    };

    BubbleChart.prototype.hide_details = function(data, i, element) {
      d3.select(element).attr("stroke", (function(_this) {
        return function(d) {
          return d3.rgb(_this.fill_color(d.color_value)).darker();
        };
      })(this));
      return this.tooltip.hideTooltip();
    };

    return BubbleChart;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

    var chart, render_vis;
    chart = null;
    
    root.display_all = (function(_this) {
      return function() {
        return chart.display_group_all();
      };
    })(this);
    root.display_votes = (function(_this) {
      return function() {
        return chart.display_by_votes();
      };
    })(this);

    root.display_rep = (function(_this) {
      return function() {
        return chart.display_by_rep();
      };
    })(this);

    root.display_acc = (function(_this) {
      return function() {
        return chart.display_by_acc();
      };
    })(this);

    root.toggle_view = (function(_this) {
      return function(view_type) {
        if (view_type === 'vote') {
          return root.display_votes();
        }
        else if (view_type === 'rep') {
          return root.display_rep();
        }
        else if (view_type === 'acc') {
          return root.display_acc();
        }
        else {
          return root.display_all();
        }
      };
    })(this);
    
    //return render_vis(json);
    //return d3.json("data/test.json", render_vis);
  



function render_vis(json) {
      chart = new BubbleChart(json);
      chart.start();
      return root.display_all();
    };

//render_vis(json);