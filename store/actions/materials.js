import getEnvVars from '../../environment';
const { apiUrl } = getEnvVars();

import MiniPhaseMaterial from '../../models/miniPhaseMaterial';

export const DELETE_MPHASE_MATERIAL = 'DELETE_MPHASE_MATERIAL';
export const CREATE_MPHASE_MATERIAL = 'CREATE_MPHASE_MATERIAL';
export const UPDATE_MPHASE_MATERIAL = 'UPDATE_MPHASE_MATERIAL';
export const SET_MATERIALS = 'SET_MATERIALS';
export const DELETE_MATERIALS_ONDLTMPHASE = 'DELETE_MATERIALS_ONDLTMPHASE';

export const fetchMaterials = () => {
  return async (dispatch) => {
    //any async code you want!
    try {
      const response = await fetch(`${apiUrl}/api/materials`);

      if (!response.ok) {
        const errorResData = await response.json();
        throw new Error(errorResData.message);
      }
      const resData = await response.json();
      const loadedMaterials = [];

      for (const key in resData) {
        loadedMaterials.push(
          new MiniPhaseMaterial(
            resData[key]._id,
            resData[key].miniPhase,
            resData[key].projectPhase,
            resData[key].name,
            resData[key].quantityUsed,
            resData[key].rate,
            resData[key].totalCost,
            resData[key].description
          )
        );
      }
      dispatch({ type: SET_MATERIALS, materials: loadedMaterials });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteMphaseMaterial = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/materials/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorResData = await response.json();
      throw new Error(errorResData.message);
    }

    dispatch({ type: DELETE_MPHASE_MATERIAL, materialId: id });
  };
};

export const createMphaseMaterial = (
  mPhaseId,
  projectPhaseId,
  materialName,
  quantityUsed,
  rate,
  totalCost,
  description
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    //any async code you want!
    const response = await fetch(`${apiUrl}/api/materials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mPhaseId,
        projectPhaseId,
        materialName,
        quantityUsed,
        rate,
        totalCost,
        description,
      }),
    });

    if (!response.ok) {
      const errorResData = await response.json();
      throw new Error(errorResData.message);
    }

    const resData = await response.json();

    dispatch({
      type: CREATE_MPHASE_MATERIAL,
      materialData: {
        id: resData._id,
        mPhaseId: resData.miniPhase,
        projectPhaseId: resData.projectPhase,
        materialName: resData.name,
        quantityUsed: resData.quantityUsed,
        rate: resData.rate,
        totalCost: resData.totalCost,
        description: resData.description,
      },
    });
  };
};

export const updateMphaseMaterial = (
  id,
  materialName,
  quantityUsed,
  rate,
  totalCost,
  description
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`${apiUrl}/api/materials/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        materialName,
        quantityUsed,
        rate,
        totalCost,
        description,
      }),
    });

    if (!response.ok) {
      const errorResData = await response.json();
      throw new Error(errorResData.message);
    }

    const resData = await response.json();

    dispatch({
      type: UPDATE_MPHASE_MATERIAL,
      matId: resData._id,
      materialData: {
        materialName: resData.name,
        quantityUsed: resData.quantityUsed,
        rate: resData.rate,
        totalCost: resData.totalCost,
        description: resData.description,
      },
    });
  };
};
