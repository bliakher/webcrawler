import * as d3 from "d3";

const graph = {
    nodes: [
        {
            "name": "page A",
            "url": "http://example.org",
            "crawled": true
        },
        {
            "name": "page B",
            "url": "http://example.org/found_first",
            "crawled": true
        },
        {
            "name": "page C",
            "url": "http://example.org/found_second",
            "crawled": true
        },
        {
            "name": "Not crawled",
            "url": "http://example.org/not_crawled",
            "crawled": false
        }
    ],
    links: [
        {
            source: "http://example.org",
            target: "http://example.org/found_first",
        },
        {
            source: "http://example.org",
            target: "http://example.org/found_second"
        },
        {
            source: "http://example.org/found_first",
            target: "http://example.org/found_second"
        },
        {
            source: "http://example.org/found_first",
            target: "http://example.org/not_crawled"
        },

    ]
};

const ForceDirectedGraph = (graph, svg) => {
    console.log("force");
    var width = svg.attr("width");
    var height = svg.attr("height");
    var simulation = d3.forceSimulation(graph.nodes)
        .force("link",
            d3.forceLink(graph.links).distance(100).id(d => d.url))
        .force("charge",
            d3.forceManyBody())
        .force("center", 
            d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

    svg.append("defs").selectAll("marker")
    .data(["dominating"])
    .enter().append("marker")
    .attr('markerUnits', 'userSpaceOnUse')
    .attr("id", function (d) {
        return d;
    })
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 20)
    .attr("refY", 0)
    .attr("markerWidth", 10)
    .attr("markerHeight", 10)
    .attr("orient", "auto-start-reverse")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "black");

    var lines = svg
        .append("g")
        .selectAll("line")
        .data(graph.links)
        .join("line")
        .attr("stroke-width", d => 1)
        .style("stroke", "black")
        .attr("marker-end", function(d) {
            if(JSON.stringify(d.target) !== JSON.stringify(d.source))
               return "url(#dominating)"});

    var nodes = svg
        .append("g")
        .selectAll("g")
        .data(graph.nodes)
        .enter()
        .append("g");

    var circles = nodes.append("circle")
        .attr("r", 10)
        .attr("fill", d => d.crawled ? "red" : "grey")
        .call(drag(simulation));

    var texts = nodes.append("text")
        .text(d => d.name);


    function ticked() {
        lines
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        nodes
            .attr("transform", d => "translate(" + d.x + ", " + d.y + ")");
        
    }

    function drag(simulation) {    
        function dragstarted(event) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        }
        
        function dragged(event) {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        }
        
        function dragended(event) {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        }
        
        return d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
    }
}

export { ForceDirectedGraph, graph };