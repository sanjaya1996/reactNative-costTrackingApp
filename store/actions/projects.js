import getEnvVars from '../../environment';
const { apiUrl } = getEnvVars();

import Project from '../../models/project';

export const CREATE_PROJECT = ' CREATE_PROJECT';
export const UPDATE_PROJECT = 'UPDATE_PROJECT';
export const FINISH_PROJECT = 'FINISH_PROJECT';
export const SET_PROJECTS = 'SET_PROJECTS';
export const SET_HISTORYPROJECTS = 'SET_HISTORYPROJECTS';
export const DELETE_HISTORYPROJECTS = 'DELETE_HISTORYPROJECTS';

export const fetchProjects = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch(`${apiUrl}/api/projects`);

      if (!response.ok) {
        const errorResData = await response.json();
        throw new Error(errorResData.message);
      }

      const resData = await response.json();

      const loadedProjects = [];

      for (const key in resData) {
        loadedProjects.push(
          new Project(
            resData[key]._id,
            'c2',
            resData[key].supervisor,
            resData[key].title,
            resData[key].address,
            resData[key].startedDate,
            resData[key].estimatedDate,
            resData[key].estimatedBudget
          )
        );
      }

      dispatch({
        type: SET_PROJECTS,
        projects: loadedProjects,
        userProject:
          loadedProjects.find((project) => project.supervisorId === userId) ||
          [],
      });
    } catch (err) {
      throw err;
    }
  };
};

export const fetchHistoryProjects = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/projects/history/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorResData = await response.json();

      throw new Error(errorResData.message);
    }

    const resData = await response.json();

    dispatch({
      type: SET_HISTORYPROJECTS,
      userHistoryProjects: resData,
    });
  };
};

export const createProject = (
  title,
  address,
  startedDate,
  estimatedDate,
  estimatedBudget
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        address,
        startedDate,
        estimatedDate,
        estimatedBudget,
      }),
    });

    const resData = await response.json();

    dispatch({
      type: CREATE_PROJECT,
      projectData: {
        id: resData._id,
        title,
        address,
        startedDate,
        estimatedDate,
        estimatedBudget,
        supervisorId: resData.supervisor,
      },
    });
  };
};

export const updateProject = (
  id,
  title,
  address,
  startedDate,
  estimatedDate,
  estimatedBudget
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        address,
        startedDate,
        estimatedDate,
        estimatedBudget,
      }),
    });

    if (!response.ok) {
      const errorResData = await response.json();
      throw new Error(errorResData.message);
    }

    dispatch({
      type: UPDATE_PROJECT,
      id,
      projectData: {
        title,
        address,
        startedDate,
        estimatedDate,
        estimatedBudget,
      },
    });
  };
};

export const finishProject = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response1 = await fetch(`${apiUrl}/api/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response1.ok) {
      throw new Error('Something went wrong');
    }

    const { data } = await response1.json();

    dispatch({ type: FINISH_PROJECT, finishedProject: data });
  };
};

export const deleteHistoryProject = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await fetch(`${apiUrl}/api/projects/history/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorResData = await response.json();
      console.log(errorResData);
      throw new Error(errorResData.message);
    }

    dispatch({ type: DELETE_HISTORYPROJECTS, id });
  };
};
