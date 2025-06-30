// src/app/layout.tsx
import { ReactNode } from 'react';
import '@/styles/globals.css';
import { Providers } from "./Provider";
import { FirebaseAuthProvider } from './FirebaseAuthProvider';
import I18nProvider from '@/components/I18nProvider';
import AuthLoader from '@/components/AuthLoader';


export const metadata = {
  title: 'RecipeRealm',
  description: 'Share and discover recipes',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">

      <body className="flex flex-col min-h-screen">
        <Providers>
          <FirebaseAuthProvider>
            <I18nProvider>
              <AuthLoader />
              {children}
            </I18nProvider>
          </FirebaseAuthProvider>
        </Providers>
      </body>
    </html>
  );
}
