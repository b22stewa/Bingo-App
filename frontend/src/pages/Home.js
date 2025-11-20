import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <div className="home-hero">
        <h1>Welcome to Grant Thornton Bingo App</h1>
        <p>Join games, play bingo, and have fun!</p>
        {isAuthenticated ? (
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        ) : (
          <div className="home-actions">
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

