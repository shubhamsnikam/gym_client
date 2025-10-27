import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Button,
  Spinner,
  ProgressBar,
  Modal,
  Form,
  Badge,
  ListGroup,
} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMemberById, updateMember } from '../services/api';
import { getPhotoUrl } from '../utils/photoUrl';

const MemberDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewMonths, setRenewMonths] = useState(1);
  const [renewing, setRenewing] = useState(false);

  const [showWeightModal, setShowWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [updatingWeight, setUpdatingWeight] = useState(false);

  useEffect(() => {
    fetchMember();
  }, [id]);

  const fetchMember = async () => {
    try {
      const fetchedMember = await getMemberById(id);
      setMember(fetchedMember);
    } catch {
      toast.error('Failed to fetch member details.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? 'N/A'
      : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleRenew = async () => {
    try {
      setRenewing(true);
      const formData = new FormData();
      formData.append('membershipDuration', renewMonths);
      await updateMember(id, formData);
      setShowRenewModal(false);
      toast.success(`Membership renewed for ${renewMonths} month(s)!`);
      await fetchMember();
    } catch {
      toast.error('Failed to renew membership.');
    } finally {
      setRenewing(false);
    }
  };

  const handleUpdateWeight = async () => {
    if (!newWeight || isNaN(newWeight)) {
      toast.warning('Please enter a valid weight.');
      return;
    }
    try {
      setUpdatingWeight(true);
      const formData = new FormData();
      formData.append('bodyWeight', newWeight);
      await updateMember(id, formData);
      toast.success(`Body weight updated to ${newWeight} kg successfully!`);
      await fetchMember();
      setShowWeightModal(false);
      setNewWeight('');
    } catch {
      toast.error('Failed to update weight.');
    } finally {
      setUpdatingWeight(false);
    }
  };

  if (loading) return <Spinner animation="border" className="mt-5 mx-auto d-block" />;
  if (!member) return null;

  const startDate = new Date(member.membershipStartDate);
  const endDate = new Date(member.membershipEndDate);
  const today = new Date();
  endDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const isExpired = endDate < today;

  const totalDuration = endDate - startDate;
  const elapsed = today - startDate;
  const progress = totalDuration > 0 ? Math.min((elapsed / totalDuration) * 100, 100) : 0;

  return (
    <div className="page-content" style={{ paddingTop: '70px', maxWidth: '960px', margin: 'auto' }}>
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />

      <Card className="mt-3 shadow-lg border-0 rounded-4">
        <Card.Body className="p-4">
          <Row className="align-items-start">
            {/* --- Photo & Weight --- */}
            <Col md={4} className="text-center">
              <div className="position-relative d-inline-block">
                <img
                  src={getPhotoUrl(member.photo)}
                  alt="Profile"
                  className="rounded-circle shadow"
                  style={{ width: '160px', height: '160px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/160?text=No+Image';
                  }}
                />
                <Badge
                  bg={isExpired ? 'danger' : 'success'}
                  pill
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{ fontSize: '0.8rem' }}
                >
                  {isExpired ? 'Expired' : 'Active'}
                </Badge>
              </div>

              <h3 className="mt-3">{member.name}</h3>
              <p className="text-muted">{member.workoutPlan || 'No Plan Assigned'}</p>

              <Card className="mt-3 shadow-sm border-0 bg-light text-center">
                <Card.Body>
                  <h6 className="text-muted">Body Weight</h6>
                  <h3>{member.bodyWeight ?? 'N/A'} kg</h3>
                  <Button variant="primary" size="sm" onClick={() => setShowWeightModal(true)}>
                    ⚖️ Update Weight
                  </Button>
                </Card.Body>
              </Card>

              {member.previousWeights?.length > 0 && (
                <Card className="mt-3 shadow-sm p-3">
                  <h6>Previous Weights</h6>
                  <ul className="list-group list-group-flush">
                    {member.previousWeights.map((entry, idx) => (
                      <li key={idx} className="list-group-item d-flex justify-content-between">
                        <span>{new Date(entry.date).toLocaleDateString()}</span>
                        <span>{entry.weight} kg</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </Col>

            {/* --- Details --- */}
            <Col md={8}>
              <Row className="mb-3">
                <Col md={6}>
                  <Card className="mb-3 shadow-sm border-0 bg-light">
                    <Card.Body>
                      <h6 className="text-muted">Membership</h6>
                      <h5>
                        {formatDate(member.membershipStartDate)} – {formatDate(member.membershipEndDate)}
                      </h5>
                      <ProgressBar now={progress} label={`${Math.round(progress)}%`} className="mt-2" />
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className="mb-3 shadow-sm border-0 bg-light">
                    <Card.Body>
                      <h6 className="text-muted">Fees</h6>
                      <h5>
                        Paid: ₹{member.paidFee ?? 0} <br />
                        Pending: ₹{member.pendingFee ?? 0}
                      </h5>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <Card className="shadow-sm border-0 bg-white">
                    <Card.Body>
                      <h6>Contact Info</h6>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <strong>Mobile:</strong> {member.mobileNumber ?? 'N/A'}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Emergency:</strong> {member.emergencyContactNumber ?? 'N/A'}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Address:</strong> {member.address ?? 'N/A'}
                        </ListGroup.Item>
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6} className="mb-3">
                  <Card className="shadow-sm border-0 bg-white">
                    <Card.Body>
                      <h6>Health & Membership</h6>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <strong>Health Conditions:</strong>{' '}
                          <Badge bg="info">{member.healthConditions || 'None'}</Badge>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Workout Plan:</strong>{' '}
                          <Badge bg="secondary">{member.workoutPlan || 'N/A'}</Badge>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Duration:</strong>{' '}
                          <Badge bg="success">{member.membershipDuration} mo</Badge>
                        </ListGroup.Item>
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row>
                {['Chest', 'Waist', 'Hips', 'Abs', 'Arms'].map((part) => (
                  <Col md={4} key={part} className="mb-3">
                    <Card className="shadow-sm border-0 bg-white text-center">
                      <Card.Body>
                        <h6 className="text-muted">{part}</h6>
                        <h5>{member.bodyMeasurements?.[part.toLowerCase()] ?? 'N/A'} cm</h5>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <div className="mt-3 d-flex justify-content-between">
                <Button variant="secondary" onClick={() => navigate('/members')}>
                  ← Back to Members
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>


      {/* --- Weight Modal --- */}
      <Modal show={showWeightModal} onHide={() => setShowWeightModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Weight</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Enter New Weight (kg):</Form.Label>
            <Form.Control
              type="number"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="e.g., 72"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowWeightModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateWeight} disabled={updatingWeight}>
            {updatingWeight ? 'Updating...' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MemberDetails;
