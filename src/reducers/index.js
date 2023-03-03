import { combineReducers } from 'redux';

import searchbarReducer from './searchbar';
import burgerReducer from './burger';
import connexionReducer from './connexion';
import authenticationReducer from './authentication';
import createpostformReducer from './createpostform';
import homepageReducer from './homepage';
import postReducer from './post';
import appReducer from './app';
import reviewReducer from './review';
import userProfileReducer from './userprofile';

const rootReducer = combineReducers({
  searchbar: searchbarReducer,
  burger: burgerReducer,
  connexion: connexionReducer,
  authentication: authenticationReducer,
  createpostform: createpostformReducer,
  homepage: homepageReducer,
  post: postReducer,
  app: appReducer,
  review: reviewReducer,
  userprofile: userProfileReducer,
});

export default rootReducer;
