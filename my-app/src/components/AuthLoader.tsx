'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '@/store/UserSlice';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import axios from '@/lib/axios';

export default function AuthLoader() {
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, AnyAction>>();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);

        dispatch(setUser({
          ...user,
          stats: {
            recipes: user.stats?.recipes ?? 0,
            likes: user.stats?.likes ?? 0,
            avgRating: user.stats?.avgRating ?? 0,
          },
          recipes: user.recipes ?? [],
          likedRecipes: user.likedRecipes ?? [],
        }));

        dispatch(setToken(token));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return;
      }
    }

    // Optional: API revalidation
    if (token) {
      axios.get('/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          const data = res.data;

          dispatch(setUser({
            ...data,
            stats: {
              recipes: data.stats?.recipes ?? 0,
              likes: data.stats?.likes ?? 0,
              avgRating: data.stats?.avgRating ?? 0,
            },
            recipes: data.recipes ?? [],
            likedRecipes: data.likedRecipes ?? [],
          }));
        })
        .catch((err) => {
          if (err.response?.status === 401) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            console.warn('AuthLoader: Token expired or unauthorized, clearing local storage');
          } else {
            console.warn('AuthLoader: Auth check failed (but not 401):', err.message);
          }
        });
    }
  }, [dispatch]);

  return null; // no UI rendered
}
