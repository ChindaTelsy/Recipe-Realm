import { configureStore } from '@reduxjs/toolkit';
import recipesReducer from './RecipeSlice';
import userReducer from './UserSlice'

export const store = configureStore({
  reducer: {
    recipes: recipesReducer,
    user: userReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
