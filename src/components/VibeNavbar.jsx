import React from 'react';
import { Navbar, NavTitle, NavLeft, NavRight, Link } from 'framework7-react';

const VibeNavbar = () => {
  return (
    <Navbar className="vibe-navbar">
      <NavLeft>
        <Link iconF7="menu" panelOpen="left" className="navbar-hamburger-btn" />
      </NavLeft>
      <NavTitle>
        <img src="/logo.png" className="navbar-logo" alt="Vibe Logo" />
      </NavTitle>
      <NavRight>
        <Link iconF7="person_circle" panelOpen="right" className="navbar-profile-btn" />
      </NavRight>
    </Navbar>
  );
};

export default VibeNavbar;
