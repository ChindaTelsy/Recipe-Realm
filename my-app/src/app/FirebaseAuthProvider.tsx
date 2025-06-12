'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '@/store/UserSlice';

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data() as {
              name?: string;
              bio?: string;
              joinDate?: string;
              profileImage?: string;
              location?: string;
              stats?: {
                recipes: number;
                likes: number;
                avgRating: number;
              };
              recipes?: any[];
              likedRecipes?: any[];
            };

            dispatch(setUser({
              uid: user.uid,
              name: userData.name ?? '',
              bio: userData.bio ?? '',
              joinDate: userData.joinDate ?? '',
              profileImage: userData.profileImage ?? '',
              location: userData.location ?? '',
              stats: userData.stats ?? { recipes: 0, likes: 0, avgRating: 0 },
              recipes: userData.recipes ?? [],
              likedRecipes: userData.likedRecipes ?? [],
            }));
          } else {
            dispatch(clearUser());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          dispatch(clearUser());
        }
      } else {
        dispatch(clearUser());
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) return <div>Loading...</div>; // Optional UX

  return <>{children}</>;
}
