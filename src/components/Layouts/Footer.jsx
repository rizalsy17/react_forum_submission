/* eslint-disable max-len */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import Link dan useNavigate
import { faComments, faTrophy, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  if (location.pathname === '/login') {
    return (
      <footer className="footer-container">
        <nav className="footer-nav">
          <ul>
            <li><Link to="/"><FontAwesomeIcon icon={faComments} /> Threads</Link></li>
            <li><Link to="/leaderboard"><FontAwesomeIcon icon={faTrophy} /> Leaderboard</Link></li>
          </ul>
        </nav>
      </footer>
    );
  }

  return (
    <footer className="footer-container">
      <nav className="footer-nav">
        <ul>
          <li><Link to="/"><FontAwesomeIcon icon={faComments} /> Threads</Link></li> {/* Menggunakan Link */}
          <li><Link to="/leaderboard"><FontAwesomeIcon icon={faTrophy} /> Leaderboard</Link></li> {/* Menggunakan Link */}
          <li><button onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} /> Logout</button></li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
