import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bot, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import PageMotion from "../../../components/ui/PageMotion";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/login", { replace: true });
    } catch {
      setError("Registration failed. Please verify details and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleGoogleSignIn() {
    setError("Google sign-in is not yet configured.");
  }

  return (
    <PageMotion>
      <main className="auth-page">
        <div className="auth-split">
          <div className="auth-brand">
            <div className="brand-content">
              <div className="brand-logo-large">
                <Bot size={44} />
              </div>
              <h1>AI Chatbot</h1>
              <p>Enterprise-grade conversational AI platform built for intelligent customer engagement and automated support.</p>
            </div>
          </div>
          <div className="auth-panel">
            <div className="auth-card-modern">
              <div className="auth-header">
                <h1>Create account</h1>
                <p>Set up admin access for your enterprise panel.</p>
              </div>

              <button className="social-btn google" onClick={handleGoogleSignIn} type="button">
                <GoogleIcon />
                Sign up with Google
              </button>

              <div className="divider">
                <span>or continue with</span>
              </div>

              <form className="form-grid" onSubmit={handleSubmit}>
                <div className="input-group">
                  <label>
                    <User size={16} />
                    Username
                  </label>
                  <input
                    required
                    value={form.username}
                    onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                    placeholder="janedoe"
                  />
                </div>
                <div className="input-group">
                  <label>
                    <Mail size={16} />
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="input-group">
                  <label>
                    <Lock size={16} />
                    Password
                  </label>
                  <div className="password-wrap">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                      placeholder="Create a strong password"
                    />
                    <button type="button" className="toggle-password" onClick={() => setShowPassword((p) => !p)} tabIndex={-1}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                {error ? <p className="form-error">{error}</p> : null}
                <button className="btn-primary" disabled={submitting} type="submit">
                  {submitting ? "Creating..." : "Create account"}
                </button>
              </form>

              <p className="auth-switch">
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </PageMotion>
  );
}
