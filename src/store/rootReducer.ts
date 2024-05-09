import { combineReducers } from 'redux';

import authReducer from './modules/auth/slice';
import loginReducer from './modules/auth/login';

export const rootReducer = combineReducers({
  auth: authReducer,
  login: loginReducer,
});
