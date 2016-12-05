function networkVis() {
    var width = 500,
        height = 400,
        radius = 8;

    var fill = d3.scale.category20();

    var force = d3.layout.force()
        .gravity(0)
        .charge(-300)
        .linkDistance(200)
        .size([width, height]);


    var svg = d3.select("#content").append("svg")
        .attr("width", width)
        .attr("height", height);
    var ran;
    d3.json("data/test.json", function (error, gr) {
        if (error) throw error;

        var graph = gr.network;
        var edges = [];
        var count;
        graph.links.forEach(function (e) {
            count = 0;
            var sourceNode = graph.nodes.filter(function (n) {
                count = count + 1;
                return n.id === e.source;

            })[0],
                targetNode = graph.nodes.filter(function (n) {
                count = count + 1;
                return n.id === e.target;

            })[0];

            edges.push({
                source: sourceNode,
                target: targetNode,
                values: e.value

            });
        });
        update();


        var link = svg.selectAll("line")
            .data(edges)
            .enter().append("line")
            .attr("stroke-width",function(d){

                return d.values*7;
            });

        var node = svg.selectAll("g").data(graph.nodes).enter().append("g");

        node.append("circle")
            .attr("r", radius + 2)
            .style("fill", function (d) {
                return fill(Math.random());
            })
            .style("stroke", function (d) {
                return d3.rgb(fill(Math.random())).darker().darker();
            })
            .call(force.drag);
        node.append("text")
            .attr("class", "node-label")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .attr("text-anchor", "left")
            .text(function (d) {
                return d.id;
            });
        force
            .nodes(graph.nodes)
            .links(edges)
            .on("tick", tick)
            .start();

        /*

         var root = graph.nodes[0];
         var max=calcnode[0];
         for(var i=1;i<calcnode.length;i++){
         if(calcnode[i].count>max.count)
         max = calcnode[i];
         }
         root = max;
         root.cx = width / 2;
         root.cy = height / 2;
         root.fixed = true;
         console.log(JSON.stringify(root));
         */

        node.on("mouseover", fade(0.1,true))
            .on("mouseout",normalizeNodesAndRemoveLabels());

        function update(){
            linkedByIndex={};
            graph.links.forEach(function (d){
                linkedByIndex[d.source+","+d.target]=1;
            });
        }
        function tick() {

            node.attr("cx", function (d) {
                return d.x = Math.max(radius, Math.min(width - radius, d.x));
            })
                .attr("cy", function (d) {
                    return d.y = Math.max(radius, Math.min(height - radius, d.y));
                });

            node.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            link.attr("x1", function (d) {
                return d.source.x;
            })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });

        }

        function fade(opacity, showText) {

            return function(d, i) {


                labels = [];
                var selectedLabelData = null;
                node.style("opacity", function(o) {
                    var isNodeConnectedBool = isNodeConnected(d, o);
                    //  console.log(isNodeConnectedBool);
                    var thisOpacity = isNodeConnectedBool ? 1 : opacity;
                    if (!isNodeConnectedBool) {

                        this.setAttribute('style',"opacity:"+0.1+";");
                    } else {
                        labels.push(o);
                        if (o == d) selectedLabelData = o;
                    }

                    return thisOpacity;
                });

                link.style("stroke-opacity", function(o) {
                    return o.source === d || o.target === d ? 1 : opacity;
                });

                labels.sort(function(a, b){

                    return b.value - a.value})

                selectedLabelIndex = labels.indexOf(selectedLabelData);

                svg.selectAll("text").data(labels).enter().append("text")
                    .attr("class", "node-text")
                    .text(function(d){ return d.id;});
            }
        }

        function normalizeNodesAndRemoveLabels() {
            return function(d, i) {
                selectedLabelIndex = null;
                svg.selectAll("line").style("stroke-opacity", 1);
                node.style("opacity",1);
            }
        }
        function isNodeConnected(a, b) {

            var l =linkedByIndex[a.id + "," + b.id] || linkedByIndex[b.id + "," + a.id] || a.index == b.index;

            return l;
        }
    });
}

networkVis();