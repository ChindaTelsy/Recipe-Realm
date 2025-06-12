"use client";

import PrivacyPolicyModal from '@/components/common/PrivacyPolicyModal';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const [isModalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation('footer');

  return (
    <footer className="bg-gradient-to-b from-white to-white  py-6 mt-6 ">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-white  p-6 md:p-8 ">
          <p className="text-center text-gray-700 text-lg md:text-xl font-medium mb-6">
            <strong className="text-orange-700 font-bold">RecipeRealm</strong> {t('footer.description')}
          </p>

          {/* Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center sm:text-left md:gap-12">
            {/* Quick Links */}
            <div>
              <h3 className="text-gray-800 font-semibold text-sm sm:text-base mb-2">{t('footer.quickLinks')}</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>
                  <Link href="/about" className="hover:text-orange-600 hover:underline transition duration-150">
                    {t('footer.aboutUs')}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="hover:text-orange-600 hover:underline transition duration-150 text-left"
                  >
                    {t('footer.privacyPolicy')}
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-gray-800 font-semibold text-sm sm:text-base mb-2">{t('footer.contactUs')}</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>
                  {t('footer.email')}:{' '}
                  <a
                    href="mailto:support@reciperealm.com"
                    className="hover:text-orange-600 hover:underline transition duration-150"
                  >
                    support@reciperealm.com
                  </a>
                </li>
                <li>
                  {t('footer.phone')}:{' '}
                  <a
                    href="tel:+237691753588"
                    className="hover:text-orange-600 hover:underline transition duration-150"
                  >
                    +237 691753588
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <hr className="my-6 border-orange-100" />

          <p className="text-center text-gray-400 text-xs sm:text-sm">
            © {new Date().getFullYear()} RecipeRealm. {t('footer.copyright')}
          </p>
        </div>
      </div>

      <PrivacyPolicyModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </footer>
  );
}
