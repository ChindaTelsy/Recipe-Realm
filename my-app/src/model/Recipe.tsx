

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  liked: boolean;
  category?: string;
  createdAt?: string;
  visibleOn: VisibleOn;
  region?: string; // Add this line
  ingredients?: string[];
  instructions?: string;
}

export type VisibleOn = 'welcome' | 'home' | 'both';

