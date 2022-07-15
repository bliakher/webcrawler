import React from "react";
import { Button, Col, FloatingLabel, Form, FormGroup, Modal, Row } from "react-bootstrap";
import { ServiceRest } from "../../api/rest/service";
import { Periodicity, RecordData, RecordEditable } from "../../model/Record";
import { PeriodicitySelector } from "./PeriodicitySelector";

interface EditModalProps {
    initialRecord: RecordData;
    onCloseCallback: () => void;
    onSaveCallback: (updatedRecord: RecordEditable, recordId: number) => void;
    text: string;
}

interface EditModalState {
    record: RecordEditable;
}


export class EditModal extends React.Component<EditModalProps, EditModalState> {
    constructor(props: EditModalProps) {
        super(props);
        var periodicityCopy = new Periodicity(0);
        periodicityCopy.days = props.initialRecord.periodicity.days;
        periodicityCopy.hours = props.initialRecord.periodicity.hours;
        periodicityCopy.minutes = props.initialRecord.periodicity.minutes;
        this.state = {record: {
            url: props.initialRecord.url,
            regEx: props.initialRecord.regEx,
            periodicity: periodicityCopy,
            label: props.initialRecord.label,
            active: props.initialRecord.active,
            tags: props.initialRecord.tags
        } }
        this.handlePeriodicityChange = this.handlePeriodicityChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleActiveCheck = this.handleActiveCheck.bind(this);
    }

    handlePeriodicityChange(event: any) {
        var record = this.state.record;
        var periodicity = record.periodicity;
        var target = event.target;
        var value = target.value !== "" ? parseInt(target.value) : 0;
        if (target.name === "days") periodicity.days = value;
        if (target.name === "hours") periodicity.hours = value;
        if (target.name === "minutes") periodicity.minutes = value;
        this.setState({record: record});
    }
    handleTextChange(event: any) {
        var record = this.state.record;
        var target = event.target;
        if (target.name === "label") record.label = target.value;
        if (target.name === "url") record.url = target.value;
        if (target.name === "regex") record.regEx = target.value;
        if (target.name === "tags") record.tags = target.value.split(" ");
        this.setState({record: record});
    }
    handleActiveCheck(event: any) {
        var record = this.state.record;
        record.active = event.target.checked;
        this.setState({record: record});
    }

    handleSave() {
        // Service.updateRecord(this.props.initialRecord.id, this.state.record);
        this.props.onSaveCallback(this.state.record, this.props.initialRecord.id);
        this.props.onCloseCallback();
    }

    render() {
        return (
            <Modal onHide={this.props.onCloseCallback} show={true}>
                <Modal.Header closeButton>
                <Modal.Title>{this.props.text}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row onChange={this.handleTextChange}>
                            <Col className="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5 col-xxl-5 d-flex p-2">
                                <FloatingLabel controlId="label-label" label="Label">
                                    <Form.Control type="text" defaultValue={this.state.record.label} name="label"/>
                                </FloatingLabel>
                            </Col>
                            <Col className="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5 col-xxl-5 d-flex p-2">
                                <FloatingLabel controlId="url-label" label="URL">
                                    <Form.Control type="text" defaultValue={this.state.record.url} name="url"/>
                                </FloatingLabel>
                            </Col>
                    </Row>
                    <Row onChange={this.handleTextChange}>
                            <Col className="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5 col-xxl-5 d-flex p-2">
                                <FloatingLabel controlId="regex-label" label="RegEx">
                                    <Form.Control type="text" defaultValue={this.state.record.regEx} name="regex"/>
                                </FloatingLabel>
                            </Col>
                            <Col className="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5 col-xxl-5 d-flex p-2">
                                <FloatingLabel controlId="tags-label" label="Tags">
                                    <Form.Control type="text" defaultValue={this.state.record.tags.join(" ")} name="tags"/>
                                </FloatingLabel>
                            </Col>
                    </Row>

                    <Row>
                        <Col className="col-10 col-sm-10 col-md-10 col-lg-10 col-xl-10 col-xxl-10 d-flex p-2">
                            <PeriodicitySelector value={this.state.record.periodicity} onChangeCallback={this.handlePeriodicityChange} />
                        </Col>
                        <Col className="col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 col-xxl-1 p-2">
                            <Form.Label htmlFor="active-check" className="m-1">Active</Form.Label>
                            <Form.Check type="checkbox" onChange={this.handleActiveCheck} id="active-check" className="m-1"
                                defaultChecked={this.state.record.active} />
                        </Col>
                    </Row>
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.onCloseCallback}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={this.handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}