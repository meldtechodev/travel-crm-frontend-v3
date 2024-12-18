import React from 'react';
import { ADD_COUNTRY, DELETE_COUNTRY, FETCH_COUNTRY, UPDATE_COUNTRY } from '../actions/countryActions';


const initialState = {
  country: [],
};


const countryReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_COUNTRY:
      return { ...state, country: action.payload };
    case ADD_COUNTRY:
      return { ...state, country: [...state.country, action.payload] };
    case UPDATE_COUNTRY:
      return {
        ...state,
        country: state.country.map((country) =>
          country.id === action.payload.id ? action.payload : country
        ),
      };
    case DELETE_COUNTRY:
      return {
        ...state,
        country: state.country.filter((country) => country.id !== action.payload),
      };
    default:
      return state;
  }
};

export default countryReducer