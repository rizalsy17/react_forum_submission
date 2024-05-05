import {
  FETCH_THREADS_REQUEST,
  FETCH_THREADS_SUCCESS,
  FETCH_THREADS_FAILURE,
  FETCH_THREAD_DETAIL_REQUEST,
  FETCH_THREAD_DETAIL_SUCCESS,
  FETCH_THREAD_DETAIL_FAILURE,
  VOTE_UP_THREAD_SUCCESS,
  VOTE_UP_THREAD_FAILURE,
  VOTE_DOWN_THREAD_SUCCESS,
  VOTE_DOWN_THREAD_FAILURE,
  NEUTRALIZE_THREAD_VOTE_SUCCESS,
  NEUTRALIZE_THREAD_VOTE_FAILURE,
} from '../Actions/ThreadAction.jsx';

const initialState = {
  threads: [],
  threadDetail: null,
  loading: false,
  error: null,
};

// eslint-disable-next-line default-param-last
const threadReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_THREADS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_THREADS_SUCCESS:
      return {
        ...state,
        threads: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_THREADS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_THREAD_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_THREAD_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        threadDetail: action.payload,
        error: null,
      };
    case FETCH_THREAD_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        threadDetail: null,
        error: action.payload,
      };
    case VOTE_UP_THREAD_SUCCESS:
      return {
        ...state,
        threads: state.threads.map((thread) => {
          if (thread.id === action.payload.id) {
            return {
              ...thread,
              likes: action.payload.likes,
              liked: true, // Set liked menjadi true ketika upvote
              unliked: false, // Reset unliked menjadi false ketika upvote
            };
          }
          return thread;
        }),
      };
    case VOTE_UP_THREAD_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case VOTE_DOWN_THREAD_SUCCESS:
      return {
        ...state,
        threads: state.threads.map((thread) => {
          if (thread.id === action.payload.id) {
            return {
              ...thread,
              unlikes: action.payload.unlikes,
              liked: false, // Reset liked menjadi false ketika downvote
              unliked: true, // Set unliked menjadi true ketika downvote
            };
          }
          return thread;
        }),
      };
    case VOTE_DOWN_THREAD_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case NEUTRALIZE_THREAD_VOTE_SUCCESS:
      return {
        ...state,
        threads: state.threads.map((thread) => {
          if (thread.id === action.payload.data.vote.threadId) {
            return action.payload.data.vote;
          }
          return thread;
        }),
      };
    case NEUTRALIZE_THREAD_VOTE_FAILURE:
      return {
        ...state,
        error: action.payload, // Store only the serialized error message
      };
    default:
      return state;
  }
};

export default threadReducer;
