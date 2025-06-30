import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../lib/axios';

interface Recipe {
  id: string;
  title: string;
  image: string;
  likes: number;
  rating: number;
}

interface Stats {
  recipes: number;
  likes: number;
  avgRating: number;
}

interface User {
  id: string;
  name: string;
  bio: string;
  joinDate: string; // ISO string, serialized state
  profileImage?: string;
  location: string;
  stats: Stats;
  recipes: Recipe[];
  likedRecipes: Recipe[];
}

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  region: string;
  consent: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Utility function for localStorage hydration
function getFromLocalStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

// Safe token and region access
const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
const storedRegion = typeof window !== 'undefined' ? localStorage.getItem('userRegion') ?? 'Centre' : 'Centre';
const storedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;

// const storedUser = getFromLocalStorage<User>('user');

const initialState: UserState = {
  user: storedUser || null,
  token: storedToken || null,
  isAuthenticated: !!storedToken && !!storedUser,
  loading: false,
  status: 'idle',
  error: null,
  region: storedRegion,
  consent: false,
};



export const login = createAsyncThunk<
  { user: User; token: string },
  LoginCredentials,
  { rejectValue: string }
>('user/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    console.log('Attempting login with:', { email });
    const response = await axios.post('/login', { email, password }); // Updated to /api/auth/login
    const { user, token } = response.data;
    const processedUser = {
      ...user,
      joinDate: user.joinDate instanceof Date ? user.joinDate.toISOString() : user.joinDate,
    };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(processedUser));
    console.log('Login successful, stored token and user');
    return { user: processedUser, token };
  } catch (error: any) {
    console.error('Login failed:', error.response?.data);
    error.response?.data?.message.includes("password")
          ? "Incorrect password"
          : error.response?.data?.message || "Login failed";
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const fetchUser = createAsyncThunk('user/fetchUser', async (_, { getState, rejectWithValue }) => {
  const state = getState() as { user: UserState };
  const token = state.user.token || localStorage.getItem('token');
  if (!token) {
    return rejectWithValue('No token found');
  }

  try {
    const response = await axios.get('/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
  }
});

export const register = createAsyncThunk<
  { user: User; token: string },
  RegisterCredentials,
  { rejectValue: string }
>('user/register', async ({ username, email, password, password_confirmation }, { rejectWithValue }) => {
  try {
    console.log('Sending register request with:', { name: username, email });
    const response = await axios.post('/register', {
      name: username,
      email,
      password,
      password_confirmation,
    });
    const { user, token } = response.data;
    const processedUser = {
      ...user,
      joinDate: user.joinDate instanceof Date ? user.joinDate.toISOString() : user.joinDate,
    };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(processedUser));
    console.log('Registration successful, stored token and user');
    return { user: processedUser, token };
  } catch (error: any) {
    console.error('Registration failed:', error.response?.data);
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logout',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { user: UserState };
      const token = state.user.token;
      if (token) {
        await axios.post('/logout', {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('Logout successful');
    } catch (error: any) {
      console.error('Logout failed:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = {
        ...action.payload,
        stats: {
          recipes: action.payload.stats?.recipes ?? 0,
          likes: action.payload.stats?.likes ?? 0,
          avgRating: action.payload.stats?.avgRating ?? 0,
        },
        recipes: action.payload.recipes ?? [],
        likedRecipes: action.payload.likedRecipes ?? [],
      };
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('token');
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
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = {
          ...action.payload,
          recipes: action.payload.recipes?.map((recipe: any) => ({
            id: recipe.id.toString(),
            title: recipe.title,
            description: recipe.description,
            ingredients: JSON.parse(recipe.ingredients),
            steps: JSON.parse(recipe.steps),
            category_id: recipe.category_id.toString(),
            region_id: recipe.region_id.toString(),
            min_price: parseFloat(recipe.min_price),
            cook_time: recipe.cook_time,
            prep_time: recipe.prep_time,
            image: recipe.image_path,
            userId: recipe.user_id.toString(),
            user_name: recipe.user_name || action.payload.name, // Use user_name or fallback to user.name
            visibleOn: recipe.visible_on,
            rating: recipe.rating || 0,
            region: recipe.region?.name || '',
          })),
          likedRecipes: action.payload.likedRecipes?.map((recipe: any) => ({
            id: recipe.id.toString(),
            title: recipe.title,
            description: recipe.description,
            ingredients: JSON.parse(recipe.ingredients),
            steps: JSON.parse(recipe.steps),
            category_id: recipe.category_id.toString(),
            region_id: recipe.region_id.toString(),
            min_price: parseFloat(recipe.min_price),
            cook_time: recipe.cook_time,
            prep_time: recipe.prep_time,
            image: recipe.image_path,
            userId: recipe.user_id.toString(),
            user_name: recipe.user_name || action.payload.name,
            visibleOn: recipe.visible_on,
            rating: recipe.rating || 0,
            region: recipe.region?.name || '',
          })),
        };
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
      
  },
});

export const {
  setUser,
  setToken,
  clearUser,
  updateProfileImage,
  updateBio,
  addRecipe,
  setRegion,
  setConsent,
  resetError,
} = userSlice.actions;

export default userSlice.reducer;