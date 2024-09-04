import React from "react";
import Link from "next/link";
import RankIcon from "./icons/RankIcon";


const footerStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 0,
  width: "100%",
  display: "flex",
  justifyContent: "space-around",
  backgroundColor: "#f8f8f8",
  padding: "10px 0",
  borderTop: "1px solid #ddd",
};

const linkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#000",
};

const iconContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const iconStyle: React.CSSProperties = {
  fontSize: "24px",
};

const textStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "12px",
};

const Footer: React.FC = () => {
  return (
    <footer style={footerStyle}>
      <Link href="/ranking" style={linkStyle}>
        <div style={iconContainerStyle}>
          <span style={iconStyle}><RankIcon/></span>
          <p style={textStyle}>Ranking</p>
        </div>
      </Link>
      <Link href="/portfolio" style={linkStyle}>
        <div style={iconContainerStyle}>
          <span style={iconStyle}>🛡️</span>
          <p style={textStyle}>Portfolio</p>
        </div>
      </Link>
      <Link href="/market" style={linkStyle}>
        <div style={iconContainerStyle}>
          <span style={iconStyle}>🏪</span>
          <p style={textStyle}>Market</p>
        </div>
      </Link>
      <Link href="/tournament" style={linkStyle}>
        <div style={iconContainerStyle}>
          <span style={iconStyle}>🏆</span>
          <p style={textStyle}>Tournament</p>
        </div>
      </Link>
    </footer>
  );
};

export default Footer;
