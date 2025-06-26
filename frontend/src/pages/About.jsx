import React from "react";

const About = () => (
  <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "80vh",
    background: "#fff"
  }}>
    <img src="/logo512.png" alt="BeMora Logo" style={{ width: 96, height: 96, marginBottom: 20 }} />
    <h2 style={{ color: "#1a223f", margin: 0 }}>About BeMora|Movie App</h2>
    <p style={{ color: "#444", maxWidth: 500, textAlign: "center", marginTop: 16 }}>
      BeMora|Movie App is a modern, full-featured movie recommendation platform. Discover trending movies, manage your favorites and watchlist, write reviews, and get personalized recommendations. Enjoy a clean, responsive UI and advanced features like social login, PWA support, and more!
    </p>
  </div>
);

export default About;
