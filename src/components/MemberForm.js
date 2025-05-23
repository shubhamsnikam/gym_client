// MemberForm.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createMember, getMemberById, updateMember } from '../services/api';
import { getPhotoUrl } from '../utils/photoUrl';


const MemberForm = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [initialValues, setInitialValues] = useState({
    name: '',
    address: '',
    dob: '',
    healthConditions: '',
    membershipDuration: 1,
    membershipStartDate: new Date().toISOString().split('T')[0],
    paidFee: 0,
    pendingFee: 0,
    workoutPlan: '',
    bodyWeight: '',
    bodyMeasurements: {
      chest: '', waist: '', hips: '', abs: '', arms: ''
    },
    mobileNumber: '',
    emergencyContactNumber: '',
    photo: null
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
  };

  const calculateEndDate = (startDate, duration) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + parseInt(duration));
    return formatDate(date);
  };

  useEffect(() => {
    if (!isEdit) return;

    const fetchMember = async () => {
      try {
        const member = await getMemberById(id);
        const formatted = {
          ...member,
          dob: formatDate(member.dob),
          membershipStartDate: formatDate(member.membershipStartDate),
          membershipEndDate: formatDate(member.membershipEndDate),
          bodyMeasurements: { ...initialValues.bodyMeasurements, ...member.bodyMeasurements },
          photo: member.photo || null
        };
        setInitialValues(formatted);
      } catch {
        setError('Failed to fetch member data.');
        setTimeout(() => setError(''), 1000);
      }
    };

    fetchMember();
  }, [id, isEdit]);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    address: Yup.string().required('Address is required'),
    dob: Yup.date().required('Date of Birth is required'),
    membershipDuration: Yup.number().required('Membership duration is required'),
    membershipStartDate: Yup.date().required('Start date is required'),
    paidFee: Yup.number().required('Paid fee is required'),
    mobileNumber: Yup.string().matches(/^[0-9]{10}$/, 'Enter valid 10-digit number').required(),
    emergencyContactNumber: Yup.string().matches(/^[0-9]{10}$/, 'Enter valid 10-digit number').required()
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      for (let key in values) {
        if (key === 'bodyMeasurements') {
          for (let subKey in values.bodyMeasurements) {
            formData.append(`bodyMeasurements[${subKey}]`, values.bodyMeasurements[subKey]);
          }
        } else if (key === 'photo' && values.photo instanceof File) {
          formData.append('photo', values.photo);
        } else {
          formData.append(key, values[key]);
        }
      }
      formData.append('membershipEndDate', calculateEndDate(values.membershipStartDate, values.membershipDuration));

      if (isEdit) {
        await updateMember(id, formData);
        setSuccess('Member updated successfully!');
      } else {
        await createMember(formData);
        setSuccess('Member registered successfully!');
        resetForm();
      }

      setTimeout(() => {
        setSuccess('');
        navigate('/members');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError('Failed to save member data.');
      setTimeout(() => setError(''), 1000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container my-5">
      <h3 className="mb-4 text-center">{isEdit ? 'Edit Member' : 'Register Member'}</h3>

      {(success || error) && (
        <div style={{ position: 'fixed', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999, minWidth: '300px', textAlign: 'center' }}>
          <Alert variant={success ? 'success' : 'danger'}>{success || error}</Alert>
        </div>
      )}

      <Card>
        <Card.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
              <Form onSubmit={handleSubmit}>
                {[ // Regular fields
                  { label: 'Name', name: 'name', type: 'text' },
                  { label: 'Date of Birth', name: 'dob', type: 'date' },
                  { label: 'Mobile Number', name: 'mobileNumber', type: 'text' },
                  { label: 'Emergency Contact', name: 'emergencyContactNumber', type: 'text' },
                  { label: 'Address', name: 'address', type: 'textarea' },
                  { label: 'Health Conditions', name: 'healthConditions', type: 'textarea' },
                  { label: 'Workout Plan', name: 'workoutPlan', type: 'textarea' },
                  { label: 'Body Weight (kg)', name: 'bodyWeight', type: 'number' },
                  { label: 'Chest (cm)', name: 'bodyMeasurements.chest', type: 'number' },
                  { label: 'Waist (cm)', name: 'bodyMeasurements.waist', type: 'number' },
                  { label: 'Hips (cm)', name: 'bodyMeasurements.hips', type: 'number' },
                  { label: 'Abs (cm)', name: 'bodyMeasurements.abs', type: 'number' },
                  { label: 'Arms (cm)', name: 'bodyMeasurements.arms', type: 'number' },
                  { label: 'Membership Duration (months)', name: 'membershipDuration', type: 'number' },
                  { label: 'Start Date', name: 'membershipStartDate', type: 'date' },
                  { label: 'Paid Fee', name: 'paidFee', type: 'number' },
                  { label: 'Pending Fee', name: 'pendingFee', type: 'number' }
                ].map(({ label, name, type }) => {
                  const value = name.includes('.') ? name.split('.').reduce((obj, key) => obj?.[key] ?? '', values) : values[name];
                  const error = name.includes('.') ? null : errors[name];
                  const touch = name.includes('.') ? null : touched[name];

                  return (
                    <Form.Group className="mb-3 d-flex align-items-center" key={name}>
                      <Form.Label className="me-3" style={{ minWidth: '250px', fontWeight: 'bold' }}>{label} -</Form.Label>
                      {type === 'textarea' ? (
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name={name}
                          value={value}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touch && error}
                        />
                      ) : (
                        <Form.Control
                          type={type}
                          name={name}
                          value={value}
                          onChange={(e) => {
                            if (name.includes('.')) {
                              const [parent, child] = name.split('.');
                              setFieldValue(`${parent}.${child}`, e.target.value);
                            } else {
                              handleChange(e);
                            }
                          }}
                          onBlur={handleBlur}
                          isInvalid={touch && error}
                        />
                      )}
                      {error && touch && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
                    </Form.Group>
                  );
                })}

                {/* File Upload */}
                <Form.Group className="mb-3 d-flex align-items-center">
                  <Form.Label className="me-3" style={{ minWidth: '250px', fontWeight: 'bold' }}>Photo -</Form.Label>
                  <Form.Control
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setFieldValue('photo', e.currentTarget.files[0])}
                  />
                </Form.Group>

                {isEdit && typeof values.photo === 'string' && (
                  <img
                    src={getPhotoUrl(values.photo)}
                    alt="Current"
                    width={100}
                    className="mb-3"
                  />
                )}

                <Form.Group className="mb-3 d-flex align-items-center">
                  <Form.Label className="me-3" style={{ minWidth: '250px', fontWeight: 'bold' }}>End Date -</Form.Label>
                  <Form.Control
                    type="date"
                    value={calculateEndDate(values.membershipStartDate, values.membershipDuration)}
                    readOnly
                    disabled
                  />
                </Form.Group>

                <div className="text-end">
                  <Button variant="secondary" className="me-2" onClick={() => navigate('/members')}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : isEdit ? 'Update Member' : 'Register Member'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  );
};

export default MemberForm;
