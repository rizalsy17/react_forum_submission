/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThumbsUp,
  faThumbsDown,
  faHome,
  faUndo,
} from '@fortawesome/free-solid-svg-icons';
import parse from 'html-react-parser';
import { fetchThreadDetail } from '../Actions/ThreadAction.jsx';
import {
  createComment,
  upVoteComment,
  downVoteComment,
  neutralizeCommentVote,
} from '../Actions/CommentAction.jsx';

function ThreadDetail() {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const threadDetail = useSelector((state) => state.thread.threadDetail);
  const error = useSelector((state) => state.thread.error);
  const [comment, setComment] = useState('');
  const [userVotes, setUserVotes] = useState({});

  useEffect(() => {
    dispatch(fetchThreadDetail(threadId));
  }, [dispatch, threadId]);

  useEffect(() => {
    const savedVotes = JSON.parse(localStorage.getItem('commentVotes')) || {};
    setUserVotes(savedVotes);
  }, []);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim() !== '') {
      try {
        await dispatch(createComment(threadId, comment));
        setComment('');
        dispatch(fetchThreadDetail(threadId));
      // eslint-disable-next-line no-shadow
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Gagal membuat komentar:', error);
      }
    }
  };

  const handleUpVote = async (commentId) => {
    try {
      const updatedUserVotes = { ...userVotes, [commentId]: 'up' };
      setUserVotes(updatedUserVotes); // Memperbarui status vote secara optimistis
      localStorage.setItem('commentVotes', JSON.stringify(updatedUserVotes)); // Menyimpan status vote ke local storage
      await dispatch(upVoteComment(threadId, commentId));
      dispatch(fetchThreadDetail(threadId));
    // eslint-disable-next-line no-shadow
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Gagal melakukan upvote komentar:', error);
    }
  };

  const handleDownVote = async (commentId) => {
    try {
      const updatedUserVotes = { ...userVotes, [commentId]: 'down' };
      setUserVotes(updatedUserVotes); // Memperbarui status vote secara optimistis
      localStorage.setItem('commentVotes', JSON.stringify(updatedUserVotes)); // Menyimpan status vote ke local storage
      await dispatch(downVoteComment(threadId, commentId));
      dispatch(fetchThreadDetail(threadId));
    // eslint-disable-next-line no-shadow
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Gagal melakukan downvote komentar:', error);
    }
  };

  const handleNeutralizeVote = async (commentId) => {
    try {
      const updatedUserVotes = { ...userVotes };
      delete updatedUserVotes[commentId]; // Menghapus vote untuk komentar tertentu
      setUserVotes(updatedUserVotes); // Memperbarui status vote secara optimistis
      localStorage.setItem('commentVotes', JSON.stringify(updatedUserVotes)); // Menyimpan status vote ke local storage
      await dispatch(neutralizeCommentVote(threadId, commentId));
      dispatch(fetchThreadDetail(threadId));
    // eslint-disable-next-line no-shadow
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Gagal menetralkan vote komentar:', error);
    }
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!threadDetail) {
    return null;
  }

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

  return (
    <>
      <Link to="/" className="home-link" style={{
        position: 'absolute', top: '20px', left: '20px', zIndex: '999',
      }}>
        <FontAwesomeIcon icon={faHome} />
      </Link>
      <div className="container">
        <h2>#{threadDetail.category}</h2>
        <h3 className="thread-title">{threadDetail.title}</h3>
        <div className="thread-owner-container">
          Dibuat oleh
          {threadDetail.owner.avatar && (
            <img
              src={threadDetail.owner.avatar}
              alt={threadDetail.owner.name}
              className="thread-owner-avatar"
            />
          )}
          <p className="thread-owner-name">{threadDetail.owner.name}</p><p className="thread-owner-time">{timeAgo(threadDetail.createdAt)}</p>
        </div>

        <div style={{ marginBottom: '10px' }}>{parse(threadDetail.body)}</div>
        <div className="action-container">
        </div>
        <h5>Beri Komentar</h5>
        <div className="comments-container">
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              className="comment-input"
              value={comment}
              onChange={handleCommentChange}
              placeholder=""
              rows="4"
              cols="50"
            />
            <br />
            <button className="comment-submit-btn" type="submit">Kirim</button>
          </form>
          <h5>Daftar Komentar</h5>
          <ul className="comments-list">
            {threadDetail.comments.map((comment) => (
              <li key={comment.id} className="comment-item">
                <div className="comment-content">
                  <div className="comment-author" style={{ display: 'flex', alignItems: 'center' }}>
                    {comment.owner.avatar && (
                      <img
                        src={comment.owner.avatar}
                        alt={comment.owner.name}
                        className="user-avatar"
                        style={{
                          width: '32px', borderRadius: '50%', height: '32px', marginRight: '10px',
                        }}
                      />
                    )}
                    <span style={{ fontWeight: 'bold', color: '#007bff' }}>{comment.owner.name}</span>
                  </div>

                  <div style={{ marginTop: '5px', marginBottom: '5px' }}>{parse(comment.content)}</div>
                  <div className="comment-actions">
                    <button
                      className="action-button"
                      style={{ marginRight: '10px', backgroundColor: userVotes[comment.id] === 'up' ? 'blue' : 'grey' }}
                      onClick={() => handleUpVote(comment.id)}
                    >
                      <FontAwesomeIcon icon={faThumbsUp}/> {comment.upVotesBy.length}
                    </button>
                    <button
                      className="action-button"
                      style={{ marginRight: '10px', backgroundColor: userVotes[comment.id] === 'down' ? 'red' : 'grey' }}
                      onClick={() => handleDownVote(comment.id)}
                    >
                      <FontAwesomeIcon icon={faThumbsDown} /> {comment.downVotesBy.length}
                    </button>
                    <button
                      className="action-button"
                      onClick={() => handleNeutralizeVote(comment.id)}
                    >
                      <FontAwesomeIcon icon={faUndo}/>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default ThreadDetail;
