'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { PlusCircle, CircleUser } from 'lucide-react';
import { RootState } from '@/store/store';

export default function Headers() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation('headers');
  const user = useSelector((state: RootState) => state.user.user);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/images/RecipeRealm.png"
              alt="RecipeRealm Logo"
              width={90}
              height={60}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-12">
          {user ? (
            <>
              <Link
                href="/Home"
                className={`px-4 text-lg font-semibold transition ${pathname === '/Home' ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
                  }`}
              >
                {t('header.home')}
              </Link>
              <Link
                href="/Add-Recipe"
                className={`flex items-center gap-1 font-medium text-sm transition ${pathname === '/Add-Recipe' ? 'text-orange-600' : 'text-gray-700 hover:text-orange-500'
                  }`}
              >
                <PlusCircle className="w-6 h-6" />
              </Link>

              <Link
                href="/profile"
                className={`hover:text-orange-600 transition ${pathname === '/profile' ? 'text-orange-600' : 'text-gray-500'
                  }`}
              >
                <CircleUser className="w-6 h-6" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/"
                className={`px-4 text-lg font-semibold transition ${pathname === '/' ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'}`}
              >
                {t('header.welcome')}
              </Link>

              <Link
                href="/login"
                className={`px-4 text-lg font-semibold transition ${pathname === '/login' ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'}`}
              >
                {t('header.login')}
              </Link>

              <Link
                href="/signup"
                className={`px-4 text-lg font-semibold transition ${pathname === '/signup' ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'}`}
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
            {user ? (
              <>
                <Link
                  href="/Home"
                  onClick={toggleMenu}
                  className={`transition text-base font-normal ${pathname === '/Home' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'
                    }`}
                >
                  {t('header.home')}
                </Link>
                <Link
                  href="/Add-Recipe"
                  onClick={toggleMenu}
                  className={`flex items-center gap-1 font-medium text-base transition ${pathname === '/Add-Recipe' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-800'
                    }`}
                >
                  <PlusCircle className="w-5 h-5" /> {t('header.addRecipe')}
                </Link>

                <Link
                  href="/profile"
                  onClick={toggleMenu}
                  className={`flex items-center gap-1 transition text-base ${pathname === '/profile' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'
                    }`}
                >
                  <CircleUser className="w-5 h-5" /> {t('header.profile')}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className={`text-base font-normal transition ${pathname === '/' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
                  onClick={toggleMenu}
                >
                  {t('header.welcome')}
                </Link>
                <Link
                  href="/login"
                  className={`text-base font-normal transition ${pathname === '/login' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
                  onClick={toggleMenu}
                >
                  {t('header.login')}
                </Link>
                <Link
                  href="/signup"
                  className={`text-base font-normal transition ${pathname === '/signup' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
                  onClick={toggleMenu}
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
