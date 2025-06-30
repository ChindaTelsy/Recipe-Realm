'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { PlusCircle, CircleUser } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/UserSlice';
import { RootState, AppDispatch } from '@/store/store';

export default function HeaderMin() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.user);
  const { t } = useTranslation('header');
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isProtectedPage = ['/Home', '/Profile', '/Add-Recipe'].includes(pathname);

   if (isProtectedPage && !isAuthenticated) return null;

 const handleLogout = async () => {
  try {
    // Wait for the logout action to complete first
    await dispatch(logout()).unwrap();
    
    // After state is cleared and logout is successful, redirect
    router.replace('/');
  } catch (err) {
    console.error('Logout failed:', err);
    // Optionally show a toast or message
  }
};

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            {/* <Image
              src="/images/RecipeRealm.png"
              alt="RecipeRealm Logo"
              width={90}
              height={60}
              className="object-contain"
            /> */}
            <img src="/images/RecipeRealm.png" alt="Logo" width={90} height={60} />
          </Link>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-12">
          <Link
            href="/Home"
            className={`px-4 text-lg font-semibold transition ${pathname === '/Home' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-400'
              }`}
          >
            {t('home')}
          </Link>

          <Link
            href="/Feed"
            className={`px-4 text-lg font-semibold transition ${pathname === '/Feed' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-400'
              }`}
          >
            {t('feed')}
          </Link>

          <Link
            href="/Add-Recipe"
            className={`flex items-center gap-2 font-medium text-lg transition ${pathname === '/Add-Recipe' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-400'
              }`}
          >
            <PlusCircle className="w-6 h-6" />
          </Link>

          <Link
            href="/profile"
            className={`flex items-center transition ${pathname === '/profile' ? 'text-orange-500' : 'text-gray-500 hover:text-orange-400'
              }`}
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
              {isAuthenticated && user?.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={t('profile.imageAlt')}
                  fill
                  className="object-cover"
                />
              ) : (
                <CircleUser className="w-full h-full text-gray-400" />
              )}
            </div>
          </Link>

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className={`px-4 text-lg font-semibold transition text-gray-700 hover:text-orange-400`}
            >
              {t('logout')}
            </button>
          )}
        </div>

        {/* Mobile icons */}
        <div className="flex items-center md:hidden space-x-4">
          <button
            onClick={toggleMenu}
            aria-label={t('toggleMenu')}
            className="text-gray-600 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              href="/Home"
              onClick={toggleMenu}
              className={`transition text-base font-normal ${pathname === '/Home' ? 'text-orange-500' : 'text-gray-600 hover:text-orange-400'
                }`}
            >
              {t('home')}
            </Link>

            <Link
              href="/Feed"
              onClick={toggleMenu}
              className={`transition text-base font-normal ${pathname === '/Feed' ? 'text-orange-500' : 'text-gray-600 hover:text-orange-400'
                }`}
            >
              {t('feed')}
            </Link>

            <Link
              href="/Add-Recipe"
              onClick={toggleMenu}
              className={`flex items-center gap-2 font-medium text-base transition ${pathname === '/Add-Recipe' ? 'text-orange-500' : 'text-gray-600 hover:text-orange-400'
                }`}
            >
              <PlusCircle className="w-5 h-5" />
            </Link>

            <Link
              href="/profile"
              onClick={toggleMenu}
              className={`flex items-center gap-2 transition text-base ${pathname === '/profile' ? 'text-orange-500' : 'text-gray-600 hover:text-orange-400'
                }`}
            >
              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-gray-200">
                {isAuthenticated && user?.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt={t('profile.imageAlt')}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <CircleUser className="w-full h-full text-gray-400" />
                )}
              </div>
              {t('profile')}
            </Link>

            {isAuthenticated && (
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className={`transition text-base font-normal text-gray-600 hover:text-orange-400 text-left`}
              >
                {t('logout')}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}