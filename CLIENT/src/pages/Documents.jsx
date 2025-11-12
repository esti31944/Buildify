import React from "react";
import Card from "../components/Card";
import { useSelector } from "react-redux";

export default function Documents() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div>
      <h1>חדרים ומשאבים / מסמכים</h1>

      <div style={{ marginTop:12, display:"grid", gap:12 }}>
        <Card title="חדר כושר" subtitle="שעות פתיחה: 08:00-22:00">
          <div>הזמן שימוש בחדר כושר דרך לוח הזמנים.</div>
        </Card>

        <Card title="מסמכי ועד">
          <ul>
            <li>דוח כספי שנת 2024 - קובץ PDF</li>
            <li>תקנון שימוש במעלית - קובץ PDF</li>
          </ul>
          {user.role === "admin" && <button className="btn btn-primary" style={{ marginTop:8 }}>העלה מסמך</button>}
        </Card>
      </div>
    </div>
  );
}
