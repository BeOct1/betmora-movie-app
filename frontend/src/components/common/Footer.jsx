import React from "react";

const Footer = () => (
  <footer
    style={{
      background: "#1a223f",
      color: "#fff",
      textAlign: "center",
      padding: "1rem 0",
      marginTop: "2rem",
      fontSize: "0.95rem",
    }}
  >
    &copy; {new Date().getFullYear()} BeMora|Movie App. All rights reserved.
  </footer>
);

export default Footer;
