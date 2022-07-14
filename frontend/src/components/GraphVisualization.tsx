import React from 'react';
import * as d3 from "d3";
import { graph, ForceDirectedGraph } from '../graph/ForceDirectedGraph';
import { RecordCallback, RecordData } from '../model/Record';
import { ServiceGraphql } from '../api/graphql/service';
import { GraphTransfom } from '../graph/GraphTransform';
import { Button, Card, Col, Form, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { D3Node } from '../graph/VisualizationData';
import CardHeader from 'react-bootstrap/esm/CardHeader';


interface VisualizationProps {
    checkedRecords: number[]; // list of record id - records to visualize
    records: RecordData[];
    startExecutionCallback: RecordCallback;
    createRecordCallback: (recordUrl: string) => void
}

interface VisualizationState {
    showDomain: boolean
    nodeDetail: D3Node | null;
    error: boolean
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
        this.state = { showDomain: false, nodeDetail: null, error: false }
        this.handleSwitch = this.handleSwitch.bind(this);
        this.handleShowDetail = this.handleShowDetail.bind(this);
    }

    async componentDidMount() {
        console.log("mount");
        var data = await ServiceGraphql.getNodes(this.props.checkedRecords);
        if (data === null) {
            this.setState({error: true});
            return;
        }
        this.dataTransform = new GraphTransfom(data, this.props.records);
        this.showWebsite();
    }

    removeVisualization() {
        document.getElementById("visualization")?.replaceChildren();
    }

    showWebsite() {
        if (this.dataTransform) {
            this.removeVisualization();
            var websiteData = this.dataTransform.getWebsiteData();
            // console.log(websiteData);
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
        // remove node detail when switching between views
        this.setState({showDomain: newShowDomain, nodeDetail: null});
    }

    handleShowDetail(node: D3Node) {
        this.setState({nodeDetail: node});
    }
    render() {
        if (this.state.error) {
            return (<p>Error</p>);
        }
        return (
            <>
                <ul>
                    { this.props.checkedRecords.map(record => (<li key={record}>{record}</li>)) }
                </ul>
                <div className="justify-content-md-center">
                    <Form className="m-2">
                        <Form.Check type="switch" label="Show domains only" onChange={this.handleSwitch}/>
                    </Form>
                </div>

                {this.state.nodeDetail !== null && (
                    <NodeInfo node={this.state.nodeDetail} 
                        startExecutionCallback={this.props.startExecutionCallback}
                        createRecordCallback={this.props.createRecordCallback}/>
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
    startExecutionCallback: (recordId: number) => void;
    createRecordCallback: (recordUrl: string) => void
}

const NodeInfo = (props: NodeInfoProps) => {

    if (!props.node.crawled) {
        return (
            <Row>
                <Col className="col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 col-xxl-5 m-2">
                    <Card>
                        <CardHeader><div className="fw-bold">Node information</div></CardHeader>
                        <ListGroup variant="flush">
                            <ListGroupItem>
                                <div className="fw-bold">Node:</div> {props.node.name}
                            </ListGroupItem>
                            <ListGroupItem>
                                <div className="fw-bold">Crawled:</div> {props.node.crawled ? "YES" : "NO"}
                            </ListGroupItem>
                            <ListGroupItem>
                                <Button onClick={() => props.createRecordCallback(props.node.id)} size="sm">Create new record from node</Button>
                            </ListGroupItem>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        );
    }

    return (
        <Row>
            <Col className="col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 col-xxl-5 m-2">
                <Card>
                    <CardHeader><div className="fw-bold">Node information</div></CardHeader>
                    <ListGroup variant="flush">
                        <ListGroupItem>
                            <div className="fw-bold">Node:</div> {props.node.name}
                        </ListGroupItem>
                        <ListGroupItem>
                            <div className="fw-bold">Crawled:</div> {props.node.crawled ? "YES" : "NO"}
                        </ListGroupItem>
                        <ListGroupItem>
                            <div className="fw-bold">URL:</div> {props.node.id}
                        </ListGroupItem>
                        <ListGroupItem>
                            <div className="fw-bold">Crawl time:</div> {props.node.crawlTime / 1000} s
                        </ListGroupItem>
                    </ListGroup>
                </Card>
            </Col>
            <Col className="col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 col-xxl-5 m-2">
                <Card>
                    <CardHeader><div className="fw-bold">Node crawled by records</div></CardHeader>
                    <ListGroup variant="flush">
                        { props.node.owners.map(owner => (
                            <div className="m-2" key={owner.id}>
                                {owner.label} <Button onClick={() => props.startExecutionCallback(owner.id)} size="sm">Start execution</Button>
                            </div>
                        )) }
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    );
}