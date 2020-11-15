import getEnvVars from '../../environment';
const { apiUrl } = getEnvVars();

import Client from '../../models/client';

export const CREATE_CLIENT = 'CREATE_CLIENT';
export const UPDATE_CLIENT = 'UPDATE_CLIENT';
export const DELETE_CLIENT = 'DELETE_CLIENT';
export const SET_CLIENT = 'SET_CLIENT';

export const fetchClients = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    try {
      const response = await fetch(`${apiUrl}/api/clients/myclients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorResData = await response.json();
        throw new Error(errorResData.message);
      }
      const resData = await response.json();
      const loadedClients = [];

      for (const key in resData) {
        loadedClients.push(
          new Client(
            resData[key]._id,
            resData[key].project,
            resData[key].fName,
            resData[key].lName,
            resData[key].email,
            resData[key].phone,
            resData[key].supervisor
          )
        );
      }

      dispatch({
        type: SET_CLIENT,
        clients: loadedClients,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const createClient = (projectId, fName, lName, email, phone) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        projectId,
        fName,
        lName,
        email,
        phone,
      }),
    });

    if (!response.ok) {
      const errorResData = await response.json();
      console.log(errorResData.message);
      throw new Error(errorResData.message);
    }

    const resData = await response.json();
    dispatch({
      type: CREATE_CLIENT,
      clientData: {
        id: resData._id,
        projectId: resData.project,
        fName: resData.fName,
        lName: resData.lName,
        email: resData.email,
        phone: resData.phone,
        supervisorId: resData.supervisor,
      },
    });
  };
};

export const updateClient = (id, fName, lName, email, phone) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/clients/${id}`, {
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
      }),
    });

    if (!response.ok) {
      const errorResData = await response.json();
      console.log(errorResData.message);
      throw new Error(errorResData.message);
    }

    const resData = await response.json();

    dispatch({
      type: UPDATE_CLIENT,
      id: resData._id,
      clientData: {
        fName: resData.fName,
        lName: resData.lName,
        email: resData.email,
        phone: resData.phone,
      },
    });
  };
};

export const deleteClient = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/clients/${id}`, {
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

    dispatch({ type: DELETE_CLIENT, id });
  };
};
