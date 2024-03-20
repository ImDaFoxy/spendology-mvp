import React, { useState } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './profile.css';

export const Profile = () => {
    const [expanded, setExpanded] = useState(false);
    const [fileUrl, setFileUrl] = useState(null);

    return (
        <div className="container">
            <div className="main">
                <Navbar bg="lightblue" variant="dark" expand="md" className="navbar-custom">
                    <Container>
                        <Navbar.Brand href="#home" color="#E7D27C">Spendology</Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={() => setExpanded(!expanded)} />
                        <Navbar.Collapse id="responsive-navbar-nav" className={expanded ? 'show' : ''}>
                            <Nav className="me-auto">
                                <Nav.Link href="#home">Home</Nav.Link>
                                <Nav.Link href="#about">Budget List</Nav.Link>
                                <Nav.Link href="#services">Profile</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <div className="row">
                    <div className="col-md-4 mt-1 d-flex">
                        <div className="card text-center sidebar flex-grow-1">
                            <div className="card-body">
                                <img src="./user.png" className="rounded-circle" width="150" alt="User profile picture"></img>
                                <div className="mt-3">
                                    <h3>Firstname Lastname</h3>
                                    <a href="">Expense Tracker</a> <b></b>
                                    <a href="">Settings</a> <b></b>
                                    <a href="">Log Out</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8 mt-1 d-flex">
                        <div className="card md-3 content flex-grow-1">
                            <h1 className="m-3 pt-3">About</h1>
                            <div className="card-body">
                                <br></br>
                                <div className="row">
                                <div className="col-md-12">
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <td><h5>Full Name</h5></td>
                                                <td><p className="text-secondary">Firstname Lastname</p></td>
                                            </tr>
                                            <tr>
                                                <td><h5>Username</h5></td>
                                                <td><p className="text-secondary">name123</p></td>
                                            </tr>
                                            <tr>
                                                <td><h5>Email</h5></td>
                                                <td><p className="text-secondary">name@gmail.com</p></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
