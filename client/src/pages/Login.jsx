import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(""); // očisti prethodnu poruku

    try {
      const res = await fetch("http://localhost:5000/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        localStorage.setItem('token', data.token);

        // kratak delay za UX
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setMessage(data.message || "Invalid credentials");
      }
    } catch (err) {
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      {/* Prikaz poruke ispod forme */}
      {message && <p className="message">{message}</p>}

      <p>
        Don't have an account? <Link to="/">Register</Link>
        <br />
        <Link to="/forgot-password">Forgot Password?</Link>
      </p>
    </div>
  );
}
