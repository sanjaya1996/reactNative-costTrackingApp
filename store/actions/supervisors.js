import getEnvVars from '../../environment';
const { apiUrl } = getEnvVars();

export const CREATE_SUPERVISOR_PROFILE = 'CREATE_SUPERVISOR_PROFILE';
export const UPDATE_SUPERVISOR_PROFILE = 'UPDATE_SUPERVISOR_PROFILE';
export const SET_SUPERVISOR_PROFILE = 'SET_SUPERVISOR_PROFILE';

export const fetchSupervisors = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/users/profiles/myprofile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorResData = await response.json();
      console.log(errorResData.message);
      throw new Error(errorResData.message);
    }

    const resData = await response.json();

    dispatch({
      type: SET_SUPERVISOR_PROFILE,
      userProfile: resData,
    });
  };
};

export const createSupervisorProfile = (
  fName,
  lName,
  email,
  phone,
  jobTitle,
  profilePic
) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/users/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId,
        fName,
        lName,
        email,
        phone,
        jobTitle,
        profilePic,
      }),
    });

    if (!response.ok) {
      const errorResData = await response.json();
      console.log(errorResData.message);
      throw new Error(errorResData.message);
    }

    const resData = await response.json();

    dispatch({
      type: CREATE_SUPERVISOR_PROFILE,
      userProfile: resData,
    });
  };
};

export const updateSupervisorProfile = (
  id,
  fName,
  lName,
  email,
  phone,
  jobTitle,
  profilePic
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/users/profiles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fName,
        lName,
        email,
        phone,
        jobTitle,
        profilePic,
      }),
    });

    if (!response.ok) {
      const errorResData = await response.json();
      console.log(errorResData.message);
      throw new Error(errorResData.message);
    }

    const resData = await response.json();
    dispatch({
      type: UPDATE_SUPERVISOR_PROFILE,
      userProfile: resData,
    });
  };
};
