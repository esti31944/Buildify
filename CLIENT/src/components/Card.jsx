import React from "react";

export default function Card({ title, subtitle, children }) {
  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h3 className="card-title">{title}</h3>
          {subtitle && <p className="card-sub">{subtitle}</p>}
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        {children}
      </div>
    </div>
  );
}
