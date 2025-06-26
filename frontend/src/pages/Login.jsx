import React, { useState } from "react";
import userApi from "../api/modules/user.api";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "react-google-login";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { response, err } = await userApi.signin({
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (response) {
      navigate("/profile");
    } else {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleSuccess = async (response) => {
    setLoading(true);
    setError("");
    const { response: res, err } = await userApi.googleLogin(response.tokenId);
    setLoading(false);
    if (res) {
      navigate("/profile");
    } else {
      setError(err?.response?.data?.message || "Google login failed");
    }
  };

  const handleGoogleFailure = (error) => {
    setError("Google login failed");
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ paddingRight: '2.5rem' }}
          />
          <button
            type="button"
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#888',
              fontSize: '1rem',
            }}
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
      <div className="google-login">
        <GoogleLogin
          clientId={GOOGLE_CLIENT_ID}
          buttonText="Sign in with Google"
          onSuccess={handleGoogleSuccess}
          onFailure={handleGoogleFailure}
          cookiePolicy={'single_host_origin'}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default Login;
