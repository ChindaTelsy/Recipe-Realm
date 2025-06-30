'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { PlusCircle, CircleUser } from 'lucide-react';
import { RootState, AppDispatch } from '@/store/store';
import { clearUser } from '@/store/UserSlice';

export default function Headers() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslation('headers');
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.user.token);
  const isAuthenticated = !!token;

  const fromParam = searchParams.get('from');
  const isFromWelcome = pathname === '/' || fromParam === 'welcome';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLinkClick = () => {
    setIsMenuOpen(false); // Close mobile menu on link click
  };

  const handleLogout = () => {
    dispatch(clearUser());
    router.push('/login');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" onClick={handleLinkClick}>
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

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-12">
          {isAuthenticated && !isFromWelcome ? (
            <>
              <Link
                href="/Home"
                className={`px-4 text-lg font-semibold transition ${
                  pathname === '/Home' ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
                }`}
              >
                {t('header.home')}
              </Link>
              <Link
                href="/Add-Recipe"
                className={`flex items-center gap-1 font-medium text-sm transition ${
                  pathname === '/Add-Recipe' ? 'text-orange-600' : 'text-gray-700 hover:text-orange-500'
                }`}
              >
                <PlusCircle className="w-6 h-6" />
              </Link>
              <Link
                href="/profile"
                className={`hover:text-orange-600 transition ${
                  pathname === '/profile' ? 'text-orange-600' : 'text-gray-500'
                }`}
              >
                <CircleUser className="w-6 h-6" />
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 text-lg font-semibold text-gray-700 hover:text-orange-600 transition"
              >
                {t('header.logout')}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/"
                className={`px-4 text-lg font-semibold transition ${
                  pathname === '/' ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
                }`}
                onClick={handleLinkClick}
              >
                {t('header.welcome')}
              </Link>
              <Link
                href="/login"
                className={`px-4 text-lg font-semibold transition ${
                  pathname === '/login' ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
                }`}
                onClick={handleLinkClick}
              >
                {t('header.login')}
              </Link>
              <Link
                href="/signup"
                className={`px-4 text-lg font-semibold transition ${
                  pathname === '/signup' ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
                }`}
                onClick={handleLinkClick}
              >
                {t('header.signup')}
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center md:hidden">
          <button
            onClick={toggleMenu}
            aria-label={t('header.toggleMenu')}
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
            {isAuthenticated && !isFromWelcome ? (
              <>
                <Link
                  href="/Home"
                  onClick={handleLinkClick}
                  className={`transition text-base font-normal ${
                    pathname === '/Home' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  {t('header.home')}
                </Link>
                <Link
                  href="/Add-Recipe"
                  onClick={handleLinkClick}
                  className={`flex items-center gap-1 font-medium text-base transition ${
                    pathname === '/Add-Recipe' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-800'
                  }`}
                >
                  <PlusCircle className="w-5 h-5" /> {t('header.addRecipe')}
                </Link>
                <Link
                  href="/profile"
                  onClick={handleLinkClick}
                  className={`flex items-center gap-1 transition text-base ${
                    pathname === '/profile' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  <CircleUser className="w-5 h-5" /> {t('header.profile')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-base font-normal text-gray-600 hover:text-orange-600 transition text-left"
                >
                  {t('header.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  onClick={handleLinkClick}
                  className={`text-base font-normal transition ${
                    pathname === '/' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  {t('header.welcome')}
                </Link>
                <Link
                  href="/login"
                  onClick={handleLinkClick}
                  className={`text-base font-normal transition ${
                    pathname === '/login' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  {t('header.login')}
                </Link>
                <Link
                  href="/signup"
                  onClick={handleLinkClick}
                  className={`text-base font-normal transition ${
                    pathname === '/signup' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  {t('header.signup')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}