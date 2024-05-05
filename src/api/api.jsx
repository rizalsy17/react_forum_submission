/* eslint-disable no-useless-catch */
const baseURL = 'https://forum-api.dicoding.dev/v1';

const getStoredToken = () => localStorage.getItem('accessToken');

const storeToken = (newToken) => localStorage.setItem('accessToken', newToken);

const removeStoredToken = () => localStorage.removeItem('accessToken');

async function fetchWithToken(url, options = {}) {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${getStoredToken()}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export const loginUser = async (email, password) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch(`${baseURL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login gagal. Mohon periksa kembali email dan password Anda.');
    }

    const data = await response.json();
    storeToken(data.data.token);
    return data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (name, email, password) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch(`${baseURL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      throw new Error('Registrasi gagal. Mohon coba lagi.');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    removeStoredToken();
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await fetchWithToken(`${baseURL}/users`);
    const responseJson = await response.json();
    const { data: { users } } = responseJson;
    return users;
  } catch (error) {
    throw error;
  }
};

export const getOwnProfile = async () => {
  try {
    const response = await fetchWithToken(`${baseURL}/users/me`);
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const createThread = async (title, body, category) => {
  try {
    const response = await fetchWithToken(`${baseURL}/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, body, category }),
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getAllThreads = async () => {
  try {
    const userDataResponse = await getOwnProfile();
    const userData = userDataResponse.data;

    const response = await fetchWithToken(`${baseURL}/threads`);
    const data = await response.json();

    if (data.status !== 'success' || !data.data || !Array.isArray(data.data.threads)) {
      throw new Error('Invalid API response format');
    }

    const threadsWithInfo = await Promise.all(data.data.threads.map(async (thread) => {
      try {
        return {
          ...thread,
          likes: thread.upVotesBy.length,
          unlikes: thread.downVotesBy.length,
          shares: thread.totalComments,
          ownerName: userData.name,
        };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching user data:', error);
        return {
          ...thread,
          likes: thread.upVotesBy.length,
          unlikes: thread.downVotesBy.length,
          shares: thread.totalComments,
          ownerName: 'Unknown',
        };
      }
    }));

    return { ...data, data: { threads: threadsWithInfo } };
  } catch (error) {
    throw error;
  }
};

export const getThreadDetail = async (threadId) => {
  try {
    const response = await fetchWithToken(`${baseURL}/threads/${threadId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch thread detail. Server responded with status: ${response.status}`);
    }
    const data = await response.json();
    if (data.status !== 'success' || !data.data || !data.data.detailThread) {
      throw new Error(data.message || 'Failed to fetch thread detail. Invalid response from server.');
    }
    return data.data.detailThread;
  } catch (error) {
    throw new Error(`Failed to fetch thread detail: ${error.message}`);
  }
};

export const createComment = async (threadId, content) => {
  try {
    const response = await fetchWithToken(`${baseURL}/threads/${threadId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Failed to create comment');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const upVoteThread = async (threadId) => {
  try {
    const response = await fetchWithToken(`${baseURL}/threads/${threadId}/up-vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const downVoteThread = async (threadId) => {
  try {
    const response = await fetchWithToken(`${baseURL}/threads/${threadId}/down-vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const neutralizeThreadVote = async (threadId) => {
  try {
    const response = await fetchWithToken(`${baseURL}/threads/${threadId}/neutral-vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const upVoteComment = async (threadId, commentId) => {
  try {
    const response = await fetchWithToken(`${baseURL}/threads/${threadId}/comments/${commentId}/up-vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const downVoteComment = async (threadId, commentId) => {
  try {
    const response = await fetchWithToken(`${baseURL}/threads/${threadId}/comments/${commentId}/down-vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const neutralizeCommentVote = async (threadId, commentId) => {
  try {
    const response = await fetchWithToken(`${baseURL}/threads/${threadId}/comments/${commentId}/neutral-vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getLeaderboards = async () => {
  try {
    const response = await fetchWithToken(`${baseURL}/leaderboards`);
    return await response.json();
  } catch (error) {
    throw error;
  }
};
