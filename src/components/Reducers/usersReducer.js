/* eslint-disable default-param-last */
import { ActionType } from '../Actions/usersAction';

const userReducer = (state = [], action) => {
  switch (action.type) {
    case ActionType.GET_ALL_USERS:
      return action.payload.users;
    default:
      return state;
  }
};

export default userReducer;
