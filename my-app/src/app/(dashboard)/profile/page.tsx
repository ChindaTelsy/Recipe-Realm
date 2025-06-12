"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/store/UserSlice';
import { RootState } from '@/store/store';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('profile');

  const [activeTab, setActiveTab] = useState<'my' | 'liked'>('my');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editLocation, setEditLocation] = useState(user?.location || '');

  // Debug i18next initialization
  useEffect(() => {
    console.log('ProfilePage - Current language:', i18n.language);
    console.log('ProfilePage - Available languages:', i18n.languages);
    console.log('ProfilePage - Is i18next initialized:', i18n.isInitialized);
    console.log('ProfilePage - Translation for profile.title:', t('profile.title'));
  }, [i18n, t]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const storageRef = ref(storage, `profileImages/${user.uid}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, { profileImage: downloadURL });

    dispatch(setUser({ ...user, profileImage: downloadURL }));
  };

  const saveProfile = async () => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
    const updatedData = {
      name: editName,
      bio: editBio,
      location: editLocation,
    };

    await updateDoc(userDocRef, updatedData);
    dispatch(setUser({ ...user, ...updatedData }));
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">
        <div className="text-center bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-md border border-white/20">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">{t('profile.noProfileTitle')}</h1>
          <p className="text-gray-700 mb-6">
            {t('profile.noProfileMessage')}{' '}
            <a href="/login" className="text-orange-600 font-semibold hover:text-orange-700 transition">{t('auth.login')}</a>{' '}
            {t('general.or')}{' '}
            <a href="/signup" className="text-orange-600 font-semibold hover:text-orange-700 transition">{t('auth.signup')}</a>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12">
          <div className="relative w-32 h-32 group">
            <Image
              src={user.profileImage || '/default-profile.png'}
              alt={t('profile.imageAlt')}
              fill
              className="rounded-full object-cover border-4 border-white shadow-md"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              title={t('profile.changeImage')}
            />
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-sm font-medium">{t('profile.changeImage')}</span>
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
                <p className="text-sm text-gray-500">{t('profile.joined')}: {user.joinDate}</p>
                <p className="text-sm text-gray-500">{t('profile.location')}: {user.location || t('profile.noLocation')}</p>
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
            { value: user.stats.recipes, label: t('profile.stats.recipes'), icon: '🍽️' },
            { value: user.stats.likes, label: t('profile.stats.likes'), icon: '❤️' },
            { value: user.stats.avgRating.toFixed(1), label: t('profile.stats.avgRating'), icon: '⭐' },
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
              className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                activeTab === 'my'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
              onClick={() => setActiveTab('my')}
            >
              {t('profile.tabs.myRecipes')}
            </button>
            <button
              className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                activeTab === 'liked'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
              onClick={() => setActiveTab('liked')}
            >
              {t('profile.tabs.likedRecipes')}
            </button>
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === 'my' ? user.recipes : user.likedRecipes).map((recipe) => (
            <div
              key={recipe.id}
              className="relative rounded-2xl overflow-hidden bg-white/80 backdrop-blur-md shadow-lg border border-white/20 hover:scale-105 transition-transform"
            >
              <div className="relative w-full h-48">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{recipe.title}</h3>
                <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <span>❤️</span> {recipe.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>⭐</span> {recipe.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}