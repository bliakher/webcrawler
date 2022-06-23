import React from 'react';
import { Row, Table, Form, Button, Col } from 'react-bootstrap';
import { Execution } from '../model/Execution';
import { RecordData } from '../model/Record';
import { MyPagination } from './Pagination';
import { ImBin as DeleteIcon } from 'react-icons/im';
import { FiEdit as EditIcon } from 'react-icons/fi';

import { testData } from '../api/testData';
import { stat } from 'fs/promises';
import { url } from 'inspector';

interface WebRecordsStatus {
    loaded: boolean;
    filterOn: boolean;
    filterBy: { url: string, label: string, tags: string };
    sortBy: { url: boolean, time: boolean };
    curPage: number;
}
export class WebRecords extends React.Component<{}, WebRecordsStatus> {
    PAGE_SIZE = 2;
    records: RecordData[] | null;
    constructor(props: any) {
        super(props);
        this.records = null;
        this.state = { 
            loaded: false,
            filterOn: false,
            filterBy: { url: "", label: "", tags: "" },
            sortBy: { url: false, time: false },
            curPage: 1
        };
        this.handleFilterOn = this.handleFilterOn.bind(this);
        this.handleFilterOff = this.handleFilterOff.bind(this);
        this.handleChangeFilterUrl = this.handleChangeFilterUrl.bind(this);
        this.handleChangeFilterLabel = this.handleChangeFilterLabel.bind(this);
        this.handleChangeFilterTags = this.handleChangeFilterTags.bind(this);
        this.handleSortByUrl = this.handleSortByUrl.bind(this);
        this.handleSortByTime = this.handleSortByTime.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
    }
    componentDidMount() {
        this.records = testData.map(dataObj => new RecordData(dataObj));
        this.setState({loaded: true});
    }

    handleFilterOn(event: any) { 
        event.preventDefault();
        this.setState({filterOn: true}); console.log("filter on"); }
    handleFilterOff() { this.setState({filterOn: false}); console.log("filter off"); }
    handleChangeFilterUrl(event: any) { this.setState({filterBy: {url: event.target.value, 
        label: this.state.filterBy.label, tags: this.state.filterBy.tags}})}
    handleChangeFilterLabel(event: any) { this.setState({filterBy: {url: this.state.filterBy.url, 
        label: event.target.value, tags: this.state.filterBy.tags}})}
    handleChangeFilterTags(event: any) { this.setState({filterBy: {url: this.state.filterBy.url, 
        label: this.state.filterBy.label, tags: event.target.value}})}

    handleSortByUrl() { this.setState({sortBy: {url: !this.state.sortBy.url, time: this.state.sortBy.time }}); }
    handleSortByTime() { this.setState({sortBy: {time : !this.state.sortBy.time, url: this.state.sortBy.url}}); }
    handleEdit(recordId: number) {
        console.log("edit rec: ", recordId);
    }
    handleDelete(recordId: number) {
        console.log("delete rec: ", recordId);
    }
    handlePageChange(pageNumber: number) {
        this.setState({curPage: pageNumber});
    }

    renderHeader() {
        return (
            <Row className="text-center">
                <h2>Web records</h2>
            </Row>
        );
    }

    sortRecords(records: RecordData[]): RecordData[] {
        return this.state.sortBy.url ? 
                records.sort(RecordData.compareByUrl) :
                (this.state.sortBy.time ?
                    records.sort(RecordData.compareByExecTime) :
                    records);
    }
    filterRecords(records: RecordData[]): RecordData[] {
        var result = [];
        for (var record of records) {
            var urlFilter = this.state.filterBy.url;
            if (record.url.toLocaleLowerCase().includes(urlFilter.toLocaleLowerCase())) {
                var labelFilter = this.state.filterBy.label;
                if (record.label.toLocaleLowerCase().includes(labelFilter.toLocaleLowerCase())) {
                    var tagFilters = this.state.filterBy.tags === "" ? [] : this.state.filterBy.tags.split(" ");
                    if (tagFilters.length === 0 || tagFilters.every(tag => record.tags.includes(tag))) {
                        result.push(record);
                    }
                }
            }
        }
        return result;
    }
    renderFilterForm() {
        return (
            <Form onSubmit={this.handleFilterOn}>
                <h4>Filter by:</h4>
                <Form.Group >
                    <Form.Label>URL</Form.Label>
                    <Form.Control type="text" onChange={this.handleChangeFilterUrl} placeholder="http://example.com" />                        
                </Form.Group>

                <Form.Group>
                    <Form.Label>Label</Form.Label>
                    <Form.Control type="text" onChange={this.handleChangeFilterLabel} placeholder="label" />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Tags</Form.Label>
                    <Form.Control type="text" onChange={this.handleChangeFilterTags} placeholder="tag1 tag2" />
                </Form.Group>
                <Button variant="primary" type="submit" className="m-1">
                    Filter
                </Button>
                { this.state.filterOn &&
                <Button onClick={this.handleFilterOff} variant="secondary" className="m-1">
                    Cancel filter
                </Button> }
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
            var records = this.records ? this.records : [];
            if (this.state.filterOn) records = this.filterRecords(records); // filter
            records = this.sortRecords(records); // sort
            const firstPageIndex = (this.state.curPage - 1) * this.PAGE_SIZE;
            const lastPageIndex = firstPageIndex + this.PAGE_SIZE;
            var recordsSliced = records.slice(firstPageIndex, lastPageIndex);
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
                    <RecordTable records={recordsSliced} editCallback={this.handleEdit} deleteCalback={this.handleDelete}/>
                    <Row className="justify-content-md-center text-center">
                        <MyPagination currentPage={this.state.curPage} totalCount={records.length} pageSize={this.PAGE_SIZE}
                            onPageChange={this.handlePageChange} siblingCount={1} />
                    </Row>
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
    editCallback: (recordId: number) => void;
    deleteCalback: (recordId: number) => void;
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
                            <th>URL</th>
                            <th>Periodicity (days-hours-minutes)</th>
                            <th>Tags</th>
                            <th>Last execution time</th>
                            <th>Last execution status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.props.records.map(record => (
                            <RecordRow key={record.id} record={record} 
                                editCallback={() => this.props.editCallback(record.id)}
                                deleteCalback={() => this.props.deleteCalback(record.id)}/>)) }
                    </tbody>
            </Table>
        );
    }
}

interface RecordRowProps {
    record: RecordData;
    editCallback: () => void;
    deleteCalback: () => void;
}

const RecordRow = (props: RecordRowProps) => {
    const record = props.record;
    return (
        <tr key={record.id}>
            <td>{record.label}</td>
            <td>{record.url }</td>
            <td>{record.periodicity.toString()}</td>
            <td>
                {record.tags.map(tag => (<div key={tag}>{tag}</div>))}
            </td>
            <td>{record.lastExecTime.toISOString()}</td>
            <td>{Execution.getStatusString(record.lastExecStatus)}</td>
            <td>
                <Button onClick={props.editCallback} variant="warning" className="m-1">
                    <EditIcon />
                </Button>
                <Button onClick={props.deleteCalback} variant="danger" className="m-1">
                    <DeleteIcon />
                </Button>
            </td>
        </tr>
    );
}