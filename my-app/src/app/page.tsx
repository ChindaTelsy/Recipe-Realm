// src/app/page.tsx
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'RecipeRealm | Home',
  description: 'Discover delicious Cameroonian, African, and international recipes.',
  keywords: 'recipes, food, cooking, Cameroonian, African, international',
  openGraph: {
    title: 'RecipeRealm',
    description: 'Explore and share your favorite recipes from around the world.',
    url: 'https://yourdomain.com',
    siteName: 'RecipeRealm',
    images: [
      {
        url: '/images/preview.jpg',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function Home() {
  redirect('/Welcomepage'); // Redirect to the Welcome page
}
