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

// Utility
function getFromLocalStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

const isClient = typeof window !== 'undefined';
const storedUser = isClient ? getFromLocalStorage<User>('user') : null;
const storedToken = isClient ? localStorage.getItem('token') : null;
const storedRegion = isClient ? localStorage.getItem('userRegion') ?? 'Centre' : 'Centre';

const initialState: UserState = {
  user: storedUser || null,
  token: storedToken || null,
  isAuthenticated: !!storedUser && !!storedToken,
  loading: false,
  status: 'idle',
  error: null,
  region: storedRegion,
  consent: false,
};

// Async Thunks
export const login = createAsyncThunk<
  { user: User; token: string },
  LoginCredentials,
  { rejectValue: string }
>('user/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post('/login', { email, password });
    const { user, token } = response.data;

    const processedUser = {
      ...user,
      joinDate: user.joinDate instanceof Date ? user.joinDate.toISOString() : user.joinDate,
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(processedUser));

    console.log('Login successful, token and user stored');
    return { user: processedUser, token };
  } catch (error: any) {
    const message = error.response?.data?.message?.includes("password")
      ? "Incorrect password"
      : error.response?.data?.message || "Login failed";
    return rejectWithValue(message);
  }
});

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { user: UserState };
    const token = state.user.token || localStorage.getItem('token');

    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.get('/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = response.data?.data ?? response.data;  // <--- unwrap data here
      console.log('✅ fetchUser response:', user);
      return user;
    } catch (error: any) {
      console.error('❌ fetchUser error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);


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
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('/logout', {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return;
    } catch (error: any) {
      console.error('Logout failed:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const userSlice = createSlice({
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
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload);
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    updateLikedRecipes(state, action) {
      if (state.user) {
        state.user.likedRecipes = action.payload;
        state.user.stats = {
          ...state.user.stats,
          likes: action.payload.length,
        };
      }
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
      // .addCase(login.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.user = action.payload.user;
      //   state.token = action.payload.token;
      //   state.isAuthenticated = true;
      // })
      // .addCase(login.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string;
      // })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.status = 'succeeded';

        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed';
      })
      // .addCase(login.pending, (state) => {
      //   state.status = 'loading';
      //   state.error = null;
      // })

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
        console.error('Logout rejected:', action.payload);
        state.error = action.payload || 'Logout failed';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = 'succeeded';
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
  updateLikedRecipes,
  updateBio,
  addRecipe,
  setRegion,
  setConsent,
  resetError,
} = userSlice.actions;

export default userSlice.reducer;