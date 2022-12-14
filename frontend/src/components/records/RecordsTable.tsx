import React from "react";
import { Button, Form, Table } from "react-bootstrap";
import { ExecutionData } from "../../model/Execution";
import { RecordData, RecordCallback } from "../../model/Record";
import { ImBin as DeleteIcon } from 'react-icons/im';
import { FiEdit as EditIcon } from 'react-icons/fi';
import { VscDebugRestart as StartIcon } from 'react-icons/vsc';
import { FaRunning as RunningIcon} from 'react-icons/fa';

interface RecordTableProps {
    records: RecordData[];
    checkedRecords: Set<number>;
    editCallback: RecordCallback;
    deleteCallback: RecordCallback;
    startCallback: RecordCallback;
    checkCallback: RecordCallback;
}

export class RecordTable extends React.Component<RecordTableProps> {
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
                            <th>Select</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.props.records.map(record => (
                            <RecordRow key={record.id} record={record} 
                                isChecked={this.props.checkedRecords.has(record.id)}
                                editCallback={() => this.props.editCallback(record.id)}
                                deleteCallback={() => this.props.deleteCallback(record.id)}

                                startCallback={() => this.props.startCallback(record.id)}
                                checkCallback={() => this.props.checkCallback(record.id)} />)) }
                    </tbody>
            </Table>
        );
    }
}

interface RecordRowProps {
    record: RecordData;
    isChecked: boolean;
    editCallback: () => void;
    deleteCallback: () => void;
    startCallback: () => void;
    checkCallback: () => void;
}

const RecordRow = (props: RecordRowProps) => {
    const record = props.record;
    return (
        <tr key={record.id}>
            <td>{record.label} {record.active ? <RunningIcon className="green-icon"/> : ""}</td>
            <td>{record.url }</td>
            <td>{record.periodicity.toString()}</td>
            <td>
                {record.tags.map(tag => (<div key={tag}>{tag}</div>))}
            </td>
            <td>{record.lastExecTime?.toISOString() ?? "-"}</td>
            <td>{ExecutionData.getStatusString(record.lastExecStatus)}</td>
            <td>
                <Button onClick={props.editCallback} variant="warning" className="m-1">
                    <EditIcon />
                </Button>
                <Button onClick={props.deleteCallback} variant="danger" className="m-1">
                    <DeleteIcon />
                </Button>
                <Button onClick={props.startCallback} variant="success" className="m-1">
                    <StartIcon />
                </Button>
            </td>
            <td>
                <Form.Check type="checkbox" onChange={props.checkCallback} defaultChecked={props.isChecked}/>
            </td>
        </tr>
    );
}