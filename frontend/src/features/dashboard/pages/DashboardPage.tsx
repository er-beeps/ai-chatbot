import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Users,
  Activity,
  Clock,
  Bot,
  User,
  Settings,
  FileText,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const initial = (user?.username ?? "U").charAt(0).toUpperCase();

  return (
    <>
      <header className="dashboard-header">
        <div>
          <span className="dash-welcome">Welcome back,</span>
          <h1 style={{ fontSize: "1.4rem" }}>{user?.username ?? "User"}</h1>
          <p>Here's what's happening with your workspace today.</p>
        </div>
      </header>

      <motion.div className="dash-stats" variants={container} initial="hidden" animate="show">
        <motion.div className="dash-stat-card" variants={item}>
          <div className="dash-stat-icon" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            <MessageSquare size={22} />
          </div>
          <div className="dash-stat-body">
            <span className="dash-stat-value">128</span>
            <span className="dash-stat-label">Total Conversations</span>
          </div>
        </motion.div>
        <motion.div className="dash-stat-card" variants={item}>
          <div className="dash-stat-icon" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
            <Activity size={22} />
          </div>
          <div className="dash-stat-body">
            <span className="dash-stat-value">12</span>
            <span className="dash-stat-label">Active Today</span>
          </div>
        </motion.div>
        <motion.div className="dash-stat-card" variants={item}>
          <div className="dash-stat-icon" style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)" }}>
            <Users size={22} />
          </div>
          <div className="dash-stat-body">
            <span className="dash-stat-value">6</span>
            <span className="dash-stat-label">Team Members</span>
          </div>
        </motion.div>
        <motion.div className="dash-stat-card" variants={item}>
          <div className="dash-stat-icon" style={{ background: "linear-gradient(135deg, #ec4899, #d946ef)" }}>
            <Clock size={22} />
          </div>
          <div className="dash-stat-body">
            <span className="dash-stat-value">99.9%</span>
            <span className="dash-stat-label">Uptime</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div className="dash-widgets" variants={container} initial="hidden" animate="show">
        <motion.div className="dash-widget" variants={item}>
          <h3><Bot size={15} /> Quick Actions</h3>
          <div className="dash-quick-link" onClick={() => navigate("/profile")}>
            <div className="dash-quick-link-icon" style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>
              <User size={16} />
            </div>
            View Profile
          </div>
          <div className="dash-quick-link" onClick={() => navigate("/change-password")}>
            <div className="dash-quick-link-icon" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
              <Settings size={16} />
            </div>
            Security Settings
          </div>
          <div className="dash-quick-link">
            <div className="dash-quick-link-icon" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
              <FileText size={16} />
            </div>
            View Documentation
          </div>
        </motion.div>

        <motion.div className="dash-widget" variants={item}>
          <h3><Activity size={15} /> Recent Activity</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", flexShrink: 0 }} />
              <span style={{ color: "var(--muted)", flexShrink: 0 }}>2m ago</span>
              <span style={{ color: "var(--text)" }}>Logged in successfully</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", flexShrink: 0 }} />
              <span style={{ color: "var(--muted)", flexShrink: 0 }}>1h ago</span>
              <span style={{ color: "var(--text)" }}>Chat session completed</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", flexShrink: 0 }} />
              <span style={{ color: "var(--muted)", flexShrink: 0 }}>3h ago</span>
              <span style={{ color: "var(--text)" }}>Profile updated</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
