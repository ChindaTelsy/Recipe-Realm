

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recipe, VisibleOn } from '@/model/Recipe';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../lib/axios';
import { log } from 'console';
import { fetchUser, updateLikedRecipes } from './UserSlice';

interface RecipesState {
  recipes: Recipe[];
  recommendedRecipes: Recipe[];
  userRecipes: Recipe[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Payload for addRecipe: excludes id and createdAt, includes optional fields
// type AddRecipePayload = Omit<Partial<Recipe>, 'id' | 'createdAt'> & {
//   id: string;
//   title: string;
//   description: string;
//   image: string;
//   ingredients: string[];
//   steps: string[];
//   category: string;
//   createdAt: string;
//   minPrice: string;
//   cookTime: string;
//   prepTime: string;
//   visibleOn: VisibleOn;
//   userId?: string;
//   region: string;
// };

const initialRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Ndole',
    description: 'A bitterleaf stew with peanuts and meat.',
    image: '/images/Ndole-1.webp',
    rating: 5,
    liked: false,
    category: 'west',
    createdAt: '2024-05-01T12:00:00Z',
    visibleOn: 'both',
    region: 'centre',
    ingredients: ['bitterleaf', 'peanuts', 'beef', 'onions', 'palm oil'],
    steps: ['Wash bitterleaf thoroughly.', 'Boil beef with onions.', 'Grind peanuts and add to stew.', 'Simmer with palm oil.'],
    minPrice: '1000',
    cookTime: '60 min',
    prepTime: '30 min',
    userId: '1',
  },
  {
    id: '2',
    title: 'Eru',
    description: 'A flavorful mix of green leaves and water fufu.',
    image: '/images/Eru.jpeg',
    rating: 4,
    liked: false,
    category: 'southWest',
    createdAt: '2024-05-03T08:00:00Z',
    visibleOn: 'welcome',
    region: 'southwest',
    ingredients: ['eru leaves', 'waterleaf', 'palm oil', 'crayfish', 'cow skin'],
    steps: ['Boil eru and waterleaf.', 'Add palm oil and crayfish.', 'Simmer with cow skin.', 'Serve with water fufu.'],
    minPrice: '800',
    cookTime: '45 min',
    prepTime: '20 min',
    userId: '2',
  },
  {
    id: '3',
    title: 'Jollof Rice',
    description: 'Classic West African rice cooked in spicy tomato sauce.',
    image: '/images/jolof-rice.jpeg',
    rating: 4,
    liked: false,
    category: 'westAfrican',
    createdAt: '2024-05-28T09:30:00Z',
    visibleOn: 'both',
    region: 'westAfrican',
    ingredients: ['rice', 'tomatoes', 'peppers', 'onions', 'chicken'],
    steps: ['Blend tomatoes and peppers.', 'Fry onions and paste.', 'Add rice and stock.', 'Cook until tender.'],
    minPrice: '700',
    cookTime: '40 min',
    prepTime: '15 min',
    userId: '2',
  },
  {
    id: '4',
    title: 'Fufu & Light Soup',
    description: 'Ghanaian fufu served with spicy light soup.',
    image: '/images/Fufu-and-light-soup.jpeg',
    rating: 3,
    liked: false,
    category: 'westAfrican',
    createdAt: '2024-05-10T14:00:00Z',
    visibleOn: 'both',
    region: 'westAfrican',
    ingredients: ['cassava', 'plantain', 'tomatoes', 'goat meat', 'ginger'],
    steps: ['Boil cassava and plantain.', 'Pound into fufu.', 'Cook tomatoes and goat meat.', 'Add spices and simmer.'],
    minPrice: '900',
    cookTime: '50 min',
    prepTime: '25 min',
    userId: '1',
  },
  {
    id: '5',
    title: 'Spaghetti Bolognese',
    description: 'Italian classic with rich meat sauce.',
    image: '/images/spaghetti-bolognese.jpeg',
    rating: 5,
    liked: false,
    category: 'international',
    createdAt: '2024-05-11T15:00:00Z',
    visibleOn: 'both',
    region: 'international',
    ingredients: ['spaghetti', 'ground beef', 'tomatoes', 'onions', 'parmesan'],
    steps: ['Boil spaghetti.', 'Cook beef with onions.', 'Add tomato sauce.', 'Serve with parmesan.'],
    minPrice: '1200',
    cookTime: '30 min',
    prepTime: '15 min',
    userId: '2',
  },
  {
    id: '6',
    title: 'Chicken Curry',
    description: 'Aromatic curry with tender chicken pieces.',
    image: '/images/chickencurry.jpeg',
    rating: 4,
    liked: false,
    category: 'international',
    createdAt: '2024-05-12T10:00:00Z',
    visibleOn: 'both',
    region: 'international',
    ingredients: ['chicken', 'curry powder', 'coconut milk', 'onions', 'garlic'],
    steps: ['Marinate chicken with spices.', 'Fry onions and garlic.', 'Add coconut milk.', 'Simmer until cooked.'],
    minPrice: '1100',
    cookTime: '35 min',
    prepTime: '20 min',
    userId: '1',
  },
  {
    id: '7',
    title: 'Puff Puff',
    description: 'A local breakfast with a beautiful texture.',
    image: '/images/puff-puff.jpeg',
    rating: 4,
    liked: false,
    category: 'snacks',
    createdAt: '2024-05-13T11:00:00Z',
    visibleOn: 'both',
    region: 'centre',
    ingredients: ['flour', 'sugar', 'yeast', 'water', 'oil'],
    steps: ['Mix flour, sugar, and yeast.', 'Add water to form dough.', 'Fry in hot oil.', 'Drain and serve.'],
    minPrice: '200',
    cookTime: '20 min',
    prepTime: '10 min',
    userId: '2',
  },
  {
    id: '8',
    title: 'Folere',
    description: 'Local refreshing drink to brighten your day.',
    image: '/images/Folere.jpg',
    rating: 4,
    liked: false,
    category: 'drinks',
    createdAt: '2024-05-14T16:00:00Z',
    visibleOn: 'both',
    region: 'centre',
    ingredients: ['hibiscus flowers', 'sugar', 'water', 'ginger', 'pineapple'],
    steps: ['Boil hibiscus flowers.', 'Add sugar and ginger.', 'Strain and cool.', 'Serve chilled.'],
    minPrice: '300',
    cookTime: '15 min',
    prepTime: '10 min',
    userId: '2',
  },
  {
    id: '9',
    title: 'Achu Soup',
    description: 'Yellow soup served with pounded cocoyam.',
    image: '/images/achu.jpg',
    rating: 5,
    liked: false,
    category: 'northWest',
    createdAt: '2024-05-15T13:00:00Z',
    visibleOn: 'both',
    region: 'northwest',
    ingredients: ['cocoyam', 'palm oil', 'limestone', 'beef', 'spices'],
    steps: ['Pound cocoyam.', 'Boil beef with spices.', 'Mix limestone and palm oil.', 'Combine and serve.'],
    minPrice: '1000',
    cookTime: '60 min',
    prepTime: '30 min',
    userId: '1',
  },
  {
    id: '10',
    title: 'Mbongo Tchobi',
    description: 'Black sauce made from burnt spices and fish.',
    image: '/images/mbongo.jpg',
    rating: 5,
    liked: false,
    category: 'littoral',
    createdAt: '2024-05-16T10:30:00Z',
    visibleOn: 'both',
    region: 'littoral',
    ingredients: ['fish', 'mbongo spice', 'tomatoes', 'onions', 'palm oil'],
    steps: ['Burn mbongo spice.', 'Fry onions and tomatoes.', 'Add fish and palm oil.', 'Simmer and serve.'],
    minPrice: '900',
    cookTime: '40 min',
    prepTime: '20 min',
    userId: '1',
  },
  {
    id: '11',
    title: 'Kilishi',
    description: 'Spicy dried meat snack from the north.',
    image: '/images/kilishi.jpeg',
    rating: 4,
    liked: false,
    category: 'snacks',
    createdAt: '2024-05-17T09:00:00Z',
    visibleOn: 'both',
    region: 'north',
    ingredients: ['beef', 'peanuts', 'spices', 'salt', 'ginger'],
    steps: ['Slice beef thinly.', 'Marinate with spices.', 'Dry in sun or oven.', 'Grind peanuts and coat.'],
    minPrice: '500',
    cookTime: '120 min',
    prepTime: '30 min',
    userId: '2',
  },
  {
    id: '12',
    title: 'Kati Kati',
    description: 'Grilled chicken with palm oil and huckleberry.',
    image: '/images/kati.jpeg',
    rating: 5,
    liked: false,
    category: 'northWest',
    createdAt: '2024-05-18T17:00:00Z',
    visibleOn: 'both',
    region: 'northwest',
    ingredients: ['chicken', 'huckleberry', 'palm oil', 'onions', 'spices'],
    steps: ['Marinate chicken.', 'Grill until cooked.', 'Cook huckleberry with palm oil.', 'Serve together.'],
    minPrice: '1000',
    cookTime: '45 min',
    prepTime: '20 min',
    userId: '2',
  },
  {
    id: '13',
    title: 'Makayabu',
    description: 'Salted fish with vegetables, popular in Central Africa.',
    image: '/images/makayabu.jpg',
    rating: 4,
    liked: false,
    category: 'centralAfrican',
    createdAt: '2024-05-19T14:00:00Z',
    visibleOn: 'both',
    region: 'centralAfrican',
    ingredients: ['salted fish', 'onions', 'tomatoes', 'peppers', 'oil'],
    steps: ['Soak fish to reduce salt.', 'Fry onions and peppers.', 'Add tomatoes and fish.', 'Simmer and serve.'],
    minPrice: '800',
    cookTime: '30 min',
    prepTime: '15 min',
    userId: '1',
  },
  {
    id: '14',
    title: 'Mandazi',
    description: 'East African fried dough snack.',
    image: '/images/mandazi.jpeg',
    rating: 4,
    liked: false,
    category: 'snacks',
    createdAt: '2024-05-20T08:30:00Z',
    visibleOn: 'both',
    region: 'eastAfrican',
    ingredients: ['flour', 'sugar', 'coconut milk', 'yeast', 'oil'],
    steps: ['Mix flour, sugar, and yeast.', 'Add coconut milk.', 'Knead and fry.', 'Drain and serve.'],
    minPrice: '200',
    cookTime: '20 min',
    prepTime: '15 min',
    userId: '1',
  },
  {
    id: '15',
    title: 'Chakalaka',
    description: 'Spicy vegetable relish from South Africa.',
    image: '/images/chakalaka.jpeg',
    rating: 4,
    liked: false,
    category: 'southAfrican',
    createdAt: '2024-05-21T11:00:00Z',
    visibleOn: 'both',
    region: 'southAfrican',
    ingredients: ['beans', 'peppers', 'carrots', 'tomatoes', 'spices'],
    steps: ['Chop vegetables.', 'Fry peppers and carrots.', 'Add beans and spices.', 'Simmer and serve.'],
    minPrice: '400',
    cookTime: '25 min',
    prepTime: '15 min',
    userId: '2',
  },
  {
    id: '16',
    title: 'Chocolate Cake',
    description: 'Decadent dessert with a gooey chocolate center.',
    image: '/images/chococake.jpeg',
    rating: 5,
    liked: false,
    category: 'desserts',
    createdAt: '2024-05-22T19:00:00Z',
    visibleOn: 'both',
    region: 'international',
    ingredients: ['flour', 'cocoa', 'sugar', 'eggs', 'butter'],
    steps: ['Mix dry ingredients.', 'Add eggs and butter.', 'Bake at 180°C.', 'Cool and serve.'],
    minPrice: '1500',
    cookTime: '40 min',
    prepTime: '20 min',
    userId: '1',
  },
  {
    id: '17',
    title: 'Fruit Salad',
    description: 'Fresh fruits served with chilled yogurt.',
    image: '/images/fruitsalad.jpg',
    rating: 4,
    liked: false,
    category: 'desserts',
    createdAt: '2024-05-23T07:00:00Z',
    visibleOn: 'both',
    region: 'international',
    ingredients: ['mango', 'banana', 'pineapple', 'yogurt', 'honey'],
    steps: ['Chop fruits.', 'Mix with yogurt.', 'Drizzle honey.', 'Chill and serve.'],
    minPrice: '600',
    cookTime: '0 min',
    prepTime: '10 min',
    userId: '2',
  },
  {
    id: '18',
    title: 'Yassa',
    description: 'A Senegalese dish made with marinated chicken or fish.',
    image: '/images/yassa.jpeg',
    rating: 4,
    liked: false,
    category: 'westAfrican',
    createdAt: '2024-05-24T10:00:00Z',
    visibleOn: 'both',
    region: 'senegal',
    ingredients: ['chicken', 'onions', 'mustard', 'lemon', 'rice'],
    steps: ['Marinate chicken with mustard.', 'Fry onions.', 'Add chicken and lemon.', 'Serve with rice.'],
    minPrice: '1000',
    cookTime: '45 min',
    prepTime: '20 min',
    userId: '2',
  },
  {
    id: '19',
    title: 'Egusi Soup',
    description: 'Ground melon seed soup with vegetables and meat.',
    image: '/images/egusi.jpeg',
    rating: 5,
    liked: false,
    category: 'westAfrican',
    createdAt: '2024-05-25T12:00:00Z',
    visibleOn: 'both',
    region: 'nigeria',
    ingredients: ['egusi seeds', 'spinach', 'beef', 'palm oil', 'crayfish'],
    steps: ['Grind egusi seeds.', 'Boil beef.', 'Fry palm oil with egusi.', 'Add spinach and serve.'],
    minPrice: '900',
    cookTime: '50 min',
    prepTime: '25 min',
    userId: '2',
  },
  {
    id: '20',
    title: 'Shawarma',
    description: 'Middle Eastern wrap with spiced meat.',
    image: '/images/shawarma.png',
    rating: 4,
    liked: false,
    category: 'international',
    createdAt: '2024-05-26T18:00:00Z',
    visibleOn: 'both',
    region: 'international',
    ingredients: ['chicken', 'pita bread', 'garlic sauce', 'lettuce', 'tomatoes'],
    steps: ['Marinate chicken.', 'Grill meat.', 'Assemble in pita.', 'Add sauce and serve.'],
    minPrice: '700',
    cookTime: '20 min',
    prepTime: '15 min',
    userId: '2',
  },
  {
    id: '21',
    title: 'Okok',
    description: 'Cassava leaves cooked with peanuts and palm oil.',
    image: '/images/okok.webp',
    rating: 4,
    liked: false,
    category: 'east',
    createdAt: '2024-05-27T10:00:00Z',
    visibleOn: 'both',
    region: 'east',
    ingredients: ['cassava leaves', 'peanuts', 'palm oil', 'fish', 'spices'],
    steps: ['Boil cassava leaves.', 'Grind peanuts.', 'Add palm oil and fish.', 'Simmer and serve.'],
    minPrice: '800',
    cookTime: '50 min',
    prepTime: '25 min',
    userId: '2',
  },
  {
    id: '22',
    title: 'Sanga',
    description: 'A traditional dish made with fresh corn and cassava leaves.',
    image: '/images/sanga.webp',
    rating: 4,
    liked: false,
    category: 'centre',
    createdAt: '2024-05-27T11:00:00Z',
    visibleOn: 'both',
    region: 'centre',
    ingredients: ['corn', 'cassava leaves', 'palm oil', 'onions', 'spices'],
    steps: ['Grind corn.', 'Boil cassava leaves.', 'Mix with palm oil.', 'Cook and serve.'],
    minPrice: '600',
    cookTime: '40 min',
    prepTime: '20 min',
    userId: '2',
  },
  {
    id: '23',
    title: 'Yaourt',
    description: 'Fermented milk, a Fulani traditional drink.',
    image: '/images/Yaourt.jpeg',
    rating: 3,
    liked: false,
    category: 'drinks',
    createdAt: '2024-05-27T12:00:00Z',
    visibleOn: 'both',
    region: 'adamawa',
    ingredients: ['milk', 'starter culture', 'sugar'],
    steps: ['Heat milk.', 'Add starter culture.', 'Ferment overnight.', 'Sweeten and serve.'],
    minPrice: '300',
    cookTime: '0 min',
    prepTime: '15 min',
    userId: '2',
  },
  {
    id: '24',
    title: 'Lahoh with Suqaar',
    description: 'Somali spongy bread served with stir-fried meat.',
    image: '/images/lahoh.jpeg',
    rating: 4,
    liked: false,
    category: 'eastAfrican',
    createdAt: '2024-05-27T13:00:00Z',
    visibleOn: 'both',
    region: 'somalia',
    ingredients: ['flour', 'water', 'beef', 'spices', 'onions'],
    steps: ['Mix flour and water.', 'Cook lahoh on griddle.', 'Stir-fry beef with spices.', 'Serve together.'],
    minPrice: '900',
    cookTime: '30 min',
    prepTime: '20 min',
    userId: '2',
  },
  {
    id: '25',
    title: 'Nyama Choma',
    description: 'Kenyan roasted meat often enjoyed with kachumbari.',
    image: '/images/Nyama-Choma.jpg',
    rating: 5,
    liked: false,
    category: 'eastAfrican',
    createdAt: '2024-05-27T14:00:00Z',
    visibleOn: 'both',
    region: 'kenya',
    ingredients: ['goat meat', 'salt', 'tomatoes', 'onions', 'chili'],
    steps: ['Marinate meat with salt.', 'Grill over charcoal.', 'Chop tomatoes and onions.', 'Serve with kachumbari.'],
    minPrice: '1200',
    cookTime: '60 min',
    prepTime: '15 min',
    userId: '1',
  },
  {
    id: '26',
    title: 'Matapa',
    description: 'Mozambican stew made with cassava leaves, garlic, and coconut milk.',
    image: '/images/Matapa.webp',
    rating: 4,
    liked: false,
    category: 'southAfrican',
    createdAt: '2024-05-27T15:00:00Z',
    visibleOn: 'both',
    region: 'mozambique',
    ingredients: ['cassava leaves', 'coconut milk', 'garlic', 'peanuts', 'shrimp'],
    steps: ['Boil cassava leaves.', 'Add coconut milk and garlic.', 'Mix in peanuts.', 'Cook shrimp and serve.'],
    minPrice: '800',
    cookTime: '40 min',
    prepTime: '20 min',
    userId: '2',
  },
  {
    id: '27',
    title: 'Tagine',
    description: 'Moroccan stew made with meat and dried fruits.',
    image: '/images/tagine.jpeg',
    rating: 5,
    liked: false,
    category: 'northAfrican',
    createdAt: '2024-05-27T16:00:00Z',
    visibleOn: 'both',
    region: 'morocco',
    ingredients: ['lamb', 'apricots', 'onions', 'spices', 'almonds'],
    steps: ['Marinate lamb with spices.', 'Fry onions.', 'Add apricots and simmer.', 'Garnish with almonds.'],
    minPrice: '1300',
    cookTime: '90 min',
    prepTime: '30 min',
    userId: '2',
  },
  {
    id: '28',
    title: 'Strawberry Milkshake',
    description: 'A creamy and sweet beverage made with fresh strawberries and milk.',
    image: '/images/strawberry.webp',
    rating: 4,
    liked: false,
    category: 'drinks',
    createdAt: '2024-05-27T17:00:00Z',
    visibleOn: 'both',
    region: 'international',
    ingredients: ['strawberries', 'milk', 'ice cream', 'sugar'],
    steps: ['Blend strawberries with milk.', 'Add ice cream.', 'Sweeten to taste.', 'Serve chilled.'],
    minPrice: '500',
    cookTime: '0 min',
    prepTime: '5 min',
    userId: '2',
  },
  {
    id: '29',
    title: 'Beignets Manioc',
    description: 'Cassava fritters common in Central Africa.',
    image: '/images/accracasava.jpg',
    rating: 3,
    liked: false,
    category: 'snacks',
    createdAt: '2024-05-27T18:00:00Z',
    visibleOn: 'both',
    region: 'centralAfrican',
    ingredients: ['cassava', 'flour', 'sugar', 'oil', 'water'],
    steps: ['Grate cassava.', 'Mix with flour and sugar.', 'Fry in hot oil.', 'Drain and serve.'],
    minPrice: '200',
    cookTime: '20 min',
    prepTime: '15 min',
    userId: '2',
  },
  {
    id: '30',
    title: 'Kelewele',
    description: 'Spicy fried plantains popular in Ghana.',
    image: '/images/kelewele.jpeg',
    rating: 4,
    liked: false,
    category: 'snacks',
    createdAt: '2024-05-27T19:00:00Z',
    visibleOn: 'both',
    region: 'ghana',
    ingredients: ['plantains', 'ginger', 'chili', 'oil', 'salt'],
    steps: ['Slice plantains.', 'Marinate with spices.', 'Fry in hot oil.', 'Drain and serve.'],
    minPrice: '300',
    cookTime: '15 min',
    prepTime: '10 min',
    userId: '1',
  },
  {
    id: '31',
    title: 'Tiramisu',
    description: 'Classic Italian dessert with coffee and mascarpone.',
    image: '/images/tiramisu.jpg',
    rating: 5,
    liked: false,
    category: 'desserts',
    createdAt: '2024-05-27T20:00:00Z',
    visibleOn: 'both',
    region: 'international',
    ingredients: ['mascarpone', 'coffee', 'ladyfingers', 'cocoa', 'sugar'],
    steps: ['Dip ladyfingers in coffee.', 'Layer with mascarpone.', 'Chill overnight.', 'Dust with cocoa.'],
    minPrice: '1500',
    cookTime: '0 min',
    prepTime: '30 min',
    userId: '2',
  },
  {
    id: '32',
    title: 'Crepes Suzette',
    description: 'French crepes flambéed in orange liqueur.',
    image: '/images/CrepesSuzette.jpeg',
    rating: 4,
    liked: false,
    category: 'desserts',
    createdAt: '2024-05-27T21:00:00Z',
    visibleOn: 'both',
    region: 'international',
    ingredients: ['flour', 'eggs', 'orange juice', 'butter', 'liqueur'],
    steps: ['Make crepe batter.', 'Cook crepes.', 'Prepare orange sauce.', 'Flambé and serve.'],
    minPrice: '1200',
    cookTime: '20 min',
    prepTime: '15 min',
    userId: '2',
  },
  {
    id: '33',
    title: 'Tapioca Pudding',
    description: 'Chilled dessert with tapioca pearls and coconut milk.',
    image: '/images/tapioca-Pudding.jpeg',
    rating: 3,
    liked: false,
    category: 'desserts',
    createdAt: '2024-05-27T22:00:00Z',
    visibleOn: 'both',
    region: 'international',
    ingredients: ['tapioca pearls', 'coconut milk', 'sugar', 'vanilla'],
    steps: ['Soak tapioca pearls.', 'Boil with coconut milk.', 'Sweeten and cool.', 'Serve chilled.'],
    minPrice: '600',
    cookTime: '20 min',
    prepTime: '10 min',
    userId: '2',
  },
  {
    id: '34',
    title: 'Naan & Butter Chicken',
    description: 'Indian bread served with creamy spiced chicken.',
    image: '/images/naan-butter-chicken.jpeg',
    rating: 5,
    liked: false,
    category: 'international',
    createdAt: '2024-05-27T23:00:00Z',
    visibleOn: 'both',
    region: 'india',
    ingredients: ['chicken', 'naan', 'tomatoes', 'cream', 'spices'],
    steps: ['Cook chicken with spices.', 'Make tomato sauce.', 'Add cream.', 'Serve with naan.'],
    minPrice: '1300',
    cookTime: '40 min',
    prepTime: '20 min',
    userId: '2',
  },
  {
    id: '35',
    title: 'Pho',
    description: 'Vietnamese noodle soup with herbs and beef.',
    image: '/images/pho.jpeg',
    rating: 5,
    liked: false,
    category: 'international',
    createdAt: '2024-05-28T08:00:00Z',
    visibleOn: 'both',
    region: 'vietnam',
    ingredients: ['rice noodles', 'beef', 'broth', 'herbs', 'lime'],
    steps: ['Cook noodles.', 'Prepare broth.', 'Slice beef thinly.', 'Assemble and serve.'],
    minPrice: '1000',
    cookTime: '60 min',
    prepTime: '30 min',
    userId: '1',
  },
  {
    id: '36',
    title: 'Bun Kabab',
    description: 'Spiced meat patties served in a bun.',
    image: '/images/Bun-Kabab.jpg',
    rating: 5,
    liked: false,
    category: 'international',
    createdAt: '2024-05-28T09:00:00Z',
    visibleOn: 'both',
    region: 'pakistan',
    ingredients: ['beef patty', 'bun', 'onions', 'coriander', 'spices'],
    steps: ['Shape beef into patties.', 'Fry until cooked.', 'Serve in buns with toppings.'],
    minPrice: '1500',
    cookTime: '25 min',
    prepTime: '20 min',
    userId: '2',
  },

  {
    id: '37',
    title: 'Couscous Royal',
    description: 'North African couscous served with meat and vegetables.',
    image: '/images/CouscousRoyal.jpeg',
    rating: 4,
    liked: false,
    category: 'northAfrican',
    createdAt: '2024-05-28T09:30:00Z',
    visibleOn: 'both',
    region: 'algeria',
    ingredients: ['couscous', 'lamb', 'carrots', 'chickpeas', 'spices'],
    steps: ['Steam couscous.', 'Cook lamb and vegetables.', 'Add spices.', 'Serve together.'],
    minPrice: '1300',
    cookTime: '60 min',
    prepTime: '30 min',
    userId: '1',
  },
  {
    id: '38',
    title: 'Pancakes',
    description: 'Fluffy pancakes served with syrup.',
    image: '/images/pancakes.jpeg',
    rating: 4,
    liked: false,
    category: 'breakfasts',
    createdAt: '2024-05-28T10:00:00Z',
    visibleOn: 'both',
    region: 'international',
    ingredients: ['flour', 'milk', 'eggs', 'sugar', 'butter'],
    steps: ['Mix ingredients.', 'Cook on griddle.', 'Serve with syrup.'],
    minPrice: '1000',
    cookTime: '25 min',
    prepTime: '15 min',
    userId: '1',
  },
  {
    id: '39',
    title: 'Ndomba',
    description: 'Steamed fish with local spices wrapped in banana leaves.',
    image: '/images/ndomba.webp',
    rating: 5,
    liked: false,
    category: 'littoral',
    createdAt: '2024-05-28T10:30:00Z',
    visibleOn: 'both',
    region: 'littoral',
    ingredients: ['fish', 'spices', 'banana leaves', 'tomatoes', 'onions'],
    steps: ['Season fish.', 'Wrap in banana leaves.', 'Steam with tomatoes.', 'Serve hot.'],
    minPrice: '1500',
    cookTime: '40 min',
    prepTime: '20 min',
    userId: '2',
  },
  {
    id: '40',
    title: 'kondre',
    description: 'Hearty spiced plantain and meat stew.',
    image: '/images/kondre.webp',
    rating: 5,
    liked: false,
    category: 'west',
    createdAt: '2024-05-28T11:00:00Z',
    visibleOn: 'both',
    region: 'turkey',
    ingredients: ['plantains', 'beef', 'palm oil', 'onions', 'spices'],
    steps: ['Boil plantains.', 'Cook beef with onions.', 'Add palm oil and spices.', 'Simmer and serve.'],
    minPrice: '1200',
    cookTime: '50 min',
    prepTime: '30 min',
    userId: '1',
  },

];

const initialState: RecipesState = {
  recipes: initialRecipes,
  recommendedRecipes: [],
  userRecipes: [],
  status: 'idle',
  error: null,
};


export const addRecipeThunk = createAsyncThunk(
  'recipes/addRecipe',
  async (
    { recipeData, token }: { recipeData: FormData; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post('/recipes', recipeData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const recipe = response.data.recipe;
      if (!recipe || !recipe.id) {
        throw new Error('Recipe ID is missing in response');
      }

      const normalizedRecipe: Recipe = {
        id: String(recipe.id),
        title: recipe.title || '',
        description: recipe.description || '',
        image: recipe.image_path
          ? recipe.image_path.startsWith('http') || recipe.image_path.startsWith('/')
            ? recipe.image_path
            : `/storage/${recipe.image_path}`
          : null,

        ingredients: Array.isArray(recipe.ingredients)
          ? recipe.ingredients
          : JSON.parse(recipe.ingredients || '[]'),
        steps: Array.isArray(recipe.steps)
          ? recipe.steps
          : JSON.parse(recipe.steps || '[]'),
        category: recipe.category_id?.toString() || '',
        region: recipe.region_id?.toString() || 'unknown',
        minPrice: recipe.min_price?.toString() || '0',
        cookTime: recipe.cook_time || '',
        prepTime: recipe.prep_time || '',
        createdAt: recipe.created_at || new Date().toISOString(),
        rating: recipe.rating || 0,
        liked: false,
        userId: String(recipe.user_id),
        visibleOn: recipe.visible_on || 'both',
      };

      return normalizedRecipe;
    } catch (error: any) {
      console.error('Error adding recipe:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        headers: error.response?.headers,
      });
      const errorMessage =
        error.response?.status === 401
          ? 'Unauthenticated: Invalid or expired token'
          : error.response?.status === 422
            ? `Validation error: ${error.response?.data?.errors
              ? Object.values(error.response.data.errors).flat().join(', ')
              : error.response?.data?.message || 'Invalid input data'}`
            : error.response?.status === 500
              ? `Server error: ${error.response?.data?.message || 'Internal server error'}`
              : error.message || 'Failed to add recipe';
      return rejectWithValue(errorMessage);
    }
  }
);

export const toggleLike = createAsyncThunk(
  'recipes/toggleLike',
  async (
    { id, isProfilePage }: { id: string; isProfilePage: boolean },
    { getState, dispatch, rejectWithValue }
  ) => {
    const state = getState() as {
      user: { user: any; token: string | null };
      recipes: { recipes: any[] };
    };

    const token = state.user.token;
    if (!token) {
      return rejectWithValue('No token found');
    }

    // Find recipe from all sources
    const allRecipes = [
      ...(state.recipes.recipes || []),
      ...(state.user.user?.recipes || []),
      ...(state.user.user?.likedRecipes || [])
    ];
    const currentRecipe = allRecipes.find((r) => r.id === id);

    if (!currentRecipe) {
      console.error('Recipe not found in state:', id);
      return rejectWithValue('Recipe not found in state');
    }

    console.log('toggleLike input:', { id, title: currentRecipe.title, isProfilePage });

    // Optimistic update
    if (isProfilePage && state.user.user) {
      const isCurrentlyLiked = state.user.user.likedIds?.includes(id) ?? false;
      let newLikedRecipes;

      if (isCurrentlyLiked) {
        newLikedRecipes = state.user.user.likedRecipes?.filter((r: any) => r.id !== id) || [];
      } else {
        const imageUrl =
          currentRecipe.image ||
          (currentRecipe.image_path
            ? currentRecipe.image_path.startsWith('http')
              ? currentRecipe.image_path
              : `/storage/${currentRecipe.image_path}`
            : '/default-recipe.png');

        newLikedRecipes = [
          ...(state.user.user.likedRecipes || []),
          {
            ...currentRecipe,
            id,
            liked: true,
            image: imageUrl,
          },
        ];
      }

      console.log('Optimistic likedRecipes:', newLikedRecipes.map((r: any) => ({ id: r.id, title: r.title })));
      dispatch(updateLikedRecipes(newLikedRecipes));
    }

    try {
      const response = await axios.post(
        `/recipes/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const liked = response.data.liked ?? !currentRecipe.liked;
      const backendRecipe = response.data.recipe;
      const recipeData = backendRecipe
        ? {
            ...backendRecipe,
            image:
              backendRecipe.image ||
              (backendRecipe.image_path
                ? backendRecipe.image_path.startsWith('http')
                  ? backendRecipe.image_path
                  : `/storage/${backendRecipe.image_path}`
                : '/default-recipe.png'),
          }
        : {
            ...currentRecipe,
            liked,
            image: currentRecipe.image || '/default-recipe.png',
          };

      // Update likedRecipes with backend data
      if (isProfilePage && state.user.user && recipeData) {
        const isCurrentlyLiked = state.user.user.likedIds?.includes(id) ?? false;
        const newLikedRecipes = isCurrentlyLiked
          ? state.user.user.likedRecipes?.filter((r: any) => r.id !== id) || []
          : [...(state.user.user.likedRecipes || []), recipeData];

        console.log('Post-API likedRecipes:', newLikedRecipes.map((r: any) => ({ id: r.id, title: r.title })));
        dispatch(updateLikedRecipes(newLikedRecipes));
      }

      const userResponse = await dispatch(fetchUser()).unwrap();
      console.log('Post-fetchUser likedRecipes:', userResponse.likedRecipes?.map((r: any) => ({ id: r.id, title: r.title })));

      if (!isProfilePage) {
        await dispatch(fetchRecipesThunk({ isAuthenticated: !!token })).unwrap();
      }

      return { id, liked, recipe: recipeData };
    } catch (error: any) {
      console.error('toggleLike error:', error.response?.data || error.message);
      if (isProfilePage && state.user.user) {
        await dispatch(fetchUser()).unwrap();
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle like');
    }
  }
);

export const setRating = createAsyncThunk(
  'recipes/setRating',
  async (
    { id, rating, isProfilePage }: { id: string; rating: number; isProfilePage: boolean },
    { getState, dispatch, rejectWithValue }
  ) => {
    const state = getState() as { user: { token: string | null }; recipes: { recipes: any[] } };
    const token = state.user.token;
    if (!token) {
      return rejectWithValue('No token found');
    }
    try {
      const response = await axios.post(
        `/recipes/${id}/rate`,
        { rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('setRating response:', response.data); // Debug log
      const newRating = response.data.rating ?? rating;
      if (isProfilePage) {
        await dispatch(fetchUser()).unwrap();
      } else {
        await dispatch(fetchRecipesThunk({ isAuthenticated: !!token })).unwrap();
      }
      return { id, rating: newRating };
    } catch (error: any) {
      console.error('setRating error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to set rating');
    }
  }
);


export const deleteRecipeThunk = createAsyncThunk(
  'recipes/deleteRecipe',
  async ({ recipeId, token }: { recipeId: string; token: string }, { rejectWithValue }) => {
    try {
      await axios.delete(`/recipes/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return recipeId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete recipe');
    }
  }
);

export const fetchRecipesThunk = createAsyncThunk(
  'recipes/fetchRecipes',
  async ({ isAuthenticated }: { isAuthenticated: boolean }, { rejectWithValue }) => {
    try {
      const headers: { Authorization?: string } = {};
      console.log('Fetching recipes with isAuthenticated:', isAuthenticated);
      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        if (!token) {
          console.log('No token found');
          return rejectWithValue('No authentication token found. Please log in.');
        } 
        headers.Authorization = `Bearer ${token}`;
      }

      // Use GET instead of POST
      const response = await axios.get(isAuthenticated ? '/recipes' : '/recipes?public=true', { headers });
      console.log('Raw response:', response.data);

      // Adjust based on actual response structure
      const recipes = Array.isArray(response.data) ? response.data : response.data.recipes;
      if (!Array.isArray(recipes)) {
        console.log('Invalid response format');
        return rejectWithValue('Invalid response format: Expected an array of recipes');
      }

      console.log('Fetched recipes:', recipes);
      return recipes.map((recipe: any) => ({
        id: String(recipe.id),
        title: recipe.title || '',
        description: recipe.description || '',
        image: recipe.image_path
          ? recipe.image_path.startsWith('http') // full URL already?
            ? recipe.image_path
            : `/storage/${recipe.image_path}`
          : null,
        ingredients: Array.isArray(recipe.ingredients)
          ? recipe.ingredients
          : typeof recipe.ingredients === 'string'
            ? JSON.parse(recipe.ingredients || '[]')
            : [],
        steps: Array.isArray(recipe.steps)
          ? recipe.steps
          : typeof recipe.steps === 'string'
            ? JSON.parse(recipe.steps || '[]')
            : [],
        category: recipe.category?.name || recipe.category_id?.toString() || '',
        region: recipe.region?.name || recipe.region_id?.toString() || 'unknown',
        minPrice: recipe.min_price?.toString() || '0',
        cookTime: recipe.cook_time || '',
        prepTime: recipe.prep_time || '',
        createdAt: recipe.created_at || new Date().toISOString(),
        rating: recipe.ratings?.length
          ? recipe.ratings.reduce((acc: number, r: any) => acc + r.rating, 0) / recipe.ratings.length
          : 0,
        liked: recipe.favoritedBy?.some((f: any) => f.user_id === recipe.user_id) || false,
        userId: String(recipe.user_id),
        visibleOn: recipe.visible_on || 'both',
      }));
    } catch (error: any) {
      const statusCode = error.response?.status || 'Unknown';
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors ||
        error.message ||
        'Unable to fetch recipes';
      console.error('Error fetching recipes:', {
        message: errorMessage,
        statusCode,
        responseData: error.response?.data || null,
      });
      return rejectWithValue(`${errorMessage} (Status: ${statusCode})`);
    }
  }
);

export const fetchUserRecipesThunk = createAsyncThunk(
  'recipes/fetchUserRecipes',
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found. Please log in.');
      }
      const response = await axios.get(`/users/${userId}/recipes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('User recipes response:', response.data);
      const recipes = Array.isArray(response.data) ? response.data : response.data.recipes;
      if (!Array.isArray(recipes)) {
        return rejectWithValue('Invalid response format: Expected an array of recipes');
      }
      return recipes.map((recipe: any) => ({
        id: String(recipe.id),
        title: recipe.title || '',
        description: recipe.description || '',
        image: recipe.image_path
          ? recipe.image_path.startsWith('http')
            ? recipe.image_path // Use full URL as-is
            : `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${recipe.image_path}` // Prepend backend URL
          : null,
        ingredients: Array.isArray(recipe.ingredients)
          ? recipe.ingredients
          : typeof recipe.ingredients === 'string'
            ? JSON.parse(recipe.ingredients || '[]')
            : [],
        steps: Array.isArray(recipe.steps)
          ? recipe.steps
          : typeof recipe.steps === 'string'
            ? JSON.parse(recipe.steps || '[]')
            : [],
        category: recipe.category?.name || recipe.category_id?.toString() || '',
        region: recipe.region?.name || recipe.region_id?.toString() || 'unknown',
        minPrice: recipe.min_price?.toString() || '0',
        cookTime: recipe.cook_time || '',
        prepTime: recipe.prep_time || '',
        createdAt: recipe.created_at || new Date().toISOString(),
        rating: recipe.rating || 0,
        liked: recipe.liked || false,
        userId: String(recipe.user_id),
        visibleOn: recipe.visible_on || 'both',
      }));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch user recipes';
      console.error('Error fetching user recipes:', {
        message: errorMessage,
        statusCode: error.response?.status,
        responseData: error.response?.data,
      });
      return rejectWithValue(errorMessage);
    }
  }
);

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
    toggleLike(state, action: PayloadAction<string>) {
      const recipe = state.recipes.find((r) => r.id === action.payload);
      const recommendedRecipe = state.recommendedRecipes.find((r) => r.id === action.payload);
      if (recipe) {
        recipe.liked = !recipe.liked;
      }
      if (recommendedRecipe) {
        recommendedRecipe.liked = !recommendedRecipe.liked;
      }
    },
    setRating(state, action: PayloadAction<{ id: string; rating: number }>) {
      const { id, rating } = action.payload;
      const recipe = state.recipes.find((r) => r.id === id);
      const recommendedRecipe = state.recommendedRecipes.find((r) => r.id === id);
      if (recipe) {
        recipe.rating = rating;
      }
      if (recommendedRecipe) {
        recommendedRecipe.rating = rating;
      }
    },
    updateRecipeFields: (state, action: PayloadAction<{ id: string; liked?: boolean; rating?: number }>) => {
      const { id, liked, rating } = action.payload;
      const recipe = state.recipes.find(r => r.id === id);
      if (recipe) {
        if (liked !== undefined) recipe.liked = liked;
        if (rating !== undefined) recipe.rating = rating;
      }
    },

    removeRecipe(state, action: PayloadAction<string>) {
      state.recipes = state.recipes.filter((r) => r.id !== action.payload);
      state.recommendedRecipes = state.recommendedRecipes.filter((r) => r.id !== action.payload);
    },
    updateRecipe(state, action: PayloadAction<Recipe>) {
      const index = state.recipes.findIndex((r) => r.id === action.payload.id);
      const recommendedIndex = state.recommendedRecipes.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.recipes[index] = {
          ...state.recipes[index],
          ...action.payload,
          region: typeof action.payload.region === 'string' ? action.payload.region : state.recipes[index].region || 'unknown',
          createdAt: action.payload.createdAt ?? state.recipes[index].createdAt,
        };
      }
      if (recommendedIndex !== -1) {
        state.recommendedRecipes[recommendedIndex] = {
          ...state.recommendedRecipes[recommendedIndex],
          ...action.payload,
          region: typeof action.payload.region === 'string' ? action.payload.region : state.recommendedRecipes[recommendedIndex].region || 'unknown',
          createdAt: action.payload.createdAt ?? state.recommendedRecipes[recommendedIndex].createdAt,
        };
      }
    },
    setRecommendedRecipes(state, action: PayloadAction<string>) {
      const region = action.payload.toLowerCase();
      state.recommendedRecipes = state.recipes.filter(
        (recipe) =>
          (typeof recipe.region === 'string' ? recipe.region.toLowerCase() : 'unknown') === region &&
          (recipe.visibleOn === 'welcome' || recipe.visibleOn === 'both')
      );
      state.status = 'succeeded';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addRecipeThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addRecipeThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.recipes.push(action.payload);
        state.userRecipes.push(action.payload);
      })
      .addCase(addRecipeThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(deleteRecipeThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteRecipeThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.recipes = state.recipes.filter((r) => r.id !== action.payload);
        state.recommendedRecipes = state.recommendedRecipes.filter((r) => r.id !== action.payload);
        state.userRecipes = state.userRecipes.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteRecipeThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchRecipesThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRecipesThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.recipes = [
          ...initialRecipes,
          ...action.payload.filter(
            (fetched) => !initialRecipes.some((staticRecipe) => staticRecipe.id === fetched.id)
          ),
        ];
      })
      .addCase(fetchRecipesThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.recipes = [...initialRecipes];
      })
      .addCase(fetchUserRecipesThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserRecipesThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userRecipes = action.payload;
      })

      .addCase(fetchUserRecipesThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { id, liked } = action.payload;
        const recipe = state.recipes.find((r) => r.id === id);
        if (recipe) {
          recipe.liked = liked;
        }
        console.log('toggleLike fulfilled:', { id, liked, title: recipe?.title, recipes: state.recipes }); // Debug log
      })
      .addCase(setRating.fulfilled, (state, action) => {
        const { id, rating } = action.payload;
        const recipe = state.recipes.find((r) => r.id === id);
        if (recipe) {
          recipe.rating = rating;
        }
      });
  },
});

export const {
  toggleLike: toggleLikeAction,
  setRating: setRatingAction,
  removeRecipe,
  updateRecipe,
  updateRecipeFields,
  setRecommendedRecipes,
} = recipesSlice.actions;
export const { resetStatus } = recipesSlice.actions;

export default recipesSlice.reducer;