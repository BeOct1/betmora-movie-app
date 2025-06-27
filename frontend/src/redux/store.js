import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // adjust path as needed

const store = configureStore({
  reducer: rootReducer,
});

export default store;// ...existing code from store.js...
