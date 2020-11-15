import getEnvVars from '../../environment';
const { apiUrl } = getEnvVars();

import MiniPhase from '../../models/miniPhase';

export const TOGGLE_SPECIAL = 'TOGGLE-SPECIAL';
export const DELETE_MINIPHASE = 'DELETE_MINIPHASE';
export const CREATE_MINIPHASE = 'CREATE_MINIPHASE';
export const UPDATE_MINIPHASE = 'UPDATE_MINIPHASE';
export const SET_MINIPHASES = 'SET_MINIPHASES';
export const SET_SPECIALMPHASES = 'SET_SPECIALMPHASES';

export const fetchMiniPhases = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(`${apiUrl}/api/miniphases`);

      if (!response.ok) {
        const errorResData = await response.json();
        throw new Error(errorResData.message);
      }

      const resData = await response.json();
      const loadedMiniPhases = [];
      for (const key in resData) {
        loadedMiniPhases.push(
          new MiniPhase(
            resData[key]._id,
            resData[key].projectPhase,
            resData[key].title,
            resData[key].status,
            resData[key].description
          )
        );
      }
      dispatch({ type: SET_MINIPHASES, miniPhases: loadedMiniPhases });
    } catch (err) {
      throw err;
    }
  };
};

export const fetchSpecialMphases = () => {
  return async (dispatch) => {
    const response = await fetch(`${apiUrl}/api/miniphases/specials`);

    if (!response.ok) {
      const errorResData = await response.json();
      throw new Error(errorResData.message);
    }

    const resData = await response.json();
    const loadedSpecialmPhases = [];

    for (const key in resData) {
      loadedSpecialmPhases.push(
        new MiniPhase(
          resData[key].miniPhase._id,
          resData[key].miniPhase.projectPhase,
          resData[key].miniPhase.title,
          resData[key].miniPhase.status,
          resData[key].miniPhase.description
        )
      );
    }
    dispatch({
      type: SET_SPECIALMPHASES,
      specialMiniPhases: loadedSpecialmPhases,
    });
  };
};

export const toggleSpecial = (miniPhaseId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await fetch(
      `${apiUrl}/api/miniphases/specials/${miniPhaseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const message =
        errorResData.response && errorResData.response.data.message
          ? errorResData.response.data.message
          : errorResData.message;
      throw new Error(message);
    }

    dispatch({ type: TOGGLE_SPECIAL, miniPhaseId });
  };
};

export const deleteMiniPhase = (miniPhaseId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/miniphases/${miniPhaseId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorResData = await response.json();
      const message =
        errorResData.response && errorResData.response.data.message
          ? errorResData.response.data.message
          : errorResData.message;
      throw new Error(message);
    }

    dispatch({ type: DELETE_MINIPHASE, mPhaseId: miniPhaseId });
  };
};

export const createMiniPhase = (phaseId, title, status, description) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/miniphases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        phaseId,
        title,
        status,
        description,
      }),
    });

    if (!response.ok) {
      const errorResData = await response.json();
      throw new Error(errorResData.message);
    }

    const resData = await response.json();

    dispatch({
      type: CREATE_MINIPHASE,
      miniPhaseData: {
        id: resData._id,
        phaseId: resData.projectPhase,
        title: resData.title,
        status: resData.status,
        description: resData.description,
      },
    });
  };
};

export const updateMiniPhase = (id, title, status, description) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/miniphases/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        status,
        description,
      }),
    });

    const resData = await response.json();

    if (!response.ok) {
      const errorResData = await response.json();
      throw new Error(errorResData.message);
    }

    dispatch({
      type: UPDATE_MINIPHASE,
      mpId: resData._id,
      miniPhaseData: {
        title: resData.title,
        status: resData.status,
        description: resData.description,
      },
    });
  };
};
