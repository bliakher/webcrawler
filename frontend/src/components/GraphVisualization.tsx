import React from 'react';
import * as d3 from "d3";
import { graph, ForceDirectedGraph } from '../graph/ForceDirectedGraph';
import { RecordData } from '../model/Record';
import { ServiceGraphql } from '../api/graphql/service';
import { GraphTransfom } from '../graph/GraphTransform';


interface VisualizationProps {
    checkedRecords: number[]; // list of record id - records to visualize
    records: RecordData[];
}

export class GraphVisualization extends React.Component<VisualizationProps> {
    svgContainer: any;
    svgRendered: boolean;
    constructor(props: VisualizationProps) {
        super(props);
        this.svgContainer = React.createRef();
        this.svgRendered = false;
    }

    async componentDidMount() {
        console.log("mount");
        var data = await ServiceGraphql.getNodes(this.props.checkedRecords);
        var dataTransform = new GraphTransfom(data, this.props.records);
        if(!this.svgRendered) {
            var websiteData = dataTransform.getWebsiteData();
            var domainData = dataTransform.getDomainData();
            ForceDirectedGraph(domainData, d3.select(this.svgContainer.current));
            this.svgRendered = true;
        }
    }
    render() {
        return (
            <>
                <h3>Visualize:</h3>
                <ul>
                    { this.props.checkedRecords.map(record => (<li key={record}>{record}</li>)) }
                </ul>
                <svg    width="800" 
                        height="600"
                        ref = {this.svgContainer}
                        />

            </>

        );
    }
}