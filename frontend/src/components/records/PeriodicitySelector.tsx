import React from "react";
import { Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { Periodicity } from "../../model/Record";

interface PeriodicityProps {
    value: Periodicity;
    onChangeCallback: (event: any) => void;
}
export class PeriodicitySelector extends React.Component<PeriodicityProps> {

    constructor(props: PeriodicityProps) {
        super(props);
    }
    render() {

        return (
            <Form.Group onChange={this.props.onChangeCallback}>
                <Row>
                    <Col className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-3 d-flex p-2">
                        <FloatingLabel controlId="days-label" label="Days">
                            <Form.Control type="text" defaultValue={this.props.value.days} name="days"/>
                        </FloatingLabel>
                    </Col>
                    <Col className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-3 d-flex p-2">
                        <FloatingLabel controlId="hours-label" label="Hours">
                            <Form.Control type="text" defaultValue={this.props.value.hours} name="hours"/>
                        </FloatingLabel>
                    </Col>
                    <Col className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-3 d-flex p-2">
                        <FloatingLabel controlId="mins-label" label="Minutes">
                            <Form.Control type="text" defaultValue={this.props.value.minutes} name="minutes"/>
                        </FloatingLabel>
                    </Col>
                </Row>
            </Form.Group>
        );
    }
}