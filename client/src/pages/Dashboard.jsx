import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="form-container">
      <h2>Dobrodošao na Dashboard 👋</h2>
      <button onClick={logout}>Odjavi se</button>
    </div>
  );
}
