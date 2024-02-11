import React from 'react';
import { Link, Outlet } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { currentUser, logout } = useAuth();

  return (
    <>
      <nav className="navbar">
        <ul className="nav-list">
          <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
          {currentUser && (
            <>
              <li className="nav-item"><Link to="/posts" className="nav-link">View Posts</Link></li>
              <li className="nav-item"><Link to="/create-post" className="nav-link">Create Post</Link></li>
              <li className="nav-item"><button onClick={() => logout()}>Logout</button></li>
            </>
          )}
          {!currentUser && (
            <>
              <li className="nav-item"><Link to="/login" className="nav-link">Login</Link></li>
              <li className="nav-item"><Link to="/signup" className="nav-link">Signup</Link></li>
            </>
          )}
        </ul>
      </nav>
      <Outlet /> {/* This line is crucial for rendering child components */}
    </>
  );
};

export default Layout;

