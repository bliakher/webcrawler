import React from 'react';
import * as d3 from "d3";
import { graph, ForceDirectedGraph } from '../graph/ForceDirectedGraph';
import { RecordData } from '../model/Record';
import { ServiceGraphql } from '../api/graphql/service';
import { GraphTransfom } from '../graph/GraphTransform';
import { Form, Row } from 'react-bootstrap';


interface VisualizationProps {
    checkedRecords: number[]; // list of record id - records to visualize
    records: RecordData[];
}

interface VisualizationState {
    showDomain: boolean
}

export class GraphVisualization extends React.Component<VisualizationProps, VisualizationState> {
    svgContainer: any;
    svgRendered: boolean;

    dataTransform: GraphTransfom | null;
    constructor(props: VisualizationProps) {
        super(props);
        this.svgContainer = React.createRef();
        this.svgRendered = false;
        this.dataTransform = null;
        this.state = { showDomain: false }
        this.handleSwitch = this.handleSwitch.bind(this);
    }

    async componentDidMount() {
        console.log("mount");
        var data = await ServiceGraphql.getNodes(this.props.checkedRecords);
        this.dataTransform = new GraphTransfom(data, this.props.records);
        // if(!this.svgRendered) {
        //     var websiteData = this.dataTransform.getWebsiteData();
        //     ForceDirectedGraph(websiteData, d3.select(this.svgContainer.current));
        //     this.svgRendered = true;
        // }
        this.showWebsite();
    }

    removeVisualization() {
        document.getElementById("visualization")?.replaceChildren();
    }

    showWebsite() {
        if (this.dataTransform) {
            this.removeVisualization();
            var websiteData = this.dataTransform.getWebsiteData();
            ForceDirectedGraph(websiteData, d3.select(this.svgContainer.current))
        }

    }
    showDomain() {
        if (this.dataTransform) {
            this.removeVisualization();
            var domainData = this.dataTransform.getDomainData();
            ForceDirectedGraph(domainData, d3.select(this.svgContainer.current))
        }
    }

    handleSwitch() {
        var newShowDomain = !this.state.showDomain;
        if (newShowDomain) {
            this.showDomain();
        } else {
            this.showWebsite();
        }
        this.setState({showDomain: newShowDomain});
    }
    render() {
        return (
            <>
                <h3>Visualize:</h3>
                <ul>
                    { this.props.checkedRecords.map(record => (<li key={record}>{record}</li>)) }
                </ul>
                <Form className="m-2">
                    <Form.Check type="switch" label="Show domains only" onChange={this.handleSwitch}/>
                </Form>

                <Row className="justify-content-md-center">
                    <svg    id= "visualization"
                            width="1200" 
                            height="800"
                            ref = {this.svgContainer}
                            />
                </Row>

            </>

        );
    }
}