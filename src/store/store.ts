// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import activeViewReducer from './slices/activeViewSlice';

export const store = configureStore({
  reducer: {
    activeView: activeViewReducer,
  },
});

// Optional: Types for your state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
