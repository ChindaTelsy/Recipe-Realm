
import Footer from '@/components/common/Footer';
import HeaderMin from '@/components/common/HeaderMin';
import { ReactNode } from 'react';

export const metadata = {
  title: {
    default: 'Home | RecipeRealm',
    template: '%s | RecipeRealm',
  },
  description: 'A recipe sharing platform featuring authentic Cameroonian cuisine and more.',
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div> 
    <HeaderMin />   
    {children}  
    
    <Footer /> 
    </div>
  );
}
