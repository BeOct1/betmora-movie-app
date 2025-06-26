import React from "react";

const Splash = () => (
  <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "80vh",
    background: "#fff"
  }}>
    <img src="/logo512.png" alt="BeMora Logo" style={{ width: 128, height: 128, marginBottom: 24 }} />
    <h1 style={{ color: "#1a223f", fontSize: "2.2rem", margin: 0 }}>BeMora|Movie App</h1>
    <p style={{ color: "#444", fontSize: "1.1rem", marginTop: 12 }}>A modern, full-featured movie recommendation platform.</p>
  </div>
);

export default Splash;
