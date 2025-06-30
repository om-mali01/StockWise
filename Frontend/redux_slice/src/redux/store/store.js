import { configureStore } from '@reduxjs/toolkit';
import loginReducer from '../reducer/loginReducer';
import inventoryReducer from '../reducer/inventoryReducer';

const store = configureStore({
  reducer: {
    loginReducer,
    inventoryReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

export default store;