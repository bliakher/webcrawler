import React from 'react';
import * as d3 from "d3";
import { graph, ForceDirectedGraph } from '../graph/ForceDirectedGraph';
import { RecordData } from '../model/Record';
import { ServiceGraphql } from '../api/graphql/service';
import { GraphTransfom } from '../graph/GraphTransform';
import { Card, Col, Form, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { D3Node } from '../graph/VisualizationData';
import CardHeader from 'react-bootstrap/esm/CardHeader';


interface VisualizationProps {
    checkedRecords: number[]; // list of record id - records to visualize
    records: RecordData[];
}

interface VisualizationState {
    showDomain: boolean
    nodeDetail: D3Node | null;
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
        this.state = { showDomain: false, nodeDetail: null }
        this.handleSwitch = this.handleSwitch.bind(this);
        this.handleShowDetail = this.handleShowDetail.bind(this);
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
            ForceDirectedGraph(websiteData, d3.select(this.svgContainer.current), this.handleShowDetail)
        }
    }
    showDomain() {
        if (this.dataTransform) {
            this.removeVisualization();
            var domainData = this.dataTransform.getDomainData();
            ForceDirectedGraph(domainData, d3.select(this.svgContainer.current), this.handleShowDetail)
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

    handleShowDetail(node: D3Node) {
        this.setState({nodeDetail: node});
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
                
                {this.state.nodeDetail !== null && (
                    <NodeInfo node={this.state.nodeDetail} />
                ) }

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

interface NodeInfoProps {
    node: D3Node;
}

const NodeInfo = (props: NodeInfoProps) => {

    return (
        <Row>
            <Col className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 m-2">
                <Card>
                    <CardHeader><div className="fw-bold">Node information</div></CardHeader>
                    <ListGroup variant="flush">
                        <ListGroupItem>
                            <div className="fw-bold">Node:</div> {props.node.name}
                        </ListGroupItem>
                        <ListGroupItem>
                            <div className="fw-bold">URL:</div> {props.node.id}
                        </ListGroupItem>
                        {props.node.crawled && (
                            <>
                            <ListGroupItem>
                                <div className="fw-bold">Crawl time:</div> {props.node.crawlTime}
                            </ListGroupItem>
                            <ListGroupItem>
                                <div className="fw-bold">Web records:</div>
                            </ListGroupItem>
                            </>
                        )}
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    );
}