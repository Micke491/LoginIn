import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // očisti prethodnu poruku

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/SignUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
        <button type="submit">Sign Up</button>
      </form>

      {/* Dodato za prikaz poruka */}
      {message && <p className="message">{message}</p>}

      <p>
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
}
