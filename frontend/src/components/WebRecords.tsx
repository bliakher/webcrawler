import React from 'react';
import { Row, Table, Form, Button, Col } from 'react-bootstrap';
import { Execution } from '../model/Execution';
import { RecordData } from '../model/Record';

import { testData } from '../api/testData';

interface WebRecordsStatus {
    loaded: boolean;
    filterOn: boolean;
    filterBy: { url: string, label: string, tags: string[] };
    sortBy: { url: boolean, time: boolean };
}
export class WebRecords extends React.Component<{}, WebRecordsStatus> {
    records: RecordData[] | null;
    constructor(props: any) {
        super(props);
        this.records = null;
        this.state = { 
            loaded: false,
            filterOn: false,
            filterBy: { url: "", label: "", tags: [] },
            sortBy: { url: false, time: false },
        };
        this.handleFilter = this.handleFilter.bind(this);
        this.handleSortByUrl = this.handleSortByUrl.bind(this);
        this.handleSortByTime = this.handleSortByTime.bind(this);
    }
    componentDidMount() {
        this.records = testData.map(dataObj => new RecordData(dataObj));
        this.setState({loaded: true});
    }

    handleFilter() {

    }
    handleSortByUrl() {
        this.setState({sortBy: {url: !this.state.sortBy.url, time: this.state.sortBy.time }});
    }
    handleSortByTime() {
        this.setState({sortBy: {time : !this.state.sortBy.time, url: this.state.sortBy.url}});
    }

    renderHeader() {
        return (
            <Row className="text-center">
                <h2>Web records</h2>
            </Row>
        );
    }
    renderFilterForm() {
        return (
            <Form>
                <h4>Filter by:</h4>
                <Form.Group >
                    <Form.Label>URL</Form.Label>
                    <Form.Control type="text" placeholder="http://example.com" />                        
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Label</Form.Label>
                    <Form.Control type="text" placeholder="label" />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Tags</Form.Label>
                    <Form.Control type="text" placeholder="tag1 tag2" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Filter
                </Button>
            </Form>
        );
    }

    renderSortForm() {
        return (
            <div  className="m-2">
                <h4>Sort records</h4>
                <Button onClick={this.handleSortByUrl} className="m-2">
                    {this.state.sortBy.url? "Cancel sort by URL" : "Sort by URL"}
                </Button>
                <Button onClick={this.handleSortByTime} className="m-2">
                    {this.state.sortBy.time? "Cancel sort by execution time" : "Sort by execution time"}
                </Button>
            </div>
        );
    }
    render() {
        if (this.state.loaded && this.records) {
            var records = this.records;
            // filter
            // sort
            records = this.state.sortBy.url ? 
                this.records.sort(RecordData.compareByUrl) :
                (this.state.sortBy.time ?
                    this.records.sort(RecordData.compareByExecTime) :
                    this.records);
            return (
                <>
                    { this.renderHeader() }
                    <Row className="justify-content-md-center">
                        <Col className="col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 col-xxl-5 d-flex p-2">
                            { this.renderFilterForm() }
                        </Col>
                        <Col className="col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 col-xxl-5 d-flex p-2">
                            { this.renderSortForm() }
                        </Col>
                    </Row>
                    <RecordTable records={records} />
                </>
            );
        } else {
            return (
                <>
                    { this.renderHeader() }
                    <p>Loading...</p>
                </>
            );
        }
        
    }
}

interface RecordTableProps {
    records: RecordData[];
}

class RecordTable extends React.Component<RecordTableProps> {
    constructor(props: RecordTableProps) {
        super(props);
    }
    render() {
        return (
            <Table striped bordered hover >
                    <thead>
                        <tr>
                            <th>Label</th>
                            <th>Periodicity (days-hours-minutes)</th>
                            <th>Tags</th>
                            <th>Last execution time</th>
                            <th>Last execution status</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.props.records.map(record => (<RecordRow key={record.id} record={record} />)) }
                    </tbody>
            </Table>
        );
    }
}

const RecordRow = (props: {record: RecordData}) => {
    const record = props.record;
    return (
        <tr key={record.id}>
            <td>{record.label}</td>
            <td>{record.periodicity.toString()}</td>
            <td>
                {record.tags.map(tag => (<div key={tag}>{tag}</div>))}
            </td>
            <td>{record.lastExecTime.toISOString()}</td>
            <td>{Execution.getStatusString(record.lastExecStatus)}</td>
        </tr>
    );
}