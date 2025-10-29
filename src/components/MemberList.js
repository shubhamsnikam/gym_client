import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Alert, Form, InputGroup, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getMembers, deleteMember } from '../services/api';
import { getPhotoUrl } from '../utils/photoUrl';

const MembersList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await getMembers();
      setMembers(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirmDelete === id) {
      try {
        await deleteMember(id);
        setMembers((prev) => prev.filter((m) => m._id !== id));
        setSuccess('Member deleted successfully');
        setConfirmDelete(null);
        setTimeout(() => setSuccess(''), 2000);
      } catch (err) {
        console.error(err);
        setError('Failed to delete member');
        setTimeout(() => setError(''), 2000);
      }
    } else {
      setConfirmDelete(id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.mobileNumber?.includes(searchTerm)
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ color: '#ffb300' }}>
          🏋️ Members List
        </h2>
        <Link to="/members/add">
          <Button style={{ backgroundColor: '#007bff', border: 'none' }}>
            Register New Member
          </Button>
        </Link>
      </div>

      {(error || success) && (
        <Alert
          variant={success ? 'success' : 'danger'}
          className="text-center position-fixed top-50 start-50 translate-middle shadow"
          style={{ zIndex: 9999, minWidth: '300px' }}
        >
          {success || error}
        </Alert>
      )}

      <Card className="mb-4 shadow-lg border-0">
        <Card.Body>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Search by name or mobile number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                Clear
              </Button>
            )}
          </InputGroup>

          {loading ? (
            <p className="text-center my-4 text-muted">Loading members...</p>
          ) : filteredMembers.length === 0 ? (
            <p className="text-center my-4 text-muted">
              {searchTerm
                ? 'No members match your search.'
                : 'No members found. Add a new member to get started.'}
            </p>
          ) : (
            <div className="table-responsive">
              <Table
                hover
                bordered
                className="align-middle text-center shadow-sm rounded"
                style={{
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                <thead
                  style={{
                    background: 'linear-gradient(90deg, #ffcc00, #007bff, #ff4d4d)',
                    color: 'white',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Membership Ends</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: '#fffdf6' }}>
                  {filteredMembers.map((member) => {
                    const photoUrl = getPhotoUrl(member.photo);
                    const endDate = new Date(member.membershipEndDate);
                    const today = new Date();
                    endDate.setHours(0, 0, 0, 0);
                    today.setHours(0, 0, 0, 0);
                    const isExpired = endDate < today;

                    return (
                      <tr
                        key={member._id}
                        style={{
                          transition: 'background-color 0.25s ease',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = '#fff7cc')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = '#fffdf6')
                        }
                      >
                        <td>
                          <img
                            src={photoUrl}
                            alt="Profile"
                            title="Click to preview"
                            onClick={() => {
                              setPreviewUrl(photoUrl);
                              setShowPreview(true);
                            }}
                            style={{
                              width: '45px',
                              height: '45px',
                              objectFit: 'cover',
                              borderRadius: '50%',
                              cursor: 'pointer',
                              border: '2px solid #007bff',
                            }}
                            onError={(e) => {
                              if (!e.target.dataset.fallback) {
                                e.target.src = '/no-image.png';
                                e.target.dataset.fallback = 'true';
                              }
                            }}
                          />
                        </td>
                        <td className="fw-semibold">{member.name}</td>
                        <td>{member.mobileNumber}</td>
                        <td>{formatDate(member.membershipEndDate)}</td>
                        <td>
                          <span
                            className={`badge px-3 py-2 ${
                              isExpired ? 'bg-danger' : 'bg-success'
                            }`}
                          >
                            {isExpired ? 'Expired' : 'Active'}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2 justify-content-center">
                            <Link to={`/members/${member._id}`}>
                              <Button variant="success" size="sm">
                                View
                              </Button>
                            </Link>
                            <Link to={`/members/edit/${member._id}`}>
                              <Button variant="primary" size="sm">
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant={
                                confirmDelete === member._id
                                  ? 'danger'
                                  : 'outline-danger'
                              }
                              size="sm"
                              onClick={() => handleDelete(member._id)}
                            >
                              {confirmDelete === member._id
                                ? 'Confirm'
                                : 'Delete'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Image Preview Modal */}
      <Modal show={showPreview} onHide={() => setShowPreview(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Profile Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={previewUrl}
            alt="Preview"
            style={{ width: '100%', maxHeight: '600px', objectFit: 'contain' }}
            onError={(e) => {
              if (!e.target.dataset.fallback) {
                e.target.src = '/no-image.png';
                e.target.dataset.fallback = 'true';
              }
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MembersList;
