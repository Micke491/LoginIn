import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/reset-password/${token}`, { password });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.message || "Something went wrong."));
    }
  };

  return (
    <div className="form-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="Enter your new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && (
        <p className="message">{message}</p>
      )}
      <p>
        <a href="/login">Back to Login</a>
      </p>
    </div>
  );
}