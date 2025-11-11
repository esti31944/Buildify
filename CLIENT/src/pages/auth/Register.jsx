import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [apartment, setApartment] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  const handle = (e) => {
    e.preventDefault();
    // דמו: שלחי ל־backend; כאן נחזיר ל-login
    alert("בקשת רישום נשלחה למנהל הוועד (דמו).");
    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 style={{ marginBottom:8 }}>הרשמה</h2>
        <form onSubmit={handle}>
          <div className="form-group">
            <label>שם מלא</label>
            <input className="input" value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>דירה</label>
            <input className="input" value={apartment} onChange={e=>setApartment(e.target.value)} />
          </div>
          <div className="form-group">
            <label>אימייל</label>
            <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>סיסמה</label>
            <input className="input" type="password" value={pw} onChange={e=>setPw(e.target.value)} />
          </div>

          <div style={{ display:"flex", gap:10 }}>
            <button className="btn btn-primary" type="submit">שלח בקשה</button>
            <button type="button" className="btn btn-ghost" onClick={()=>navigate("/login")}>חזור</button>
          </div>
        </form>
      </div>
    </div>
  );
}
