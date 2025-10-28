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
import { motion } from "framer-motion";

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

  const formatCurrency = (num) =>
    num?.toLocaleString("en-IN", { maximumFractionDigits: 0 }) || 0;

  if (loading)
    return (
      <div className="text-center my-5 text-light">
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
        background: "linear-gradient(135deg, #121212 0%, #1c1c1c 100%)",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold text-light">
          🏋️‍♂️ Sai Fitness Gym Dashboard
        </h2>
        <Button variant="outline-light" size="sm" onClick={fetchStats}>
          ↻ Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        {[
          {
            label: "Total Members",
            value: stats.totalMembers,
            color: "linear-gradient(45deg, #00c6ff, #0072ff)",
          },
          {
            label: "Active Members",
            value: stats.activeMembers,
            color: "linear-gradient(45deg, #43e97b, #38f9d7)",
          },
          {
            label: "Expired Members",
            value: stats.expiredMembers,
            color: "linear-gradient(45deg, #ff416c, #ff4b2b)",
          },
          {
            label: "Pending Fees",
            value: "₹" + formatCurrency(stats.pendingFees),
            color: "linear-gradient(45deg, #f7971e, #ffd200)",
          },
        ].map((card, i) => (
          <Col md={3} key={i}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                className="text-center text-light border-0 shadow-lg"
                style={{
                  background: card.color,
                  borderRadius: "16px",
                  height: "120px",
                }}
              >
                <Card.Body>
                  <h6 className="fw-semibold">{card.label}</h6>
                  <h2 className="fw-bold mt-2">
                    <CountUp end={parseFloat(card.value) || 0} duration={2} />
                  </h2>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card
              className="text-center border-0 shadow-lg"
              style={{
                background: "linear-gradient(135deg, #007adf, #00ecbc)",
                borderRadius: "16px",
              }}
            >
              <Card.Body>
                <h6 className="fw-semibold text-light">Total Revenue</h6>
                <h2 className="fw-bold text-light mt-2">
                  ₹
                  <CountUp end={stats.totalRevenue} duration={2} separator="," />
                </h2>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>

        <Col md={6}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card
              className="shadow-lg border-0"
              style={{
                background: "#1e1e1e",
                color: "#fff",
                borderRadius: "16px",
              }}
            >
              <Card.Body>
                <h6 className="fw-semibold mb-3 text-light">
                  📅 Monthly Registrations (Last 6 Months)
                </h6>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stats.monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#ccc" />
                    <YAxis stroke="#ccc" allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#222",
                        border: "none",
                        color: "#fff",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="url(#colorGradient)"
                      radius={[6, 6, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00c6ff" stopOpacity={1} />
                        <stop offset="100%" stopColor="#0072ff" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
