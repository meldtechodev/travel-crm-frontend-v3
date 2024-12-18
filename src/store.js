import { applyMiddleware, combineReducers, legacy_createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import packagesReducer from './reducers/packagesReducer';
import bookingReducer from './reducers/bookingReducer';
import countryReducer from './reducers/countryReducer';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: countryReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});


export default store;
