'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, fetchUser } from '@/store/UserSlice';
import { RootState } from '@/store/store';
import ProtectedRoute from '@/components/ProtectedRoute';
import axios from '@/lib/axios';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch } from 'redux-thunk';
import { toast } from 'react-toastify';
import { AnyAction } from '@reduxjs/toolkit';
import { FaUserCircle } from 'react-icons/fa';
import { deleteRecipeThunk } from '@/store/RecipeSlice';
import { Recipe } from '@/model/Recipe';

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.user.user);
  const token = useSelector((state: RootState) => state.user.token);
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const { t } = useTranslation('profile');

  const [activeTab, setActiveTab] = useState<'my' | 'liked'>('my');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editLocation, setEditLocation] = useState(user?.location || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const stats = user?.stats || { recipes: 0, likes: 0, avgRating: 0 };
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchUser());
    }
  }, [isAuthenticated, user, dispatch]);



  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);


  useEffect(() => {
    console.log('User state:', user, 'Stats:', user?.stats, 'Recipes:', user?.recipes, 'Liked Recipes:', user?.likedRecipes);
  }, [user]);


  const formattedJoinDate = useMemo(() => {
    if (!user?.joinDate) return t('profile.noDate');
    const date = new Date(user.joinDate);
    return isNaN(date.getTime())
      ? t('profile.noDate')
      : new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
  }, [user?.joinDate, t]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const authToken = token || localStorage.getItem('token');

    if (!file || !user || !authToken) {
      toast.error(t('profile.noFileOrUser'));
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('/profile/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authToken}`,
        },
      });

      const imageUrl = response.data.image_url;
      dispatch(setUser({ ...user, profileImage: imageUrl }));
      await dispatch(fetchUser());
      toast.success(t('profile.imageUploaded'));
    } catch (error: any) {
      console.error('Upload failed:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || t('profile.imageUploadFailed'));
    } finally {
      setIsUploading(false);
    }
  };

  const saveProfile = async () => {
    const authToken = token || localStorage.getItem('token');
    if (!user || !authToken) return;

    try {
      const response = await axios.put(
        '/profile',
        {
          name: editName,
          bio: editBio,
          location: editLocation,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      dispatch(setUser({ ...user, ...response.data }));
      setIsEditing(false);
      toast.success(t('profile.profileUpdated'));
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(t('profile.profileUpdateFailed'));
    }
  };

  const handleDelete = (recipeId: string) => {
    setShowDeleteModal(recipeId); // Show custom modal instead of confirm
  };

  const confirmDelete = async (recipeId: string) => {
    if (!token) {
      toast.error(t('profile.loginRequired', 'Please log in'));
      setShowDeleteModal(null);
      return;
    }

    setIsLoading(true);
    // Optimistic update: Remove recipe from state immediately
    if (user && activeTab === 'my') {
      dispatch(
        setUser({
          ...user,
          recipes: user.recipes?.filter((recipe) => recipe.id !== recipeId) || [],
          stats: { ...user.stats, recipes: (user.stats.recipes || 0) - 1 },
        })
      );
    } else if (user && activeTab === 'liked') {
      dispatch(
        setUser({
          ...user,
          likedRecipes: user.likedRecipes?.filter((recipe) => recipe.id !== recipeId) || [],
          stats: { ...user.stats, likes: (user.stats.likes || 0) - 1 },
        })
      );
    }

    try {
      await dispatch(deleteRecipeThunk({ recipeId, token })).unwrap();
      await dispatch(fetchUser()).unwrap(); // Refresh user data to confirm
      toast.success(t('profile.recipeDeleted', 'Recipe deleted successfully'));
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(t('profile.deleteFailed', 'Failed to delete recipe'));
      // Revert optimistic update on failure
      await dispatch(fetchUser()).unwrap();
    } finally {
      setIsLoading(false);
      setShowDeleteModal(null);
    }
  };

  if (!user) return <div>{t('profile.loading')}</div>;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-white to-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12">
            <div className="relative w-32 h-32 group">
              {user.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={t('profile.imageAlt')}
                  fill
                  className="rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <FaUserCircle className="w-full h-full text-gray-400 border-4 border-white shadow-md rounded-full" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                title={t('profile.changeImage')}
                disabled={isUploading}
              />
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium">
                  {isUploading ? t('profile.uploading') : t('profile.changeImage')}
                </span>
              </div>
            </div>

            <div className="flex-grow text-center sm:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2 text-xl font-semibold text-gray-900 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                    placeholder={t('profile.name')}
                  />
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full px-4 py-2 text-gray-700 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                    placeholder={t('profile.bio')}
                    rows={3}
                  />
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-4 py-2 text-gray-600 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                    placeholder={t('profile.location')}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-600">{user.bio || t('profile.noBio')}</p>
                  <p className="text-sm text-gray-500">
                    {t('profile.joined')}: {formattedJoinDate}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t('profile.location')}: {user.location || t('profile.noLocation')}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={saveProfile}
                    className="px-6 py-3 bg-orange-600 text-white rounded-full font-semibold hover:bg-orange-700 transition transform hover:scale-105 shadow-md"
                  >
                    {t('profile.save')}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-white/50 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-md"
                  >
                    {t('profile.cancel')}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition transform hover:scale-105 shadow-md"
                >
                  {t('profile.edit')}
                </button>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              { value: stats.recipes, label: t('profile.stats.recipes'), icon: '🍽️' },
              { value: stats.likes, label: t('profile.stats.likes'), icon: '❤️' },
              { value: stats.avgRating.toFixed(1), label: t('profile.stats.avgRating'), icon: '⭐' },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-6 bg-white/50 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 hover:scale-105 transition-transform"
              >
                <span className="text-3xl mb-2">{stat.icon}</span>
                <p className="text-2xl font-extrabold text-orange-600">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="relative flex justify-center mb-8">
            <div className="inline-flex bg-white/50 backdrop-blur-md rounded-full p-1 border border-white/20">
              <button
                className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${activeTab === 'my' ? 'bg-orange-600 text-white shadow-md' : 'text-gray-600 hover:text-orange-600'
                  }`}
                onClick={() => setActiveTab('my')}
              >
                {t('profile.tabs.myRecipes')}
              </button>
              <button
                className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${activeTab === 'liked' ? 'bg-orange-600 text-white shadow-md' : 'text-gray-600 hover:text-orange-600'
                  }`}
                onClick={() => setActiveTab('liked')}
              >
                {t('profile.tabs.likedRecipes')}
              </button>
            </div>
          </div>

          {/* Recipes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === 'my' ? user.recipes ?? [] : user.likedRecipes ?? []).length > 0 ? (
              (activeTab === 'my' ? user.recipes ?? [] : user.likedRecipes ?? []).map((recipe: Recipe) => {
                if (!recipe.id) {
                  console.error('Recipe missing id:', recipe);
                  return null;
                }
                return (
                  <div
                    key={recipe.id}
                    className="relative rounded-2xl overflow-hidden bg-white/80 backdrop-blur-md shadow-lg border border-white/20 hover:scale-105 transition-transform"
                  >
                    <div className="relative w-full h-48">
                      <Image
                        src={recipe.image || '/default-recipe.png'}
                        alt={recipe.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{recipe.title}</h3>
                      <p className="text-sm text-gray-600 truncate">{recipe.description || t('profile.noDescription')}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {t('profile.createdBy')}: {user.name}
                      </p>
                      <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <span>⭐</span> {recipe.rating?.toFixed(1) || '0.0'}
                        </span>
                        {recipe.region && (
                          <span className="text-xs text-gray-500">{recipe.region}</span>
                        )}
                      </div>
                      {activeTab === 'my' && recipe.userId === user?.id && (
                        <button
                          onClick={() => handleDelete(recipe.id)}
                          className="mt-2 w-full text-red-600 hover:text-red-800 text-sm text-center"
                          aria-label={t('profile.deleteRecipe')}
                        >
                          {t('profile.delete')}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="col-span-full text-center text-gray-500">{t('profile.noRecipes')}</p>
            )}
          </div>

                    {/* Custom Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('profile.confirmDeleteTitle', 'Confirm Deletion')}
                </h3>
                <p className="text-gray-600 mt-2">
                  {t('profile.confirmDelete', 'Are you sure you want to delete this recipe?')}
                </p>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
                    aria-label={t('profile.cancel', 'Cancel')}
                    disabled={isLoading}
                  >
                    {t('profile.cancel', 'Cancel')}
                  </button>
                  <button
                    onClick={() => confirmDelete(showDeleteModal)}
                    className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                    aria-label={t('profile.delete', 'Delete')}
                    disabled={isLoading}
                  >
                    {t('profile.delete', 'Delete')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}