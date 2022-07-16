import React from 'react';
import { Row, Table, Form, Button, Col } from 'react-bootstrap';
import { ExecutionData } from '../../model/Execution';
import { RecordData, RecordEditable } from '../../model/Record';
import { MyPagination } from '../Pagination';
import { GraphVisualization } from '../GraphVisualization';
import { ServiceRest } from '../../api/rest/service';
import { Loader } from '../Loader';
import { RecordTable } from './RecordsTable';
import { EditModal } from './EditModal';

// TODO: trigger page reload on edit dialog save

interface WebRecordsState {
    loaded: boolean;
    error: boolean;
    filterOn: boolean;
    filterBy: { url: string, label: string, tags: string };
    sortBy: { url: boolean, time: boolean };
    curPage: number;
    checkedRecords: Set<number>;
    checkNew: boolean;
    showEdit: boolean;
    isNew: boolean;
    editedRecord: RecordData | null;
    visualizationDisplayed: boolean;
    visualizationIsLive: boolean;
    visualizationIsDomainView: boolean;

}
export class WebRecords extends React.Component<{}, WebRecordsState> {
    PAGE_SIZE = 5;
    records: RecordData[] | null;
    constructor(props: any) {
        super(props);
        this.records = null;
        this.state = { 
            loaded: false,
            error: false,
            filterOn: false,
            filterBy: { url: "", label: "", tags: "" },
            sortBy: { url: false, time: false },
            curPage: 1,
            checkedRecords: new Set(),
            checkNew: false,
            visualizationDisplayed: false,
            visualizationIsLive: false,
            visualizationIsDomainView: false,
            showEdit: false,
            isNew: false,
            editedRecord: null
        };
        this.handleFilterOn = this.handleFilterOn.bind(this);
        this.handleFilterOff = this.handleFilterOff.bind(this);
        this.handleChangeFilterUrl = this.handleChangeFilterUrl.bind(this);
        this.handleChangeFilterLabel = this.handleChangeFilterLabel.bind(this);
        this.handleChangeFilterTags = this.handleChangeFilterTags.bind(this);
        this.handleSortByUrl = this.handleSortByUrl.bind(this);
        this.handleSortByTime = this.handleSortByTime.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleEditClose = this.handleEditClose.bind(this);
        this.handleEditSave = this.handleEditSave.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleRowCheck = this.handleRowCheck.bind(this);
        this.handleVisualize = this.handleVisualize.bind(this);
        this.handleNew = this.handleNew.bind(this);
        this.handleStartExecution = this.handleStartExecution.bind(this);
        this.setVisualizeState = this.setVisualizeState.bind(this);
    }
    async componentDidMount() {
        await this.getData();
    }

    async getData() {
        this.records = await ServiceRest.getRecords();
        var error = this.records === null;
        this.setState({loaded: true, error: error});
    }

    handleFilterOn(event: any) { 
        event.preventDefault();
        this.setState({filterOn: true, curPage: 1}); console.log("filter on"); }
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
        var record = RecordData.getRecordFrom(recordId, this.records ? this.records : []);
        if (!record) return;
        this.setState({showEdit: true, editedRecord: record});
    }
    async handleEditClose() {
        this.setState({showEdit: false, editedRecord: null, isNew: false});
        await this.getData();
    }

    async handleEditSave(updatedRecord: RecordEditable, recordId: number) {
        // TODO: show update/create result
        if (this.state.isNew) {
            var id = await ServiceRest.createRecord(updatedRecord);
            if (this.state.checkNew && id) {
                // this.setVisualizeState(true, this.state.visualizationIsDomainView);
                this.setState({checkNew: false, checkedRecords: this.state.checkedRecords.add(id), visualizationIsLive: true, visualizationDisplayed: false})
                this.setState({visualizationDisplayed: true});
            }
        } else {
            await ServiceRest.updateRecord(recordId, updatedRecord);
        }
        this.handleEditClose();
    }
    async handleDelete(recordId: number) {
        console.log("delete rec: ", recordId);
        if (this.state.checkedRecords.has(recordId)) {
            var checked = this.state.checkedRecords;
            checked.delete(recordId);
            this.setState({checkedRecords: checked });
        }
        await ServiceRest.deleteRecord(recordId);
        await this.getData();
    }
    handleNew(url?: string) {
        var emptyRecord = RecordData.createEmptyRecord()
        if (url) {
            emptyRecord.url = url;
            emptyRecord.active = true;
            this.setState({checkNew: true});
        }
        this.setState({showEdit: true, editedRecord: emptyRecord, isNew: true});
    }
    handlePageChange(pageNumber: number) { this.setState({curPage: pageNumber}); }
    handleRowCheck(recordId: number) {
        var checked = this.state.checkedRecords;
        if (checked.has(recordId)) checked.delete(recordId);
        else checked.add(recordId);
        this.setState({checkedRecords: checked});
    }
    handleVisualize() { this.setState({visualizationDisplayed: !this.state.visualizationDisplayed}); }
    setVisualizeState(isLive: boolean, isDomainView: boolean) {
        // console.log("set visualize");
        this.setState({visualizationIsLive: isLive, visualizationIsDomainView: isDomainView})
    }

    async handleStartExecution(recordId: number) {
        await ServiceRest.createExecution(recordId);
        await this.getData();
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
                <h5>Filter by:</h5>
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
                <h5>Sort records:</h5>
                <Button onClick={this.handleSortByUrl} className="m-2">
                    {this.state.sortBy.url? "Cancel sort by URL" : "Sort by URL"}
                </Button>
                <Button onClick={this.handleSortByTime} className="m-2">
                    {this.state.sortBy.time? "Cancel sort by execution time" : "Sort by execution time"}
                </Button>
            </div>
        );
    }

    renderVisualization() {
        // console.log(this.state.visualizationIsLive);
        if (this.state.checkedRecords.size === 0) return null;
        var button = (
            <Button onClick={this.handleVisualize} className="m-3">
                {this.state.visualizationDisplayed ? "Hide visualization" : "Display visualization" }
            </Button>
        );
        if (this.state.visualizationDisplayed && this.records) {
            return (
                <>
                    <Row className="justify-content-md-center text-center">
                        <span>
                            { button }
                            <h3>Visualization</h3>
                        </span>
                    </Row>
                    
                    <GraphVisualization checkedRecords={Array.from(this.state.checkedRecords.values())} records={this.records} 
                        startExecutionCallback={ this.handleStartExecution } 
                        createRecordCallback={this.handleNew}
                        isLive={this.state.visualizationIsLive} isDomainView={this.state.visualizationIsDomainView}
                        setVisualizeState={this.setVisualizeState}/>
                </>
            );
        }
        return (
            <Row className="justify-content-md-center text-center">
                <span>
                    { button }
                </span>
            </Row>
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
                        <Col className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 col-xxl-3 d-flex p-2">
                            { this.renderFilterForm() }
                        </Col>
                        <Col className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 col-xxl-3 d-flex p-2">
                            { this.renderSortForm() }
                        </Col>
                        <Col className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 col-xxl-3 d-flex p-2">
                            <div className='m-2'>
                            <h5>Add new record: </h5>
                            <Button className="m-2" onClick={() => this.handleNew()}>
                                New record
                            </Button>
                            </div>
                        </Col>
                    </Row>

                    <RecordTable records={recordsSliced} checkedRecords={this.state.checkedRecords}
                                editCallback={this.handleEdit} deleteCallback={this.handleDelete}
                                startCallback={this.handleStartExecution} checkCallback={this.handleRowCheck}/>
                    <Row className="justify-content-md-center text-center">
                        <Col className="m-2">
                            <MyPagination currentPage={this.state.curPage} totalCount={records.length} pageSize={this.PAGE_SIZE}
                                onPageChange={this.handlePageChange} siblingCount={1} />
                        </Col>
                        
                    </Row>
                    
                    { this.renderVisualization() }

                    { this.state.showEdit && this.state.editedRecord &&
                        <EditModal initialRecord={this.state.editedRecord} text={this.state.isNew ? "New record" : "Edit record"}
                            onCloseCallback={this.handleEditClose} onSaveCallback={this.handleEditSave} /> }
                    
                </>
            );
        } else if (this.state.loaded && this.state.error) {
            return (
                <>
                    { this.renderHeader() }
                    <p>Error</p>
                </>
            );
        } 
        return (
            <>
                { this.renderHeader() }
                <Loader />
            </>
        );
        
    }
}



