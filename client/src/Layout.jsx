import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Nav from './pages/nav';
import Footer from './pages/footer';
import { Store } from 'lucide-react';

const Layout = () => {
  return (
    <div>
      {/* <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/store">Store</Link></li>
        </ul>
      </nav> */}
        <Nav />
        {/* <Store /> */}
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
