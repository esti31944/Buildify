import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [role, setRole] = useState("tenant"); // אפשר לבחור ב-demo בין tenant/admin

  const handle = (e) => {
    e.preventDefault();
    // דמו: מאפס/מכניס user ל־localStorage; החליפי בחיבור ל-API אמיתי
    const demoUser = { fullName: email || "משתמש דמו", email, role };
    login(demoUser);
    navigate("/", { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 style={{ marginBottom:8 }}>התחברות</h2>
        <form onSubmit={handle}>
          <div className="form-group">
            <label>אימייל</label>
            <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>סיסמה</label>
            <input className="input" type="password" value={pw} onChange={e=>setPw(e.target.value)} />
          </div>

          <div className="form-group">
            <label>התחבר כ־</label>
            <select className="input" value={role} onChange={e=>setRole(e.target.value)}>
              <option value="tenant">דייר</option>
              <option value="admin">מנהל ועד</option>
            </select>
          </div>

          <div style={{ display:"flex", gap:10 }}>
            <button className="btn btn-primary" type="submit">התחבר</button>
            <button type="button" className="btn btn-ghost" onClick={()=>navigate("/register")}>הרשם</button>
          </div>
        </form>
      </div>
    </div>
  );
}
