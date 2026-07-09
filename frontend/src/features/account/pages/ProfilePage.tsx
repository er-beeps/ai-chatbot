import { useNavigate } from "react-router-dom";
import { User, Mail, Shield, Edit3, Lock, Fingerprint } from "lucide-react";
import useAuth from "../../../hooks/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const initial = (user?.username ?? "U").charAt(0).toUpperCase();
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.username;

  return (
    <>
      <header className="dashboard-header">
        <div>
          <span className="list-breadcrumb">Account › Profile</span>
          <h1>User Profile</h1>
          <p>Review your current account information.</p>
        </div>
        <div className="master-actions">
          <button className="btn-secondary" onClick={() => navigate("/account/change-password")} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <Lock size={15} />
            Security
          </button>
          <button className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <Edit3 size={15} />
            Edit Profile
          </button>
        </div>
      </header>

      <div className="profile-wrap">
        <div className="profile-header-card">
          <div className="profile-avatar">{initial}</div>
          <div className="profile-header-info">
            <h2>{fullName}</h2>
            <p>@{user?.username}</p>
          </div>
          <div className="profile-role-badge">{user?.role ?? "User"}</div>
        </div>

        <div className="profile-details-card">
          <h3><User size={14} /> Account Details</h3>
          <div className="profile-details-grid">
            <div className="profile-field">
              <label><User size={12} /> Username</label>
              <span>{user?.username ?? "-"}</span>
            </div>
            <div className="profile-field">
              <label><Mail size={12} /> Email</label>
              <span>{user?.email ?? "-"}</span>
            </div>
            <div className="profile-field">
              <label><Shield size={12} /> Role</label>
              <span className="profile-role-badge" style={{ marginTop: 2 }}>{user?.role ?? "User"}</span>
            </div>
            <div className="profile-field">
              <label><Fingerprint size={12} /> User ID</label>
              <span>#{user?.id ?? "-"}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
