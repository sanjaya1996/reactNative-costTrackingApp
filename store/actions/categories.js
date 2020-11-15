import getEnvVars from '../../environment';
const { apiUrl } = getEnvVars();

import Category from '../../models/category';

export const CREATE_PROJECTPHASE = 'CREATE_PROJECTPHASE';
export const UPDATE_PROJECTPHASE = 'UPDATE_PROJECTPHASE';
export const SET_PROJECTPHASES = 'SET_PROJECTPHASES';

export const fetchProjectPhases = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(`${apiUrl}/api/projectphases`);

      if (!response.ok) {
        const errorResData = await response.json();
        throw new Error(errorResData.message);
      }
      const resData = await response.json();
      const loadedProjectPhases = [];

      for (const key in resData) {
        loadedProjectPhases.push(
          new Category(
            resData[key]._id,
            resData[key].project,
            resData[key].title,
            resData[key].startedDate,
            resData[key].estimatedDate,
            resData[key].estimatedBudget
          )
        );
      }

      dispatch({ type: SET_PROJECTPHASES, projectPhases: loadedProjectPhases });
    } catch (err) {
      throw err;
    }
  };
};

export const createProjectPhase = (
  projectId,
  title,
  startedDate,
  estimatedDate,
  estimatedBudget
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/projectphases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        projectId,
        title,
        startedDate,
        estimatedDate,
        estimatedBudget,
      }),
    });

    if (!response.ok) {
      const errorResData = await response.json();
      throw new Error(errorResData.message);
    }

    const resData = await response.json();

    dispatch({
      type: CREATE_PROJECTPHASE,
      projectPhaseData: {
        id: resData._id,
        projectId: resData.project,
        title: resData.title,
        startedDate: resData.startedDate,
        estimatedDate: resData.estimatedDate,
        estimatedBudget: resData.estimatedBudget,
      },
    });
  };
};

export const updateProjectPhase = (
  phaseId,
  startedDate,
  estimatedDate,
  estimatedBudget
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/projectphases/${phaseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        startedDate,
        estimatedDate,
        estimatedBudget,
      }),
    });

    const resData = await response.json();

    if (!response.ok) {
      const errorResData = await response.json();
      throw new Error(errorResData.message);
    }

    dispatch({
      type: UPDATE_PROJECTPHASE,
      phaseId,
      projectPhaseData: {
        startedDate: resData.startedDate,
        estimatedDate: resData.estimatedDate,
        estimatedBudget: resData.estimatedBudget,
      },
    });
  };
};
