import {
  createComment as createCommentApi,
  upVoteComment as upVoteCommentApi,
  downVoteComment as downVoteCommentApi,
  neutralizeCommentVote as neutralizeCommentVoteApi,
} from '../../api/api.jsx';

export const CREATE_COMMENT_SUCCESS = 'CREATE_COMMENT_SUCCESS';
export const CREATE_COMMENT_FAILURE = 'CREATE_COMMENT_FAILURE';

export const createCommentSuccess = (comment) => ({
  type: CREATE_COMMENT_SUCCESS,
  payload: comment,
});

export const createCommentFailure = (error) => ({
  type: CREATE_COMMENT_FAILURE,
  payload: error,
});

// eslint-disable-next-line arrow-body-style
export const createComment = (threadId, content) => {
  return async (dispatch) => {
    try {
      const response = await createCommentApi(threadId, content);
      dispatch(createCommentSuccess(response.data));
    } catch (error) {
      dispatch(createCommentFailure(error));
    }
  };
};

export const UPVOTE_COMMENT_SUCCESS = 'UPVOTE_COMMENT_SUCCESS';
export const UPVOTE_COMMENT_FAILURE = 'UPVOTE_COMMENT_FAILURE';

export const upVoteCommentSuccess = (comment) => ({
  type: UPVOTE_COMMENT_SUCCESS,
  payload: comment,
});

export const upVoteCommentFailure = (error) => ({
  type: UPVOTE_COMMENT_FAILURE,
  payload: error,
});

// eslint-disable-next-line arrow-body-style
export const upVoteComment = (threadId, commentId) => {
  return async (dispatch) => {
    try {
      const response = await upVoteCommentApi(threadId, commentId);
      dispatch(upVoteCommentSuccess(response.data));
    } catch (error) {
      dispatch(upVoteCommentFailure(error));
    }
  };
};

export const DOWNVOTE_COMMENT_SUCCESS = 'DOWNVOTE_COMMENT_SUCCESS';
export const DOWNVOTE_COMMENT_FAILURE = 'DOWNVOTE_COMMENT_FAILURE';

export const downVoteCommentSuccess = (comment) => ({
  type: DOWNVOTE_COMMENT_SUCCESS,
  payload: comment,
});

export const downVoteCommentFailure = (error) => ({
  type: DOWNVOTE_COMMENT_FAILURE,
  payload: error,
});

// eslint-disable-next-line arrow-body-style
export const downVoteComment = (threadId, commentId) => {
  return async (dispatch) => {
    try {
      const response = await downVoteCommentApi(threadId, commentId);
      dispatch(downVoteCommentSuccess(response.data));
    } catch (error) {
      dispatch(downVoteCommentFailure(error));
    }
  };
};

export const NEUTRALIZE_COMMENT_VOTE_SUCCESS = 'NEUTRALIZE_COMMENT_VOTE_SUCCESS';
export const NEUTRALIZE_COMMENT_VOTE_FAILURE = 'NEUTRALIZE_COMMENT_VOTE_FAILURE';

export const neutralizeCommentVoteSuccess = (comment) => ({
  type: NEUTRALIZE_COMMENT_VOTE_SUCCESS,
  payload: comment,
});

export const neutralizeCommentVoteFailure = (error) => ({
  type: NEUTRALIZE_COMMENT_VOTE_FAILURE,
  payload: error,
});

// eslint-disable-next-line arrow-body-style
export const neutralizeCommentVote = (threadId, commentId) => {
  return async (dispatch) => {
    try {
      const response = await neutralizeCommentVoteApi(threadId, commentId);
      dispatch(neutralizeCommentVoteSuccess(response.data));
    } catch (error) {
      dispatch(neutralizeCommentVoteFailure(error));
    }
  };
};
