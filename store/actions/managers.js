import getEnvVars from '../../environment';
const { apiUrl } = getEnvVars();

import Manager from '../../models/manager';

export const CREATE_MANAGER = 'CREATE_MANAGER';
export const UPDATE_MANAGER = 'UPDATE_MANAGER';
export const DELETE_MANAGER = 'DELETE_MANAGER';
export const SET_MANAGERS = 'SET_MANAGERS';

export const fetchManagers = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/managers/mymanagers`, {
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
    const loadedManagers = [];
    for (const key in resData) {
      loadedManagers.push(
        new Manager(
          resData[key]._id,
          resData[key].fName,
          resData[key].lName,
          resData[key].email,
          resData[key].phone,
          resData[key].supervisor
        )
      );
    }

    dispatch({
      type: SET_MANAGERS,
      managers: loadedManagers,
    });
  };
};

export const createManager = (fName, lName, phone, email) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/managers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fName,
        lName,
        phone,
        email,
        supervisorId: userId,
      }),
    });

    if (!response.ok) {
      const errorResData = await response.json();
      console.log(errorResData.message);
      throw new Error(errorResData.message);
    }

    const resData = await response.json();

    dispatch({
      type: CREATE_MANAGER,
      managerData: {
        id: resData._id,
        fName: resData.fName,
        lName: resData.lName,
        phone: resData.phone,
        email: resData.email,
        supervisorId: resData.supervisor,
      },
    });
  };
};

export const updateManager = (id, fName, lName, phone, email) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/managers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fName,
        lName,
        phone,
        email,
      }),
    });

    if (!response.ok) {
      const errorResData = await response.json();
      console.log(errorResData.message);
      throw new Error(errorResData.message);
    }

    const resData = await response.json();

    dispatch({
      type: UPDATE_MANAGER,
      id: resData._id,
      managerData: {
        fName: resData.fName,
        lName: resData.lName,
        phone: resData.phone,
        email: resData.email,
      },
    });
  };
};

export const deleteManager = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/managers/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorResData = await response.json();
      console.log(errorResData.message);
      throw new Error(errorResData.message);
    }

    dispatch({ type: DELETE_MANAGER, id });
  };
};
