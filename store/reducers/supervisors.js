import {
  CREATE_SUPERVISOR_PROFILE,
  UPDATE_SUPERVISOR_PROFILE,
  SET_SUPERVISOR_PROFILE,
} from '../actions/supervisors';

const initialState = {
  user: {},
};

const supervisorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SUPERVISOR_PROFILE:
      return {
        user: action.userProfile,
      };
    case CREATE_SUPERVISOR_PROFILE:
      return {
        user: action.userProfile,
      };
    case UPDATE_SUPERVISOR_PROFILE:
      return {
        user: action.userProfile,
      };
    default:
      return { ...state };
  }
};

export default supervisorsReducer;
