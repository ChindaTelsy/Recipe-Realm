import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Recipe {
  id: string;
  title: string;
  image: string;
  likes: number;
  rating: number;
}

interface User {
  uid: string;
  name: string;
  bio: string;
  joinDate: string;
  profileImage?: string;
  location: string;
  stats: {
    recipes: number;
    likes: number;
    avgRating: number;
  };
  recipes: Recipe[];
  likedRecipes: Recipe[];
}

interface UserState {
  user: User | null;
  region: string;
  consent: boolean;
}

const storedRegion = typeof window !== 'undefined' ? localStorage.getItem('userRegion') : null;

const initialState: UserState = {
  user: null,
  region: storedRegion || 'Centre',
  consent: false, // Initial consent state
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
    updateProfileImage(state, action: PayloadAction<string>) {
      if (state.user) {
        state.user.profileImage = action.payload;
      }
    },
    updateBio(state, action: PayloadAction<string>) {
      if (state.user) {
        state.user.bio = action.payload;
      }
    },
    addRecipe(state, action: PayloadAction<Recipe>) {
      if (state.user) {
        state.user.recipes.push(action.payload);
        state.user.stats.recipes += 1;
      }
    },
    setRegion(state, action: PayloadAction<string>) {
      state.region = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('userRegion', action.payload);
      }
    },
    setConsent(state, action: PayloadAction<boolean>) {
      state.consent = action.payload;
    },
  },
});

export const {
  setUser,
  clearUser,
  updateProfileImage,
  updateBio,
  addRecipe,
  setRegion,
  setConsent,
} = userSlice.actions;

export default userSlice.reducer;