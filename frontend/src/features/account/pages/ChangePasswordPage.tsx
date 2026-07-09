import { useState, type FormEvent } from "react";
import { Lock, Eye, EyeOff, CheckCircle, ShieldCheck } from "lucide-react";
import { changePassword } from "../../../services/api/auth";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ password: "", confirm_password: "" });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setSubmitting(true);
    try {
      await changePassword(form);
      setSuccess("Password changed successfully.");
      setForm({ password: "", confirm_password: "" });
    } catch {
      setError("Could not change password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <header className="dashboard-header">
        <div>
          <span className="list-breadcrumb">Account › Security</span>
          <h1>Change Password</h1>
          <p>Update your account password securely.</p>
        </div>
      </header>

      <div className="form-card" style={{ maxWidth: 600 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, var(--primary), var(--primary-2))",
              color: "#fff",
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 600 }}>Security Settings</h2>
            <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: 2 }}>
              Choose a strong password you haven't used before.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
          <div className="input-group">
            <label>
              <Lock size={15} />
              New Password
            </label>
            <div className="password-wrap">
              <input
                required
                type={show.password ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="Enter new password"
              />
              <button type="button" className="toggle-password" onClick={() => setShow((p) => ({ ...p, password: !p.password }))} tabIndex={-1}>
                {show.password ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>
              <Lock size={15} />
              Confirm Password
            </label>
            <div className="password-wrap">
              <input
                required
                type={show.confirm ? "text" : "password"}
                value={form.confirm_password}
                onChange={(e) => setForm((p) => ({ ...p, confirm_password: e.target.value }))}
                placeholder="Confirm new password"
              />
              <button type="button" className="toggle-password" onClick={() => setShow((p) => ({ ...p, confirm: !p.confirm }))} tabIndex={-1}>
                {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.78rem", color: "var(--muted)", flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <CheckCircle size={13} color={form.password.length >= 8 ? "var(--success)" : "var(--muted)"} />
              Min 8 chars
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <CheckCircle size={13} color={/[A-Z]/.test(form.password) ? "var(--success)" : "var(--muted)"} />
              Uppercase
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <CheckCircle size={13} color={/[0-9]/.test(form.password) ? "var(--success)" : "var(--muted)"} />
              Number
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <CheckCircle size={13} color={form.password === form.confirm_password && form.password ? "var(--success)" : "var(--muted)"} />
              Match
            </span>
          </div>

          {error ? (
            <p className="form-error" style={{ display: "flex", alignItems: "center", gap: "0.35rem", margin: 0 }}>
              <span style={{ fontWeight: 600 }}>⚠</span> {error}
            </p>
          ) : null}

          {success ? (
            <p className="form-success" style={{ display: "flex", alignItems: "center", gap: "0.35rem", margin: 0 }}>
              <CheckCircle size={16} /> {success}
            </p>
          ) : null}

          <button className="btn-primary form-action-btn" disabled={submitting} type="submit" style={{ marginTop: "0.25rem" }}>
            {submitting ? "Saving..." : "Update Password"}
          </button>
        </form>
      </div>
    </>
  );
}
