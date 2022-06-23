import React from 'react';
import { Outlet} from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav } from 'react-bootstrap';
import logo from '../logo.png'

export const Layout = () => {
    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                <Navbar.Brand href="#/">
                    Crawler
                </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/crawler">Web records</Nav.Link>
                        <Nav.Link href="/crawler/exec">Executions</Nav.Link>
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet />
        </>
    );
}