/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchLeaderboard } from '../Actions/LeaderboardAction.jsx';

function LeaderboardList() {
  const leaderboardData = useSelector((state) => state.leaderboard.leaderboardData);
  const isLoading = useSelector((state) => state.leaderboard.loading);
  const error = useSelector((state) => state.leaderboard.error);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      dispatch(fetchLeaderboard());
    }
  }, [dispatch, isAuthenticated, navigate]);

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      {isLoading ? (
        <div className="custom-loader"></div>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <ul className="leaderboard-list">
          {leaderboardData.map((item, index) => (
            <li key={index} className="leaderboard-item">
              <div className="user-info">
                <div className="avatar-wrapper">
                  <img src={item.user.avatar} alt={item.user.name} className="user-avatar" />
                </div>
                <p className="user-name">{item.user.name}</p>
              </div>
              <div className="score-info">
                <p className="user-score">{item.score}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LeaderboardList;
