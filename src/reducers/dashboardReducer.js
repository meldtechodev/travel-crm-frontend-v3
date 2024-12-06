import axios from 'axios';
import { FETCH_DASHBOARD_REQUEST, FETCH_DASHBOARD_SUCCESS, FETCH_DASHBOARD_FAILURE } from './dashboardActions';

export const fetchDashboard = () => async (dispatch) => {
  dispatch({ type: FETCH_DASHBOARD_REQUEST });
  try {
    const response = await axios.get('/api/dashboard');
    dispatch({ type: FETCH_DASHBOARD_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_DASHBOARD_FAILURE, error: error.message });
  }
};
