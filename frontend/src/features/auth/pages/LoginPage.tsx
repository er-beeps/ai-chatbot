import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bot, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import useAuth from "../../../hooks/useAuth";
import PageMotion from "../../../components/ui/PageMotion";

export default function LoginPage() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectPath =  "/dashboard";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form);
      navigate(redirectPath, { replace: true });
    } catch {
      setError("Login failed. Check your credentials and try again.");
    } finally {
      setSubmitting(false);
    }
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
                <h1>Welcome back</h1>
                <p>Sign in to your account to continue.</p>
              </div>
              <form className="form-grid" onSubmit={handleSubmit}>
                <div className="input-group">
                  <label>
                    <Mail size={16} />
                    Username
                  </label>
                  <input
                    required
                    value={form.username}
                    onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                    placeholder="Enter your username"
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
                      placeholder="Enter your password"
                    />
                    <button type="button" className="toggle-password" onClick={() => setShowPassword((p) => !p)} tabIndex={-1}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="form-options">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Remember me</span>
                  </label>
                  <Link to="/forgot-password">Forgot password?</Link>
                </div>
                {error ? <p className="form-error">{error}</p> : null}
                <button className="btn-primary" disabled={submitting} type="submit">
                  {submitting ? "Signing in..." : "Sign in"}
                </button>
              </form>
              <p className="auth-switch">
                Don't have an account? <Link to="/register">Sign up</Link>
              </p>

              <div className="divider">
                <span>or continue with</span>
              </div>

              <GoogleLogin
                theme="outline"
                size="large"
                shape="pill"
                width="100%"
                text="signin_with"
                onSuccess={async (credentialResponse) => {
                  if (!credentialResponse.credential) return;
                  try {
                    await googleLogin(credentialResponse.credential);
                    navigate(redirectPath, { replace: true });
                  } catch {
                    setError("Google sign-in failed. Please try again.");
                  }
                }}
                onError={() => setError("Google sign-in failed. Please try again.")}
              />
            </div>
          </div>
        </div>
      </main>
    </PageMotion>
  );
}
