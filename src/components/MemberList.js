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

  // ✅ Consistent local date formatting (avoids timezone offset issues)
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
        <h2 className="zigzag-underline">🏋️ Members List</h2>
        <Link to="/members/add">
          <Button variant="success">Register New Member</Button>
        </Link>
      </div>

      {(error || success) && (
        <Alert
          variant={success ? 'success' : 'danger'}
          style={{
            position: 'fixed',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            minWidth: '300px',
            textAlign: 'center',
          }}
        >
          {success || error}
        </Alert>
      )}

      <Card className="mb-4 shadow-sm border-0">
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
            <p className="text-center my-4">Loading members...</p>
          ) : filteredMembers.length === 0 ? (
            <p className="text-center my-4">
              {searchTerm ? 'No members match your search.' : 'No members found. Add a new member to get started.'}
            </p>
          ) : (
            <div className="table-responsive">
              <Table striped hover>
                <thead>
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
                              width: '40px',
                              height: '40px',
                              objectFit: 'cover',
                              borderRadius: '50%',
                              cursor: 'pointer',
                            }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/40?text=No+Img';
                            }}
                          />
                        </td>
                        <td>{member.name}</td>
                        <td>{member.mobileNumber}</td>
                        <td>{formatDate(member.membershipEndDate)}</td>
                        <td>
                          <span className={`badge ${isExpired ? 'bg-danger' : 'bg-success'}`}>
                            {isExpired ? 'Expired' : 'Active'}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
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

      {/* Image preview modal */}
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
              e.target.src = 'https://via.placeholder.com/150?text=No+Image';
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MembersList;
