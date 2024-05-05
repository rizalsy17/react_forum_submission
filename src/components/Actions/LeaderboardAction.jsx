import { getLeaderboards } from '../../api/api.jsx';

export const FETCH_LEADERBOARD_REQUEST = 'FETCH_LEADERBOARD_REQUEST';
export const FETCH_LEADERBOARD_SUCCESS = 'FETCH_LEADERBOARD_SUCCESS';
export const FETCH_LEADERBOARD_FAILURE = 'FETCH_LEADERBOARD_FAILURE';

export const fetchLeaderboardRequest = () => ({
  type: FETCH_LEADERBOARD_REQUEST,
});

export const fetchLeaderboardSuccess = (leaderboardData) => ({
  type: FETCH_LEADERBOARD_SUCCESS,
  payload: leaderboardData,
});

export const fetchLeaderboardFailure = (error) => ({
  type: FETCH_LEADERBOARD_FAILURE,
  payload: error,
});

// eslint-disable-next-line arrow-body-style
export const fetchLeaderboard = () => {
  return async (dispatch) => {
    dispatch(fetchLeaderboardRequest());
    try {
      const { data } = await getLeaderboards();
      dispatch(fetchLeaderboardSuccess(data.leaderboards));
    } catch (error) {
      dispatch(fetchLeaderboardFailure(error));
    }
  };
};
