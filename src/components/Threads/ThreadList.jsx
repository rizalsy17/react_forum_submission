import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThumbsUp,
  faThumbsDown,
  faComment,
  faPlus,
  faUndo,
} from '@fortawesome/free-solid-svg-icons';
import parse from 'html-react-parser';
import {
  fetchThreads,
  voteUpThread,
  voteDownThread,
  neutralizeThreadVote,
} from '../Actions/ThreadAction.jsx';
import { asyncGetAllUser } from '../Actions/usersAction';

function ThreadList() {
  const threads = useSelector((state) => state.thread.threads);
  const isLoading = useSelector((state) => state.thread.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [allCategories, setAllCategories] = useState([]);
  const [userVotes, setUserVotes] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchThreads());
      dispatch(asyncGetAllUser()); // Memuat data pengguna saat komponen dimuat
    } else {
      navigate('/login');
    }
  }, [dispatch, isAuthenticated, navigate]);

  useEffect(() => {
    const categories = threads.map((thread) => thread.category);
    const uniqueCategories = [...new Set(categories)];
    setAllCategories(uniqueCategories.filter((category) => category.trim() !== ''));
  }, [threads]);

  useEffect(() => {
    const storedVotes = localStorage.getItem('userThreadVotes');
    if (storedVotes) {
      setUserVotes(JSON.parse(storedVotes));
    }
  }, []);

  const handleVoteUp = async (threadId) => {
    try {
      const selectedThread = threads.find((t) => t.id === threadId);
      if (selectedThread) {
        const updatedUserVotes = { ...userVotes, [threadId]: 'up' };
        setUserVotes(updatedUserVotes); // Optimistically update vote status
        localStorage.setItem('userThreadVotes', JSON.stringify(updatedUserVotes)); // Save to local storage
        await dispatch(voteUpThread(threadId));
        dispatch(fetchThreads());
      } else {
        // eslint-disable-next-line no-console
        console.error('Thread not found');
      }
    } catch (error) {
      // Revert vote status if failed
      const updatedUserVotes = { ...userVotes };
      delete updatedUserVotes[threadId];
      setUserVotes(updatedUserVotes);
    }
  };

  const handleVoteDown = async (threadId) => {
    try {
      const selectedThread = threads.find((t) => t.id === threadId);
      if (selectedThread) {
        const updatedUserVotes = { ...userVotes, [threadId]: 'down' };
        setUserVotes(updatedUserVotes); // Optimistically update vote status
        localStorage.setItem('userThreadVotes', JSON.stringify(updatedUserVotes)); // Save to local storage
        await dispatch(voteDownThread(threadId));
        dispatch(fetchThreads());
      } else {
        // eslint-disable-next-line no-console
        console.error('Thread not found');
      }
    } catch (error) {
      // Revert vote status if failed
      const updatedUserVotes = { ...userVotes };
      delete updatedUserVotes[threadId];
      setUserVotes(updatedUserVotes);
      // eslint-disable-next-line no-console
      console.error('Failed to vote down:', error);
    }
  };

  const handleNeutralizeVote = async (threadId) => {
    try {
      const updatedUserVotes = { ...userVotes };
      delete updatedUserVotes[threadId];
      setUserVotes(updatedUserVotes); // Optimistis memperbarui status vote
      localStorage.setItem('userThreadVotes', JSON.stringify(updatedUserVotes)); // Simpan ke local storage
      await dispatch(neutralizeThreadVote(threadId));
      dispatch(fetchThreads());
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Gagal melakukan netralisasi vote:', error);
    }
  };

  const countNeutralizedComments = (threadId) => {
    const foundThread = threads.find((thread) => thread.id === threadId);
    return foundThread ? foundThread.totalComments : 0;
  };

  const groupThreadsByCategory = () => {
    const groupedThreads = {};
    threads.forEach((thread) => {
      if (!groupedThreads[thread.category]) {
        groupedThreads[thread.category] = [];
      }
      // eslint-disable-next-line no-use-before-define
      const ownerName = users?.find((user) => user.id === thread.ownerId)?.name || 'Pengguna tidak ditemukan';
      const threadWithOwnerName = { ...thread, ownerName };
      groupedThreads[thread.category].push(threadWithOwnerName);
    });
    return Object.entries(groupedThreads).sort((a, b) => b[1].length - a[1].length);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  function timeAgo(timestamp) {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return `${interval} tahun lalu`;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return `${interval} bulan lalu`;
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return `${interval} hari lalu`;
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return `${interval} jam lalu`;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return `${interval} menit lalu`;
    }
    return `${Math.floor(seconds)} detik lalu`;
  }

  const users = useSelector((state) => state.users);
  const threadList = threads?.map((item) => ({
    ...item,
  }));
  // eslint-disable-next-line no-console
  console.log(threadList);

  useEffect(() => {
    dispatch(asyncGetAllUser());
  }, []);

  return (
    <div className="container">
      {isLoading ? (
       <div className="custom-loader"></div>
      ) : (
        <div className="discussions-container">
          <h4 style={{ color: '#666' }}>Daftar Kategori</h4>
          <div className="category-filter">
            <button type="button" onClick={() => handleCategoryFilter('')}>Semua</button>
            {allCategories.map((category) => (
              <button key={category} type="button" onClick={() => handleCategoryFilter(category)}>#{category}</button>
            ))}
          </div>
          <h3 style={{ color: 'lightgreen' }}>Diskusi Tersedia</h3>
          {groupThreadsByCategory().map(([category, categoryThreads]) => (
            <div key={category} className="category-wrapper">
              {(selectedCategory === category || selectedCategory === '') && (
                <>
                  <h2 className="category-title">#{category}</h2>
                  {categoryThreads.map((thread, index) => (
                    <div key={thread.id} className="discussion-card" style={{ borderBottom: index !== threads.length - 1 ? '1px solid #ccc' : 'none', marginTop: '20px', paddingBottom: '20px' }}>
                      <div className="discussion-header">
                        <Link to={`/threads/${thread.id}`} className="discussion-title">{thread.title}</Link>
                      </div>
                      {thread.body && (
                        <div className="discussion-body">
                          <div className="discussion-content" style={{ color: '#666', marginTop: '10px' }}>{parse(thread.body)}</div>
                        </div>
                      )}
                      <div className="discussion-footer" style={{ marginTop: '10px' }}>
                        <div className="action-container">
                          <button
                            type="button"
                            className="action-button"
                            style={{
                              marginRight: '10px',
                              backgroundColor: userVotes[thread.id] === 'up' ? 'blue' : 'grey',
                            }}
                            onClick={() => handleVoteUp(thread.id)}
                          >
                            <FontAwesomeIcon icon={faThumbsUp} /> {thread.likes}
                          </button>
                          <button
                            type="button"
                            className="action-button"
                            style={{
                              marginRight: '10px',
                              backgroundColor: userVotes[thread.id] === 'down' ? 'red' : 'grey',
                            }}
                            onClick={() => handleVoteDown(thread.id)}
                          >
                            <FontAwesomeIcon icon={faThumbsDown} /> {thread.unlikes}
                          </button>
                          <button
                            type="button"
                            className="action-button"
                            style={{
                              marginRight: '10px',
                              backgroundColor: 'grey',
                              color: 'white',
                              border: 'none',
                              padding: '5px 10px',
                              borderRadius: '5px',
                              cursor: 'pointer',
                            }}
                            onClick={() => handleNeutralizeVote(thread.id)}
                          >
                            <FontAwesomeIcon icon={faUndo} style={{ marginRight: '5px' }} />
                          </button>
                          <span style={{ marginRight: '10px' }}>
                            <FontAwesomeIcon icon={faComment} style={{ color: 'green' }} /> {countNeutralizedComments(thread.id)}
                            <p style={{ display: 'inline-block', marginLeft: '10px' }}> Dibuat oleh: {thread.ownerName}</p>
                            <p style={{ display: 'inline-block', margin: '0 10px' }}>{timeAgo(thread.createdAt)}</p>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="create-thread-button">
        <FontAwesomeIcon icon={faPlus} style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={() => navigate('/create-thread')} />
      </div>
    </div>
  );
}

export default ThreadList;
