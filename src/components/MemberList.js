import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Alert, Form, InputGroup, Modal, Badge, Spinner } from 'react-bootstrap';
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
    } catch {
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
        setSuccess('✅ Member deleted successfully');
        setConfirmDelete(null);
        setTimeout(() => setSuccess(''), 2000);
      } catch {
        setError('❌ Failed to delete member');
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
    (m) =>
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.mobileNumber?.includes(searchTerm)
  );

  return (
    <div className="my-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-danger mb-0">🏋️ Members List</h3>
        <Link to="/members/add">
          <Button variant="danger" className="shadow-sm">
            ➕ Register New Member
          </Button>
        </Link>
      </div>

      {/* Alerts */}
      {(error || success) && (
        <Alert
          variant={success ? 'success' : 'danger'}
          className="text-center shadow position-fixed top-50 start-50 translate-middle"
          style={{ zIndex: 9999, minWidth: '320px' }}
        >
          {success || error}
        </Alert>
      )}

      <Card className="shadow-sm border-0 rounded-4">
        <Card.Body>
          {/* Search Bar */}
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="🔍 Search by name or mobile number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                Clear
              </Button>
            )}
          </InputGroup>

          {/* Table */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="danger" />
              <p className="mt-3 text-muted">Loading members...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <p className="text-center py-4 text-muted">
              {searchTerm
                ? 'No members match your search.'
                : 'No members found. Add a new member to get started.'}
            </p>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="table-danger text-center">
                  <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Membership Ends</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => {
                    const photoUrl = getPhotoUrl(member.photo);
                    const endDate = new Date(member.membershipEndDate);
                    const today = new Date();
                    endDate.setHours(0, 0, 0, 0);
                    today.setHours(0, 0, 0, 0);
                    const isExpired = endDate < today;

                    return (
                      <tr key={member._id}>
                        <td className="text-center">
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
                              borderRadius: '50%',
                              objectFit: 'cover',
                              cursor: 'pointer',
                              border: '2px solid #f8d7da',
                            }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/45?text=No+Img';
                            }}
                          />
                        </td>
                        <td>{member.name}</td>
                        <td>{member.mobileNumber}</td>
                        <td>{formatDate(member.membershipEndDate)}</td>
                        <td className="text-center">
                          <Badge bg={isExpired ? 'secondary' : 'success'}>
                            {isExpired ? 'Expired' : 'Active'}
                          </Badge>
                        </td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <Link to={`/members/${member._id}`}>
                              <Button variant="outline-success" size="sm">
                                View
                              </Button>
                            </Link>
                            <Link to={`/members/edit/${member._id}`}>
                              <Button variant="outline-primary" size="sm">
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant={confirmDelete === member._id ? 'danger' : 'outline-danger'}
                              size="sm"
                              onClick={() => handleDelete(member._id)}
                            >
                              {confirmDelete === member._id ? 'Confirm' : 'Delete'}
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
            style={{
              width: '100%',
              maxHeight: '500px',
              objectFit: 'contain',
              borderRadius: '12px',
            }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150?text=No+Image';
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MembersList;
