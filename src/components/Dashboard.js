import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-toastify";
import CountUp from "react-countup";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard - Sai Fitness Gym";
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${
          process.env.REACT_APP_BACKEND_URL ||
          "https://gym-server-1-nqw8.onrender.com"
        }/api/members/stats/dashboard`
      );
      setStats(res.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      toast.error("❌ Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" /> Loading Dashboard...
      </div>
    );

  if (!stats)
    return (
      <p className="text-center text-danger mt-5">
        No dashboard data available.
      </p>
    );

  return (
    <div
      className="container-fluid py-5"
      style={{
        background: "#f7f8fa",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">
          🏋️‍♀️ Sai Fitness Analytics Dashboard
        </h2>
        <Button variant="primary" onClick={fetchStats}>
          ↻ Refresh
        </Button>
      </div>

      {/* Top Stats Cards */}
      <Row className="g-4 mb-4 justify-content-center">
        {[
          {
            label: "Total Members",
            value: stats.totalMembers,
            color: "#007bff",
            shadow: "rgba(0,123,255,0.25)",
          },
          {
            label: "Active Members",
            value: stats.activeMembers,
            color: "#28a745",
            shadow: "rgba(40,167,69,0.25)",
          },
          {
            label: "Expired Members",
            value: stats.expiredMembers,
            color: "#dc3545",
            shadow: "rgba(220,53,69,0.25)",
          },
        ].map((card, i) => (
          <Col md={4} sm={6} key={i}>
            <Card
              className="text-center border-0 shadow-sm h-100"
              style={{
                borderRadius: "16px",
                backgroundColor: "white",
                boxShadow: `0 4px 15px ${card.shadow}`,
                transition: "transform 0.25s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-6px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <Card.Body className="py-4">
                <h6 className="fw-semibold text-secondary">{card.label}</h6>
                <h2
                  className="fw-bold mt-2"
                  style={{ color: card.color, fontSize: "2.3rem" }}
                >
                  <CountUp
                    end={parseFloat(card.value) || 0}
                    duration={1.5}
                    separator=","
                  />
                </h2>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Chart + Revenue Section */}
      <Row className="g-4">
        <Col md={6}>
          <Card
            className="border-0 shadow-sm text-center h-100"
            style={{
              borderRadius: "16px",
              background: "linear-gradient(135deg, #007bff, #00b4d8)",
              color: "white",
            }}
          >
            <Card.Body className="py-5">
              <h5 className="fw-semibold mb-2">💰 Total Revenue</h5>
              <h1 className="fw-bold mt-3">
                ₹
                <CountUp
                  end={stats.totalRevenue}
                  duration={2}
                  separator=","
                />
              </h1>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card
            className="border-0 shadow-sm h-100"
            style={{
              borderRadius: "16px",
              background: "white",
            }}
          >
            <Card.Body>
              <h6 className="fw-semibold mb-3 text-dark">
                📆 Monthly Registrations (Last 6 Months)
              </h6>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" stroke="#555" />
                  <YAxis stroke="#555" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255,255,255,0.95)",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#007bff"
                    radius={[8, 8, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Footer */}
      <div className="text-center text-muted mt-5 small">
        <p>© {new Date().getFullYear()} Sai Fitness Gym</p>
      </div>
    </div>
  );
};

export default Dashboard;
