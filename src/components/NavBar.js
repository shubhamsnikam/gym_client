import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css';



const NavBar = () => {
  return (
    <Navbar
  bg="dark"
  variant="dark"
  expand="lg"
  fixed="top"
  className="shadow-sm"
  style={{ zIndex: 1050 }}  // ensure it's above other content
>
 <Container>
        {/* Brand / Logo */}
        <Navbar.Brand as={Link} to="/">
          Sai Fitness Gym
        </Navbar.Brand>

        {/* Toggle button for mobile view */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Collapsible navigation links */}
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Left-aligned nav links */}
          <Nav className= "me-auto  ">
            <Nav.Link as={Link} to="/" className="custom-nav-link">Home</Nav.Link>
            <Nav.Link as={Link} to="/members" className="custom-nav-link">Members</Nav.Link>
            <Nav.Link as={Link} to="/help" className="custom-nav-link">Help</Nav.Link>
          </Nav>

          {/* Right-aligned actions */}
          <Nav>
            <Nav.Item className="d-flex align-items-center">
              {/* Bootstrap styled button link */}
              <Button as={Link} to="/members/add" variant="primary" className="ms-lg-2 navbar-register-btn">
                🏋️ New Member
              </Button>
            </Nav.Item>
           </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
