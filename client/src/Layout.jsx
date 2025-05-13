import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Nav from './pages/nav';
import Footer from './pages/footer';


const Layout = () => {
  return (
    <div>
      <Nav />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
