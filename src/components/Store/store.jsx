import { configureStore } from '@reduxjs/toolkit';
// import { loadingBarReducer } from 'react-redux-loading-bar';
import authReducer from '../Reducers/AuthReducer.jsx';
import threadReducer from '../Reducers/ThreadReducer.jsx';
import commentReducer from '../Reducers/CommentReducer.jsx';
import leaderboardReducer from '../Reducers/LeaderboardReducer.jsx';
import userReducer from '../Reducers/usersReducer';

const checkAuthStatus = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { isAuthenticated: true, token } : { isAuthenticated: false, token: null };
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    thread: threadReducer,
    comment: commentReducer,
    leaderboard: leaderboardReducer,
    users: userReducer,
    // loadingBar: loadingBarReducer,
  },
  preloadedState: {
    auth: checkAuthStatus(),
  },
});

export default store;
