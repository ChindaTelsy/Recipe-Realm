'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { PlusCircle, CircleUser } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function HeaderMin() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { t } = useTranslation('header');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  
  };

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

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-12">
          <Link
            href="/Home"
            className={`px-4 text-lg font-semibold transition ${pathname === '/Home' ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
              }`}
          >
            {t('header.home')}
          </Link>

          <Link
            href="/Feed"
            className={`px-4 text-lg font-semibold transition ${pathname === '/Feed' ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'}`}
          >
            {t('header.feed')}
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

          <Link
            href="/"
            className={`px-4 text-lg font-semibold transition ${pathname === '/' ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
              }`}
          >
            {t('header.logout')}
          </Link>

          
        </div>

        {/* Mobile icons */}
        <div className="flex items-center md:hidden space-x-4">
         

          <button onClick={toggleMenu}
            aria-label={t('header.toggleMenu')}
            className="text-gray-600 focus:outline-none">
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
              className={`transition text-base font-normal ${pathname === '/Home' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'
                }`}
            >
              {t('header.home')}
            </Link>
            
            <Link
              href="/Feed"
              onClick={toggleMenu}
              className={`transition text-base font-normal ${pathname === '/Feed' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'
                }`}
            >
              {t('header.feed')}
            </Link>
            
            
               <Link
              href="/Add-Recipe"
              onClick={toggleMenu}
              className={`flex items-center gap-1 font-medium text-base transition ${pathname === '/Add-Recipe' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-800'
                }`}
            >
              <PlusCircle className="w-5 h-5" /> 
            </Link>

            <Link
              href="/profile"
              onClick={toggleMenu}
              className={`flex items-center gap-1 transition text-base ${pathname === '/profile' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'
                }`}
            >
              <CircleUser className="w-5 h-5" />
            </Link>

            <Link
              href="/"
              onClick={toggleMenu}
              className={`transition text-base font-normal ${pathname === '/' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'
                }`}
            >
              {t('header.logout')}
            </Link>
         
          </div>
        </div>
      )}
    </header>
  );
}
