import getEnvVars from '../../environment';
const { apiUrl } = getEnvVars();

import MiniPhaseLabor from '../../models/miniPhaseLabor';

export const DELETE_MPHASE_LABOR = 'DELETE_MPHASE_LABOR';
export const CREATE_MPHASE_LABOR = 'CREATE_MPHASE_LABOR';
export const UPDATE_MPHASE_LABOR = 'UPDATE_MPHASE_LABOR';
export const SET_LABORS = 'SET_LABORS';
export const DELETE_LABORS_ONDLTMPHASE = 'DELETE_LABORS_ONDLTMPHASE';

export const fetchLabors = () => {
  return async (dispatch) => {
    // any async code you want
    try {
      const response = await fetch(`${apiUrl}/api/labors`);

      if (!response.ok) {
        const errorResData = await response.json();
        throw new Error(errorResData.message);
      }

      const resData = await response.json();
      const loadedLabors = [];
      for (const key in resData) {
        loadedLabors.push(
          new MiniPhaseLabor(
            resData[key]._id,
            resData[key].miniPhase,
            resData[key].projectPhase,
            resData[key].fName,
            resData[key].lName,
            resData[key].email,
            resData[key].phone,
            resData[key].role,
            resData[key].availability,
            resData[key].payRate,
            resData[key].amountPaid,
            resData[key].accountDetails,
            resData[key].description,
            resData[key].supervisor
          )
        );
      }

      dispatch({ type: SET_LABORS, labors: loadedLabors });
    } catch (err) {
      //send to custom analytics server
      // if you are only throwing no need of try catch block
      throw err;
    }
  };
};

export const deleteMphaseLabor = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/labors/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorResData = await response.json();
      throw new Error(errorResData.message);
    }

    dispatch({ type: DELETE_MPHASE_LABOR, laborId: id });
  };
};

export const createMphaseLabor = (
  mPhaseId,
  projectPhaseId,
  fName,
  lName,
  email,
  phone,
  role,
  payRate,
  availability,
  amountPaid,
  accountDetails,
  description
) => {
  return async (dispatch, getState) => {
    const supervisorId = getState().auth.userId;
    const token = getState().auth.token;
    // any async code you want
    const response = await fetch(`${apiUrl}/api/labors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fName,
        lName,
        email,
        phone,
        role,
        payRate,
        availability,
        accountDetails,
        amountPaid,
        supervisorId,
        projectPhaseId,
        mPhaseId,
        description,
      }),
    });

    if (!response.ok) {
      const errorResData = await response.json();
      throw new Error(errorResData.message);
    }

    const resData = await response.json();

    dispatch({
      type: CREATE_MPHASE_LABOR,
      laborData: {
        id: resData._id,
        mPhaseId: resData.miniPhase,
        projectPhaseId: resData.projectPhase,
        fName: resData.fName,
        lName: resData.lName,
        email: resData.email,
        phone: resData.phone,
        role: resData.role,
        payRate: resData.payRate,
        availability: resData.availability,
        amountPaid: resData.amountPaid,
        accountDetails: resData.accountDetails,
        description: resData.description,
        supervisorId: resData.supervisor,
      },
    });
  };
};

export const updateMphaseLabor = (
  id,
  fName,
  lName,
  email,
  phone,
  role,
  payRate,
  availability,
  amountPaid,
  accountDetails,
  description
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await fetch(`${apiUrl}/api/labors/${id}`, {
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
        role,
        payRate,
        availability,
        amountPaid,
        accountDetails,
        description,
      }),
    });

    if (!response.ok) {
      const errorResData = await response.json();
      throw new Error(errorResData.message);
    }

    const resData = await response.json();

    dispatch({
      type: UPDATE_MPHASE_LABOR,
      lid: id,
      laborData: {
        fName: resData.fName,
        lName: resData.lName,
        email: resData.email,
        phone: resData.phone,
        role: resData.role,
        payRate: resData.payRate,
        availability: resData.availability,
        amountPaid: resData.amountPaid,
        accountDetails: resData.accountDetails,
        description: resData.description,
      },
    });
  };
};
