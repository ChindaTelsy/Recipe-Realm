// src/app/(marketing)/layout.tsx
import Footer from '@/components/common/Footer';
import Headers from '@/components/common/Headers';

import { ReactNode } from 'react';

export const metadata = {
  title: {
    default: 'RecipeRealm',
    template: '%s | RecipeRealm',
  },
  description: 'A recipe sharing platform featuring authentic Cameroonian cuisine and more.',
};

export default function RecipeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Headers /> 
      {children}
      <Footer />
    </>
  );
}
