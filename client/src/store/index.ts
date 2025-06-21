import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import thunk from 'redux-thunk';

// Reducers
import authReducer from './authSlice';
import projectsReducer from './projectsSlice';
import musiciansReducer from './musiciansSlice';
import sessionsReducer from './sessionsSlice';
import messagesReducer from './messagesSlice';
import uiReducer from './uiSlice';

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // only auth will be persisted
};

const rootReducer = combineReducers({
  auth: authReducer,
  projects: projectsReducer,
  musicians: musiciansReducer,
  sessions: sessionsReducer,
  messages: messagesReducer,
  ui: uiReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;