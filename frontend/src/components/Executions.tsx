import { stat } from 'fs';
import React from 'react';
import { Col, Form, Row, Table } from 'react-bootstrap';
import { Service } from '../api/service';
import { ExecutionData } from '../model/Execution';
import { RecordData } from '../model/Record';
import { Loader } from './Loader';
import { MyPagination } from './Pagination';

interface ExecutionsState {
    loaded: boolean;
    error: boolean;
    curPage: number;
    selectedRecord: number | null;
}
export class Executions extends React.Component<{}, ExecutionsState> {
    
    PAGE_SIZE = 2;
    executions: ExecutionData[] | null;
    records: RecordData[] | null;
    recordMap: Map<number, RecordData>;
    constructor(props: any) {
        super(props);
        this.state = {
            loaded: false, 
            error: false,
            curPage: 1,
            selectedRecord: null
        };
        this.executions = null;
        this.records = null;
        this.recordMap = new Map();
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleSelectorChange = this.handleSelectorChange.bind(this);
    }

    async componentDidMount() {
        this.executions = await Service.getExecutions();
        this.records = await Service.getRecords();
        var error = this.executions === null || this.records === null;
        if (this.records) {
            for (var record of this.records) {
                this.recordMap.set(record.id, record);
            }
        }
        this.setState({loaded: true, error: error})
    }

    handlePageChange(pageNumber: number) { this.setState({ curPage: pageNumber }); }
    handleSelectorChange(event: any) { 
        this.setState({ 
            selectedRecord:  parseInt(event.target.value),
            curPage: 1 
        }) 
    }

    renderHeader() {
        return (
            <Row className="text-center">
                <h2>Executions</h2>
            </Row>
        );
    }

    renderSelector() {
        if (this.records === null) return null;
        return (
            <Row>
                <Col className="col-8 col-sm-8 col-md-3 col-lg-3 col-xl-3 col-xxl-3 m-2 p-2">
                <h6>Filter by web record</h6>
                <Form.Select onChange={this.handleSelectorChange}>
                    <option>Select web record</option>
                    { this.records.map(record => (
                        <option key={record.id} value={record.id}>
                            {record.id}: {record.label}
                        </option>
                    )) }
                </Form.Select>
                </Col>
            </Row>
        );
    }

    filterExecutions(executions: ExecutionData[]): ExecutionData[] {
        if (this.state.selectedRecord) {
            var selectedRecordId = this.recordMap.get(this.state.selectedRecord)?.id;
            return executions.filter(exec => exec.recordId === selectedRecordId);
        }
        return executions;
    }

    render() {
        if (!this.state.loaded) {
            return (
                <>
                    { this.renderHeader() }
                    <Loader />
                </>
            );
        }
        if (this.state.error) {
            return (
                <p>Error</p>
            );
        }
        var executions = this.executions ? this.executions : [];
        executions = this.filterExecutions(executions);
        const firstPageIndex = (this.state.curPage - 1) * this.PAGE_SIZE;
        const lastPageIndex = firstPageIndex + this.PAGE_SIZE;
        var execsSliced = executions.slice(firstPageIndex, lastPageIndex);
        return (
            <>
                { this.renderHeader() }
                { this.renderSelector() }
                <ExecutionTable executions={execsSliced} records={this.recordMap}/>
                <MyPagination onPageChange={this.handlePageChange} totalCount={executions.length} currentPage={this.state.curPage}
                    siblingCount={1} pageSize={this.PAGE_SIZE} />
            </>
        );
    }
}

interface ExecutionTableProps {
    executions: ExecutionData[];
    records: Map<number, RecordData>; // maps record ids to records
}

class ExecutionTable extends React.Component<ExecutionTableProps> {
    constructor(props: ExecutionTableProps) {
        super(props);
    }

    getRecordLabel(recordId: number) {
        var record = this.props.records.get(recordId);
        return record ? record.label : "ERROR: invalid record ID";
    }
    render() {
        return (
            <Table striped bordered hover >
                    <thead>
                        <tr>
                            <th>Web record</th>
                            <th>Status</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Crawled sites</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.props.executions.map(exec => (
                            <ExecutionRow key={exec.id}
                                execution={exec} recordLabel={this.getRecordLabel(exec.recordId)} />
                            )) }
                    </tbody>
            </Table>
        );
    }
}

interface ExecutionRowProps {
    execution: ExecutionData;
    recordLabel: string;
}

const ExecutionRow = (props: ExecutionRowProps) => {
    var execution = props.execution;
    return (
        <tr>
            <td>{props.recordLabel}</td>
            <td>{ExecutionData.getStatusString(execution.status)}</td>
            <td>{execution.startTime ? execution.startTime.toISOString() : "-"}</td>
            <td>{execution.endTime ? execution.endTime.toISOString() : "-"}</td>
            <td>{execution.endTime ? execution.crawledSites : "-"}</td>
        </tr>
    );
}