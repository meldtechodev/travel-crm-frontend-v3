import { combineReducers } from 'redux';
import countryReducer from './countryReducer';

const rootReducer = combineReducers({
  country: countryReducer,
});

export default rootReducer;
