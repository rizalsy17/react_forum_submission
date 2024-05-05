import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../Actions/AuthAction.jsx';

function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!name || !email || !password) {
        throw new Error('Nama, email, dan password harus diisi.');
      }
      const response = await dispatch(register(name, email, password));
      if (response) {
        navigate('/login');
        // eslint-disable-next-line no-console
        console.log('Registrasi berhasil');
        return;
      }
      throw new Error('Gagal melakukan registrasi. Mohon coba lagi.');
    // eslint-disable-next-line no-shadow
    } catch (error) {
      // Tangani kesalahan
      const errorMessage = error.message || 'Terjadi kesalahan saat memproses registrasi. Mohon coba lagi.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2 style={{ textAlign: 'center' }}>Daftar Akun Baru</h2>
      {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <div className="form-group">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="form-control input-field"
        />
      </div>
      <div className="form-group">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="form-control input-field"
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="form-control input-field"
        />
      </div>
      <button type="submit" className="btn btn-primary submit-button" disabled={loading}>Register</button>
      <p style={{ textAlign: 'center' }}>Sudah punya akun? <Link to="/login">Masuk di sini</Link></p>
    </form>
  );
}

export default RegisterForm;
