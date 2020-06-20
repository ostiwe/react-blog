import { createStore } from 'redux';
import { mainReducer } from './reducer';

const store = createStore(mainReducer,
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;
