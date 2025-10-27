import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/members/stats/dashboard`);
        setStats(res.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        toast.error('❌ Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center my-5"><Spinner animation="border" /> Loading...</div>;
  if (!stats) return <p className="text-center text-danger mt-5">No data available</p>;

  return (
    <div className="container my-5">
      <h3 className="text-center mb-4 text-primary">🏋️‍♂️ Gym Dashboard</h3>

      {/* Summary Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="shadow-sm text-center border-primary">
            <Card.Body>
              <h6>Total Members</h6>
              <h3 className="text-primary">{stats.totalMembers}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm text-center border-success">
            <Card.Body>
              <h6>Active Members</h6>
              <h3 className="text-success">{stats.activeMembers}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm text-center border-danger">
            <Card.Body>
              <h6>Expired Members</h6>
              <h3 className="text-danger">{stats.expiredMembers}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm text-center border-warning">
            <Card.Body>
              <h6>Pending Fees</h6>
              <h3 className="text-warning">₹{stats.pendingFees}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <Card className="shadow-sm border-info">
            <Card.Body>
              <h6>Total Revenue</h6>
              <h2 className="text-info">₹{stats.totalRevenue}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm border-dark">
            <Card.Body>
              <h6>Monthly Registrations (Last 6 Months)</h6>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#007bff" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
