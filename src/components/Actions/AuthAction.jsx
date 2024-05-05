import { loginUser, registerUser } from '../../api/api.jsx';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';
export const LOGOUT = 'LOGOUT';

export const register = (name, email, password) => async (dispatch) => {
  try {
    const response = await registerUser(name, email, password);
    dispatch({ type: REGISTER_SUCCESS, payload: response }); // Mengirimkan seluruh respons
    return response; // Kembalikan respons untuk menentukan apakah registrasi berhasil
  } catch (error) {
    let errorMessage = 'Registrasi gagal. Mohon coba lagi.';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    dispatch({ type: REGISTER_FAILURE, payload: errorMessage });
    throw errorMessage;
  }
};

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    const response = await loginUser(email, password);
    if (response && response.data && response.data.token) {
      localStorage.setItem('accessToken', response.data.token);
      dispatch({ type: LOGIN_SUCCESS, payload: response });
      return response;
    // eslint-disable-next-line no-else-return
    } else {
      throw new Error('Token tidak ditemukan dalam respons dari server.');
    }
  } catch (error) {
    let errorMessage = 'Login gagal. Mohon periksa kembali email dan password Anda.';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    dispatch({ type: LOGIN_FAILURE, payload: errorMessage });
    throw new Error(errorMessage);
  }
};

export const logout = () => ({
  type: LOGOUT,
});
