import getEnvVars from '../../environment';
const { apiUrl } = getEnvVars();

import UserNote from '../../models/userNote';

export const CREATE_NOTE = 'CREATE_NOT';
export const UPDATE_NOTE = 'UPDATE_NOTE';
export const DELETE_NOTE = 'DELETE_NOTE';
export const SET_NOTES = 'SET_NOTES';

export const fetchUserNotes = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/usersnotes/mynotes`, {
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

    const loadedUsersNotes = [];
    for (const key in resData) {
      loadedUsersNotes.push(
        new UserNote(
          resData[key]._id,
          resData[key].title,
          resData[key].description,
          resData[key].images,
          resData[key].pickedDateTime,
          resData[key].notificationId,
          resData[key].user
        )
      );
    }
    dispatch({
      type: SET_NOTES,
      userNotes: loadedUsersNotes,
    });
  };
};

export const createNote = (
  title,
  description,
  images,
  pickedDateTime,
  notificationId
) => {
  console.log(images);
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;

    const response = await fetch(`${apiUrl}/api/usersnotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        images,
        pickedDateTime,
        notificationId,
        userId,
      }),
    });

    if (!response.ok) {
      const errorResData = await response.json();
      console.log(errorResData.message);
      throw new Error(errorResData.message);
    }

    const resData = await response.json();

    dispatch({
      type: CREATE_NOTE,
      noteData: {
        id: resData._id,
        title: resData.title,
        description: resData.description,
        images: resData.images,
        pickedDateTime: resData.pickedDateTime,
        notificationId: resData.notificationId,
        userId: resData.user,
      },
    });
  };
};

export const updateNote = (
  id,
  title,
  description,
  images,
  pickedDateTime,
  notificationId
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/usersnotes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        images,
        pickedDateTime,
        notificationId,
      }),
    });

    if (!response.ok) {
      const errorResData = await response.json();
      console.log(errorResData.message);
      throw new Error(errorResData.message);
    }

    const resData = await response.json();

    dispatch({
      type: UPDATE_NOTE,
      id,
      noteData: {
        id: resData._id,
        title: resData.title,
        description: resData.description,
        images: resData.images,
        pickedDateTime: resData.pickedDateTime,
        notificationId: resData.notificationId,
      },
    });
  };
};

export const deleteNote = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/usersnotes/${id}`, {
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

    dispatch({ type: DELETE_NOTE, id });
  };
};
