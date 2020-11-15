import getEnvVars from '../../environment';
const { apiUrl } = getEnvVars();

import MiniPhaseMiscellaneous from '../../models/miniPhaseMiscellaneous';

export const DELETE_MPHASE_MISCELLANY = 'DELETE_MPHASE_MISCELLANY';
export const CREATE_MPHASE_MISCELLANY = 'CREATE_MPHASE_MISCELLANY';
export const UPDATE_MPHASE_MISCELLANY = 'UPDATE_MPHASE_MISCELLANY';
export const SET_MISCELLANIES = 'SET_MISCELLANIES';
export const DELETE_MISCELLANY_ONDLTMPHASE = 'DELETE_MISCELLANY_ONDLTMPHASE';

export const fetchMiscellanies = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(`${apiUrl}/api/miscellanies`);

      if (!response.ok) {
        const errorResData = await response.json();
        throw new Error(errorResData.message);
      }

      const resData = await response.json();
      const loadedMiscellanies = [];

      for (const key in resData) {
        loadedMiscellanies.push(
          new MiniPhaseMiscellaneous(
            resData[key]._id,
            resData[key].miniPhase,
            resData[key].projectPhase,
            resData[key].title,
            resData[key].description,
            resData[key].totalCost
          )
        );
      }
      dispatch({ type: SET_MISCELLANIES, miscellanies: loadedMiscellanies });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteMphaseMiscellany = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/miscellanies/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorResData = await response.json();
      throw new Error(errorResData.message);
    }

    dispatch({ type: DELETE_MPHASE_MISCELLANY, miscellanyId: id });
  };
};

export const createMphaseMiscellany = (
  mPhaseId,
  projectPhaseId,
  title,
  description,
  totalCost
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/miscellanies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mPhaseId,
        projectPhaseId,
        title,
        description,
        totalCost,
      }),
    });

    if (!response.ok) {
      const errorResData = await response.json();
      throw new Error(errorResData.message);
    }

    const resData = await response.json();

    dispatch({
      type: CREATE_MPHASE_MISCELLANY,
      miscellanyData: {
        id: resData._id,
        mPhaseId: resData.miniPhase,
        projectPhaseId: resData.projectPhase,
        title: resData.title,
        description: resData.description,
        totalCost: resData.totalCost,
      },
    });
  };
};

export const updateMphaseMiscellany = (id, title, description, totalCost) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/miscellanies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        totalCost,
      }),
    });

    if (!response.ok) {
      const errorResData = await response.json();
      throw new Error(errorResData.message);
    }

    const resData = await response.json();

    dispatch({
      type: UPDATE_MPHASE_MISCELLANY,
      misId: id,
      miscellanyData: {
        title: resData.title,
        description: resData.description,
        totalCost: resData.totalCost,
      },
    });
  };
};
