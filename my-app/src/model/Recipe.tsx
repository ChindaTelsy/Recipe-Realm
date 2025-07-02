

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  image: string;
  // image_path?: string;
  rating: number;
  liked?: boolean;
  likes?: number;
  category?: string;
  createdAt?: string;
  visibleOn?: VisibleOn;
  region?: string;
  ingredients?: string[];
  steps?: string[];
  minPrice?: string;
  cookTime?: string;
  prepTime?: string;
  userId?: string;
  user_name?: string;
  reviews?: { id: number; user: string; rating: number }[];
  
}

export type VisibleOn = 'welcome' | 'home' | 'both';

