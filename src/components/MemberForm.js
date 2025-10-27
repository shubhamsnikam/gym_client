import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createMember, getMemberById, updateMember } from '../services/api';
import { toast } from 'react-toastify';
import { getPhotoUrl } from '../utils/photoUrl';

const MemberForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const defaultValues = {
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
    bodyMeasurements: { chest: '', waist: '', hips: '', abs: '', arms: '' },
    previousWeights: [],
    mobileNumber: '',
    emergencyContactNumber: '',
    photo: null,
  };

  const [initialValues, setInitialValues] = useState(defaultValues);
  const [previewUrl, setPreviewUrl] = useState('');

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
  };

  const calculateEndDate = (startDate, duration) => {
    if (!startDate || !duration) return '';
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + Number(duration));
    return date.toISOString().split('T')[0];
  };

  const getMembershipStatus = (start, duration) => {
    if (!start || !duration) return 'Unknown';
    const end = new Date(start);
    end.setMonth(end.getMonth() + Number(duration));
    return new Date() > end ? 'Expired' : 'Active';
  };

  const getFeeStatus = (paid, pending) => (pending > 0 ? 'Pending' : 'Paid');

  // Fetch member if editing
  useEffect(() => {
    if (!isEdit) return;

    const fetchMember = async () => {
      try {
        const member = await getMemberById(id);
        const formatted = {
          ...defaultValues,
          ...member,
          dob: formatDate(member.dob),
          membershipStartDate: formatDate(member.membershipStartDate),
          membershipEndDate: formatDate(member.membershipEndDate),
          bodyMeasurements: { ...defaultValues.bodyMeasurements, ...member.bodyMeasurements },
          previousWeights: member.previousWeights || [],
          photo: member.photo ?? null,
        };
        setInitialValues(formatted);
        setPreviewUrl(getPhotoUrl(member.photo));
      } catch (err) {
        console.error('Fetch member error:', err);
        toast.error('❌ Failed to fetch member data.');
      }
    };
    fetchMember();
  }, [id, isEdit]);

  // ✅ Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    address: Yup.string().required('Address is required'),
    dob: Yup.date().required('Date of Birth is required'),
    membershipDuration: Yup.number().required('Membership duration is required'),
    membershipStartDate: Yup.date().required('Start date is required'),
    paidFee: Yup.number().required('Paid fee is required'),
    mobileNumber: Yup.string().matches(/^[0-9]{10}$/, 'Enter valid 10-digit number').required(),
    emergencyContactNumber: Yup.string()
      .matches(/^[0-9]{10}$/, 'Enter valid 10-digit number')
      .required(),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      const cleanedValues = {
        ...values,
        membershipDuration: Number(values.membershipDuration) || 1,
        paidFee: Number(values.paidFee) || 0,
        pendingFee: Number(values.pendingFee) || 0,
      };

      // calculate end date
      const endDate = new Date(cleanedValues.membershipStartDate);
      endDate.setMonth(endDate.getMonth() + Number(cleanedValues.membershipDuration));
      cleanedValues.membershipEndDate = endDate.toISOString();

      Object.entries(cleanedValues).forEach(([key, value]) => {
        if (key === 'photo' && value instanceof File) formData.append('photo', value);
        else if (typeof value === 'object' && value !== null)
          formData.append(key, JSON.stringify(value));
        else formData.append(key, value);
      });

      if (isEdit) {
        await updateMember(id, formData);
        toast.success('✅ Member updated successfully!');
      } else {
        await createMember(formData);
        toast.success('✅ Member registered successfully!');
      }

      resetForm();
      setTimeout(() => navigate('/members'), 1500);
    } catch (err) {
      console.error('Error saving member:', err.response?.data || err.message);
      toast.error(err?.response?.data?.message || '❌ Failed to save member data.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container my-5">
      <h3 className="mb-4 text-center text-primary">
        {isEdit ? 'Edit Member' : 'Register Member'}
      </h3>

      <Card className="shadow-lg rounded-4 border-0 bg-light">
        <Card.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
              <Form onSubmit={handleSubmit}>
                {/* Personal Info */}
                <h5 className="mb-3 text-dark">Personal Information</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.name && errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        name="dob"
                        value={values.dob}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.dob && errors.dob}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.dob}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Mobile Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="mobileNumber"
                        value={values.mobileNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.mobileNumber && errors.mobileNumber}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.mobileNumber}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Emergency Contact</Form.Label>
                      <Form.Control
                        type="text"
                        name="emergencyContactNumber"
                        value={values.emergencyContactNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.emergencyContactNumber && errors.emergencyContactNumber}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.emergencyContactNumber}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.address && errors.address}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Health Conditions</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="healthConditions"
                    value={values.healthConditions}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Membership Duration Dropdown */}
                <h5 className="mt-4 mb-3 text-dark">Membership & Fees</h5>
                <Row className="align-items-center mb-3">
                  <Col md={3}>
                    <Badge
                      bg={
                        getMembershipStatus(values.membershipStartDate, values.membershipDuration) ===
                        'Active'
                          ? 'success'
                          : 'danger'
                      }
                      className="p-2 fs-6"
                    >
                      {getMembershipStatus(values.membershipStartDate, values.membershipDuration)}
                    </Badge>
                  </Col>
                  <Col md={3}>
                    <Badge
                      bg={
                        getFeeStatus(values.paidFee, values.pendingFee) === 'Paid'
                          ? 'primary'
                          : 'warning'
                      }
                      className="p-2 fs-6 text-dark"
                    >
                      {getFeeStatus(values.paidFee, values.pendingFee)}
                    </Badge>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Membership Duration (months)</Form.Label>
                      <Form.Select
                        name="membershipDuration"
                        value={values.membershipDuration}
                        onChange={handleChange}
                      >
                        {[...Array(12).keys()].map((m) => (
                          <option key={m + 1} value={m + 1}>
                            {m + 1} month{m + 1 > 1 ? 's' : ''}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="membershipStartDate"
                        value={values.membershipStartDate}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={calculateEndDate(values.membershipStartDate, values.membershipDuration)}
                        readOnly
                        disabled
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Fees, Workout Plan, and Photo unchanged */}
                {/* ... (keep rest of your existing fields) ... */}

                <div className="text-end mt-3">
                  <Button variant="secondary" className="me-2" onClick={() => navigate('/members')}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? 'Saving...'
                      : isEdit
                      ? 'Update Member'
                      : 'Register Member'}
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
