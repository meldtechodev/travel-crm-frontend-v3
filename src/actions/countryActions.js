import axios from 'axios';
import api from '../apiConfig/config';

// Action Types for Packages
export const FETCH_COUNTRY = 'FETCH_COUNTRY';
export const ADD_COUNTRY = 'ADD_COUNTRY';
export const UPDATE_COUNTRY = 'UPDATE_PACKAGE';
export const DELETE_COUNTRY = 'DELETE_COUNTRY';

// Action Creators for Packages

// Fetch packages
export const fetchCountry = () => async (dispatch) => {
  try {
    const response = await axios.get(`${api.baseUrl}/country/getallcountry`);
    const format = response.data.map(item => ({
      ...item,
      label: item.countryName,
      value: item.id
    }))
    dispatch({ type: FETCH_COUNTRY, payload: format });
  } catch (error) {
    console.error('Failed to fetch Country:', error);
  }
};

// Add a package
export const addCountry = (newCountry) => async (dispatch) => {
  try {
    const response = await axios.post(`${api.baseUrl}/country/create`, newCountry);
    dispatch({ type: ADD_COUNTRY, payload: response.data });
  } catch (error) {
    console.error('Failed to add Country:', error);
  }
};

// Update a package
export const updateCountry = (id, updatedData) => async (dispatch) => {
  try {
    const response = await axios.put(`${api.baseUrl}/country/updatebyid/${id}`, updatedData);
    dispatch({ type: UPDATE_COUNTRY, payload: response.data });
  } catch (error) {
    console.error('Failed to update Country:', error);
  }
};

// Delete a package
export const deletePackage = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/packages/${id}`);
    dispatch({ type: DELETE_COUNTRY, payload: id });
  } catch (error) {
    console.error('Failed to delete package:', error);
  }
};
