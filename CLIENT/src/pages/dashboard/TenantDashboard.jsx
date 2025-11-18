import React from "react";
import Card from "../../components/Card";

export default function TenantDashboard() {
  return (
    <div>
      <h1 style={{ marginBottom:12 }}>ברוך הבא/ה, דייר</h1>

      <div className="cards-row">
        <Card title="תשלומים שלי" subtitle="יתרה: 1,250 ₪">
          <div>תשלום אחרון: 2025-10 • סכום: 850 ₪</div>
        </Card>

        <Card title="תקלות שדווחו" subtitle="תקלה אחרונה: מעלית">
          <div>3 תקלות בדיווח שלי (1 פתוחה, 2 מטופלות)</div>
        </Card>

        <Card title="חדרים משותפים" subtitle="הזמנה קרובה">
          <div>חדר אירועים • 2025-11-07 • 18:00-20:00</div>
        </Card>
      </div>

      <section style={{ marginTop:20 }}>
        <h2>התראות אחרונות</h2>
        <div style={{ display:"grid", gap:12, gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", marginTop:10 }}>
          <div className="card"><strong>הודעה:</strong> יש כיבוי מים מתוכנן ביום ראשון</div>
          <div className="card"><strong>תחזוקה:</strong> בריכה סגורה לתחזוקה בשעה 09:00</div>
        </div>
      </section>
    </div>
  );
}
