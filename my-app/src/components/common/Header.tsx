"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const { i18n, t } = useTranslation('auth');

  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as 'en' | 'fr' | null;
    if (savedLang) {
      setLanguage(savedLang);
      i18n.changeLanguage(savedLang); // Apply saved language on mount
    }
  }, [i18n]);

  const handleLanguageChange = (lang: 'en' | 'fr') => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    localStorage.setItem('lang', lang);
    setLangDropdownOpen(false);
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

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6 ml-auto mr-8">
          <Link
            href="/"
            className={`px-4 text-lg font-semibold transition ${pathname === '/' ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'}`}
          >
            {t('header.welcome')}
          </Link>
          <Link
            href="/Feed"
            className={`px-4 text-lg font-semibold transition ${pathname === '/Feed' ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'}`}
          >
            {t('header.feed')}
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
        </div>

        {/* Desktop Language Selector */}
        <div className="hidden md:block relative">
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
            aria-label="Select Language"
          >
            <Languages className="w-5 h-5 text-gray-600" />
          </button>
          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${language === 'en' ? 'text-orange-600 font-medium' : 'text-gray-700'}`}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange('fr')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${language === 'fr' ? 'text-orange-600 font-medium' : 'text-gray-700'}`}
              >
                Français
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center space-x-4 ml-4">
          <button
            className="md:hidden focus:outline-none"
            onClick={toggleMenu}
            aria-label={t('header.toggleMenu')}
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              href="/"
              className={`text-base font-normal transition ${pathname === '/' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
              onClick={toggleMenu}
            >
              {t('header.welcome')}
            </Link>
            <Link
              href="/Feed"
              className={`text-base font-normal transition ${pathname === '/Feed' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
              onClick={toggleMenu}
            >
              {t('header.feed')}
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

            {/* Mobile Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="w-full flex items-center px-4 py-2 text-base font-normal text-gray-600 hover:text-orange-600 focus:outline-none"
                aria-label="Select Language"
              >
                <Languages className="w-5 h-5 mr-2" /> {language === 'en' ? 'English' : 'Français'}
              </button>
              {langDropdownOpen && (
                <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${language === 'en' ? 'text-orange-600 font-medium' : 'text-gray-700'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange('fr')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${language === 'fr' ? 'text-orange-600 font-medium' : 'text-gray-700'}`}
                  >
                    Français
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}