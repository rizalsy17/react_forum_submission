/* eslint-disable import/order */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Layouts/Footer.jsx'; // Add .js extension
import RegisterForm from './components/Auth/RegisterForm.jsx'; // Add .js extension
import LoginForm from './components/Auth/LoginForm.jsx'; // Add .js extension
import ThreadList from './components/Threads/ThreadList.jsx'; // Add .js extension
import ThreadDetail from './components/Threads/ThreadDetail.jsx'; // Add .js extension
import CreateThreadForm from './components/Threads/CreateThreadForm.jsx'; // Add .js extension
import LeaderboardList from './components/Leaderboard/LeaderboardList.jsx'; // Add .js extension
// import LoadingBar from 'react-redux-loading-bar';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<ThreadList />} />
          <Route path="/threads/:threadId" element={<ThreadDetail />} />
          <Route path="/create-thread" element={<CreateThreadForm />} />
          <Route path="/leaderboard" element={<LeaderboardList />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
