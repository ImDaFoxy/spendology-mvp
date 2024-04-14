import React, { useState, useEffect} from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';

export const Profile = () => {
    const [expanded, setExpanded] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
          fetchUsernameandEmail(userId);
        }
    }, []); // Empty dependency array to run only once on component mount
    
    const fetchUsernameandEmail = async (userId) => {
        try {
            const usernameResponse = await fetch(`http://localhost:3001/username/${userId}`);
            const usernameData = await usernameResponse.json();
            setUsername(usernameData.username);
    
            const emailResponse = await fetch(`http://localhost:3001/email/${userId}`);
            const emailData = await emailResponse.json();
            setEmail(emailData.email);
        } catch (error) {
            console.error('Error fetching username and email:', error);
        }
    };
    
    const handleLogout = () => {
        localStorage.removeItem('userData');
        localStorage.removeItem('userId');
        navigate('/');
    }

    return (
        <div className="container">
            <div className="main">
                <Navbar bg="lightblue" variant="dark" expand="md" className="navbar-custom">
                    <Container>
                        <Navbar.Brand href="#home" style={{ color: '#0C359E', fontWeight: 'bold' }}>Spendology</Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={() => setExpanded(!expanded)} />
                        <Navbar.Collapse id="responsive-navbar-nav" className={expanded ? 'show' : ''}>
                            <Nav className="me-auto">
                                <Nav.Link href="http://localhost:3000/expense-tracker">Home</Nav.Link>
                                <Nav.Link href="http://localhost:3000/profile-page">Profile</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <div className="row">
                    <div className="col-md-4 mt-1 d-flex">
                        <div className="card text-center sidebar flex-grow-1">
                            <div className="card-body">
                                <img src="https://cdn-icons-png.flaticon.com/512/8847/8847419.png" className="rounded-circle" width="150" alt="User profile"></img>
                                <div className="mt-3 text-center">
                                    <h1>{username}</h1>
                                    <hr></hr>
                                    <b></b>
                                    <button className='btn btn-danger' onClick={handleLogout}>Log Out</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8 mt-1 d-flex">
                        <div className="card md-3 content flex-grow-1">
                            <h1 className="m-3 pt-3">About Me</h1>
                            <div className="card-body">
                                <br></br>
                                <div className="row">
                                    <div className="col-md-12">
                                        <table className="table">
                                            <tbody>
                                                <tr>
                                                    <td><h5>Username:</h5></td>
                                                    <td><h5>{username}</h5></td>
                                                </tr>
                                                <tr>
                                                    <td><h5>Email:</h5></td>
                                                    <td><h5>{email}</h5></td>
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