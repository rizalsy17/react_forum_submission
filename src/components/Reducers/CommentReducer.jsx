import {
  CREATE_COMMENT_SUCCESS,
  CREATE_COMMENT_FAILURE,
  UPVOTE_COMMENT_SUCCESS,
  UPVOTE_COMMENT_FAILURE,
  DOWNVOTE_COMMENT_SUCCESS,
  DOWNVOTE_COMMENT_FAILURE,
  NEUTRALIZE_COMMENT_VOTE_SUCCESS,
  NEUTRALIZE_COMMENT_VOTE_FAILURE,
} from '../Actions/CommentAction.jsx';

const initialState = {
  comments: [],
  commentContent: '',
  error: null,
};

// eslint-disable-next-line default-param-last
const commentReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_COMMENT_SUCCESS:
      return {
        ...state,
        comments: [...state.comments, action.payload],
        error: null,
      };
    case CREATE_COMMENT_FAILURE:
    case UPVOTE_COMMENT_FAILURE:
    case DOWNVOTE_COMMENT_FAILURE:
    case NEUTRALIZE_COMMENT_VOTE_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case UPVOTE_COMMENT_SUCCESS:
    case DOWNVOTE_COMMENT_SUCCESS:
    case NEUTRALIZE_COMMENT_VOTE_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const updatedComments = state.comments.map((comment) => {
        if (comment.id === action.payload.id) {
          return action.payload;
        }
        return comment;
      });
      return {
        ...state,
        comments: updatedComments,
        error: null,
      };
    default:
      return state;
  }
};

export default commentReducer;
