// src/app/layout.tsx
import { ReactNode } from 'react';
import '@/styles/globals.css';
import { Providers } from "./Provider";
import { FirebaseAuthProvider } from './FirebaseAuthProvider';
import I18nProvider from '@/components/I18nProvider';


export const metadata = {
  title: 'RecipeRealm',
  description: 'Share and discover recipes',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">

      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <Providers>
          <FirebaseAuthProvider>
            <I18nProvider>
              {children}
            </I18nProvider>
          </FirebaseAuthProvider>
        </Providers>
      </body>
    </html>
  );
}
