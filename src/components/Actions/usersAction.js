import { getAllUsers } from '../../api/api.jsx';

export const ActionType = {
  GET_ALL_USERS: 'GET_ALL_USERS',
};

const getAllUserActionType = (users) => ({
  type: ActionType.GET_ALL_USERS,
  payload: {
    users,
  },
});

export const asyncGetAllUser = () => async (dispatch) => {
  try {
    const user = await getAllUsers();
    dispatch(getAllUserActionType(user));
  } catch (error) {
    throw new Error(error);
  }
};
