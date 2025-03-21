// Layout.js
import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './footer'

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      
      <main>{children}</main>
      
      <footer className="footer">
        <Footer/>
      </footer>
    </div>
  );
};

export default Layout;
