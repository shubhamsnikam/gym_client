import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Spinner, Alert, ListGroup } from 'react-bootstrap';
import { getMemberById } from '../services/api';
import { getPhotoUrl } from '../utils/photoUrl';

const MemberDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const fetchedMember = await getMemberById(id);
        setMember(fetchedMember);
      } catch (err) {
        setError('Failed to fetch member details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  if (loading) return <Spinner animation="border" className="mt-5 mx-auto d-block" />;
  if (error) return <Alert variant="danger" className="mt-3">{error}</Alert>;
  if (!member) return null;

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  return (
    <div className="page-content" style={{ paddingTop: '70px', maxWidth: '960px', margin: 'auto' }}>
      <Card className="mt-2 mb-4">
        <Card.Header>
          <h4>Member Details</h4>
        </Card.Header>

        <Card.Body>
          <Row>
            <Col md={3} className="d-flex align-items-center justify-content-center">
              <img
                src={getPhotoUrl(member.photo)}
                alt="Profile"
                style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
              />
            </Col>
            <Col md={9}>
              <Row>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item><strong>Name:</strong> {member.name}</ListGroup.Item>
                    <ListGroup.Item><strong>Date of Birth:</strong> {formatDate(member.dob)}</ListGroup.Item>
                    <ListGroup.Item><strong>Address:</strong> {member.address}</ListGroup.Item>
                    <ListGroup.Item><strong>Mobile:</strong> {member.mobileNumber}</ListGroup.Item>
                    <ListGroup.Item><strong>Emergency Contact:</strong> {member.emergencyContactNumber}</ListGroup.Item>
                    <ListGroup.Item><strong>Health Conditions:</strong> {member.healthConditions ?? 'N/A'}</ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item><strong>Membership Start:</strong> {formatDate(member.membershipStartDate)}</ListGroup.Item>
                    <ListGroup.Item><strong>Duration (months):</strong> {member.membershipDuration}</ListGroup.Item>
                    <ListGroup.Item><strong>End Date:</strong> {formatDate(member.membershipEndDate)}</ListGroup.Item>
                    <ListGroup.Item><strong>Paid Fee:</strong> ₹{member.paidFee}</ListGroup.Item>
                    <ListGroup.Item><strong>Pending Fee:</strong> ₹{member.pendingFee}</ListGroup.Item>
                    <ListGroup.Item><strong>Workout Plan:</strong> {member.workoutPlan ?? 'N/A'}</ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </Col>
          </Row>

          <hr />

          <Row>
            <Col md={6}>
              <h5>Body Weight= {member.bodyWeight} kg </h5>
            </Col>
            <Col md={6}>
              <h5>Body Measurements</h5>
              <ListGroup variant="flush">
                <ListGroup.Item><strong>Chest:</strong> {member.bodyMeasurements?.chest} cm</ListGroup.Item>
                <ListGroup.Item><strong>Waist:</strong> {member.bodyMeasurements?.waist} cm</ListGroup.Item>
                <ListGroup.Item><strong>Hips:</strong> {member.bodyMeasurements?.hips} cm</ListGroup.Item>
                <ListGroup.Item><strong>Abs:</strong> {member.bodyMeasurements?.abs} cm</ListGroup.Item>
                <ListGroup.Item><strong>Arms:</strong> {member.bodyMeasurements?.arms} cm</ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>

          <div className="mt-4 d-flex justify-content-end">
            <Button variant="danger" onClick={() => navigate('/members')}>Back to Members</Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default MemberDetails;
