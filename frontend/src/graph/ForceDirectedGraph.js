import * as d3 from "d3";

const graph = {
    nodes: [
        {
            "title": "page A",
            "url": "http://example.org",
        },
        {
            "title": "page B",
            "url": "http://example.org/found_first",
        },
        {
            "title": "page C",
            "url": "http://example.org/found_second",
        }
    ],
    links: [
        {
            source: "http://example.org",
            target: "http://example.org/found_first"
        },
        {
            source: "http://example.org",
            target: "http://example.org/found_second"
        },
        {
            source: "http://example.org/found_first",
            target: "http://example.org/found_second"
        },

    ]
};

const ForceDirectedGraph = (graph, svg) => {
    console.log("force");
    var width = svg.attr("width");
    var height = svg.attr("height");
    var simulation = d3.forceSimulation(graph.nodes)
        .force("link",
            d3.forceLink(graph.links).id(d => d.url))
        .force("charge",
            d3.forceManyBody())
        .force("center", 
            d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

    var lines = svg
        .append("g")
        .selectAll("line")
        .data(graph.links)
        // .enter()
        // .append("line")
        .join("line")
        .attr("stroke-width", d => 1)
        .style("stroke", "black");

    var circles = svg
        .append("g")
        .selectAll("circle")
        .data(graph.nodes)
        // .enter()
        // .append("circle")
        .join("circle")
        .attr("r", 5)
        .attr("fill", d => "red")
        .call(drag(simulation));

    function ticked() {
        lines
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        circles
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
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