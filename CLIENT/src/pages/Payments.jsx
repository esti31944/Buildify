import React from "react";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";

export default function Payments() {
  const { user } = useAuth();

  if (user.role === "admin") {
    return (
      <div>
        <h1>ניהול תשלומים - מנהל</h1>
        <div style={{ marginTop:12 }}>
          <Card title="תשלומים אחרונים">
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr><th>דייר</th><th>חודש</th><th>סכום</th><th>סטטוס</th></tr></thead>
              <tbody>
                <tr><td>רות כהן</td><td>2025-10</td><td>850 ₪</td><td>שולם</td></tr>
                <tr><td>דני לוי</td><td>2025-10</td><td>850 ₪</td><td>לא שולם</td></tr>
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>התשלומים שלי</h1>
      <div style={{ marginTop:12 }}>
        <Card title="היסטוריית תשלומים">
          <div>2025-10 • 850 ₪ • שולם</div>
          <div style={{ marginTop:8 }}>2025-09 • 850 ₪ • שולם</div>
        </Card>
      </div>
    </div>
  );
}
