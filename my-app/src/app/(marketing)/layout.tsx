// src/app/(marketing)/layout.tsx
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import { ReactNode } from 'react';

export const metadata = {
  title: {
    default: 'RecipeRealm',
    template: '%s | RecipeRealm',
  },
  description: 'A recipe sharing platform featuring authentic Cameroonian cuisine and more.',
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header /> 
      {children}
      <Footer />
    </>
  );
}
