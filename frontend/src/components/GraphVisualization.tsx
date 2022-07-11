import React from 'react';
import * as d3 from "d3";
import { graph, ForceDirectedGraph } from '../graph/ForceDirectedGraph';


interface VisualizationProps {
    records: number[] // list of record id - records to visualize
}

export class GraphVisualization extends React.Component<VisualizationProps> {
    svgContainer: any;
    svgRendered: boolean;
    constructor(props: VisualizationProps) {
        super(props);
        this.svgContainer = React.createRef();
        this.svgRendered = false;
    }

    componentDidMount() {
        console.log("mount");
        if(!this.svgRendered) {
            ForceDirectedGraph(graph, d3.select(this.svgContainer.current));
            this.svgRendered = true;
        }
    }
    render() {
        return (
            <>
                <h3>Visualize:</h3>
                <ul>
                    { this.props.records.map(record => (<li key={record}>{record}</li>)) }
                </ul>
                <svg    width="800" 
                        height="600"
                        ref = {this.svgContainer}
                        />

            </>

        );
    }
}