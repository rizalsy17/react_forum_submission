import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux'; // Tambahkan import useDispatch
import { createNewThread } from '../Actions/ThreadAction.jsx'; // Ganti import

function CreateThreadForm() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!title.trim() || !body.trim()) {
        // eslint-disable-next-line no-alert
        alert('Judul dan Body tidak boleh kosong!');
        return;
      }
      await dispatch(createNewThread(title, body, category));
      navigate('/');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <>
      <Link to="/" className="home-link" style={{
        position: 'absolute', top: '20px', left: '20px', zIndex: '999',
      }}>
        <FontAwesomeIcon icon={faHome} />
      </Link>
      <div className="create-thread-container">
        <form className="create-thread-form" onSubmit={handleSubmit}>
          <h2>Tambah Diskusi</h2>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} ></textarea>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Kategori" />
          <button type="submit">Buat Diskusi</button>
        </form>
      </div>
    </>
  );
}

export default CreateThreadForm;
