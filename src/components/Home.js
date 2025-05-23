import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css';

const Home = () => {
  return (
    <div className="home-background mt-3">
      <div className="home-overlay">
        <div className="home-content"> 
          <h1 className=" gym mb-4">Sai Fitness Gym</h1>
          <p className="lead mb-5">
            Manage your gym members, track memberships, and monitor fitness progress all in one place.
          </p>

          <div className="c d-flex justify-content-center flex-wrap gap-4">
            <div className="cards col-md-4 mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>Member Management</Card.Title>
                  <Card.Text>
                    Register new members, update their information, and manage their memberships.
                  </Card.Text>
                  <Link to="/members">
                    <Button variant="primary">View Members</Button>
                  </Link>
                </Card.Body>
              </Card>
            </div>

            <div className="cards col-md-4 mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>New Registration</Card.Title>
                  <Card.Text>
                    Add a new member to the system with all their details and membership information.
                  </Card.Text>
                  <Link to="/members/add">
                    <Button variant="success">Register Member</Button>
                  </Link>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

