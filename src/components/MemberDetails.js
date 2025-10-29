import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Button,
  Spinner,
  Modal,
  Form,
  Badge,
  ListGroup,
  ProgressBar,
} from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMemberById, updateMember } from '../services/api';
import { getPhotoUrl } from '../utils/photoUrl';
import { Dumbbell, CalendarDays, HeartPulse, Wallet, Phone } from 'lucide-react';

const MemberDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [updatingWeight, setUpdatingWeight] = useState(false);

  useEffect(() => {
    fetchMember();
  }, [id]);

  const fetchMember = async () => {
    try {
      const fetched = await getMemberById(id);
      setMember(fetched);
    } catch {
      toast.error('❌ Failed to load member details.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

  const today = new Date();
  const start = new Date(member?.membershipStartDate);
  const end = new Date(member?.membershipEndDate);
  const expired = end < today;
  const progress =
    member && start && end ? Math.min(((today - start) / (end - start)) * 100, 100).toFixed(0) : 0;

  const handleWeightUpdate = async () => {
    if (!newWeight || isNaN(newWeight)) return toast.warning('Enter a valid weight');
    try {
      setUpdatingWeight(true);
      const formData = new FormData();
      formData.append('bodyWeight', newWeight);
      await updateMember(id, formData);
      toast.success(`✅ Weight updated to ${newWeight} kg`);
      setShowWeightModal(false);
      setNewWeight('');
      await fetchMember();
    } catch {
      toast.error('❌ Failed to update weight.');
    } finally {
      setUpdatingWeight(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (!member) return null;

  return (
    <div className="container my-5" style={{ maxWidth: '1100px' }}>
      <ToastContainer position="top-center" theme="colored" />

      {/* === Header Section === */}
      <div
        className="p-4 rounded-4 shadow text-white mb-4"
        style={{
          background: '#1b1f3b',
        }}
      >
        <Row className="align-items-center">
          <Col md={3} className="text-center mb-3 mb-md-0">
            <img
              src={getPhotoUrl(member.photo)}
              onError={(e) => (e.target.src = 'https://via.placeholder.com/150?text=No+Image')}
              alt="Member"
              className="rounded-circle border border-3 border-light shadow-sm"
              width={140}
              height={140}
              style={{ objectFit: 'cover' }}
            />
            <Badge
              bg={expired ? 'danger' : 'success'}
              className="mt-3 px-3 py-1"
              pill
            >
              {expired ? 'Expired' : 'Active'}
            </Badge>
          </Col>
          <Col md={9}>
            <h2 className="fw-bold text-light">{member.name}</h2>
            <p className="mb-1 text-light opacity-75">{member.address}</p>
            <p className="mb-2 text-light">
              <Phone size={16} className="me-1" /> {member.mobileNumber}
            </p>
            <div>
              <Badge bg="info" className="me-2">
                <Dumbbell size={14} className="me-1" /> {member.workoutPlan || 'No Plan'}
              </Badge>
              <Badge bg="warning" text="dark">
                {member.membershipDuration} Month{member.membershipDuration > 1 && 's'}
              </Badge>
            </div>
          </Col>
        </Row>
      </div>

      {/* === Key Stats === */}
      <Row className="g-4 mb-4 text-center">
        <Col md={4}>
          <Card className="shadow-sm h-100 border-light">
            <Card.Body>
              <CalendarDays size={24} className="text-primary mb-2" />
              <h6 className="fw-bold text-dark">Membership Duration</h6>
              <p className="mb-1 text-muted">
                {formatDate(member.membershipStartDate)} → {formatDate(member.membershipEndDate)}
              </p>
              <ProgressBar now={progress} label={`${progress}%`} className="mt-2" />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm h-100 border-light">
            <Card.Body>
              <HeartPulse size={24} className="text-success mb-2" />
              <h6 className="fw-bold text-dark">Health Condition</h6>
              <p className="mb-0 text-muted">{member.healthConditions || 'None'}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm h-100 border-light">
            <Card.Body>
              <Wallet size={24} className="text-warning mb-2" />
              <h6 className="fw-bold text-dark">Fees Summary</h6>
              <p className="mb-1 text-success fw-semibold">Paid: ₹{member.paidFee}</p>
              <p className="mb-0 text-danger fw-semibold">Pending: ₹{member.pendingFee}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* === Body Measurements === */}
      <Card className="shadow-sm border-light mb-4">
        <Card.Header className="bg-primary text-white fw-semibold">
          🏋️ Body Measurements
        </Card.Header>
        <Card.Body>
          <Row>
            {['chest', 'waist', 'hips', 'abs', 'arms'].map((part) => (
              <Col md={4} key={part} className="mb-3">
                <div className="p-3 bg-light rounded text-center border border-0 shadow-sm">
                  <h6 className="text-muted text-uppercase mb-1">{part}</h6>
                  <h5 className="fw-bold text-dark">
                    {member.bodyMeasurements?.[part] || 'N/A'} cm
                  </h5>
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* === Weight Tracker === */}
      <Card className="shadow-sm border-light mb-4">
        <Card.Header className="bg-danger text-white fw-semibold">
          ⚖️ Weight Tracker
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h4 className="fw-bold text-dark">{member.bodyWeight ?? 'N/A'} kg</h4>
            <Button variant="outline-danger" size="sm" onClick={() => setShowWeightModal(true)}>
              Update Weight
            </Button>
          </div>
          {member.previousWeights?.length > 0 ? (
            <ListGroup>
              {member.previousWeights.map((w, i) => (
                <ListGroup.Item
                  key={i}
                  className="d-flex justify-content-between border-0 shadow-sm mb-1 rounded"
                >
                  <span>{new Date(w.date).toLocaleDateString()}</span>
                  <span className="fw-semibold">{w.weight} kg</span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p className="text-muted">No previous records.</p>
          )}
        </Card.Body>
      </Card>

      <div className="text-end">
        <Button variant="secondary" onClick={() => navigate('/members')}>
          ← Back to Members
        </Button>
      </div>

      {/* === Weight Modal === */}
      <Modal show={showWeightModal} onHide={() => setShowWeightModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Weight</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Enter new weight (kg)</Form.Label>
            <Form.Control
              type="number"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="e.g., 75"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowWeightModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleWeightUpdate} disabled={updatingWeight}>
            {updatingWeight ? 'Updating...' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MemberDetails;
