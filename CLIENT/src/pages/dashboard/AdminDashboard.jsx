import React from "react";
import Card from "../../components/Card";

export default function AdminDashboard() {
  return (
    <div>
      <h1 style={{ marginBottom:12 }}>לוח ניהול - מנהל ועד</h1>

      <div className="cards-row">
        <Card title="דיירים" subtitle="סה״כ דיירים: 24">ניהול דיירים, יצירת חשבונות.</Card>
        <Card title="תקלות פתוחות" subtitle="3 תקלות פתוחות">הקצאת מטפלים ושינוי סטטוס.</Card>
        <Card title="הזמנות היום" subtitle="2 הזמנות פעולות">אישור/ביטול הזמנות חדרים.</Card>
      </div>

      <section style={{ marginTop:20 }}>
        <h2>תקלות אחרונות</h2>
        <div style={{ display:"grid", gap:12, gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", marginTop:10 }}>
          <div className="card">מעלית - קומה 3 • חדש</div>
          <div className="card">בריכה - תחזוקה מתוזמנת</div>
        </div>
      </section>
    </div>
  );
}
