import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recipe, VisibleOn } from '@/model/Recipe';

interface RecipesState {
  recipes: Recipe[];
  recommendedRecipes: Recipe[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Payload for addRecipe: excludes id and createdAt, includes optional fields
type AddRecipePayload = Omit<Partial<Recipe>, 'id' | 'createdAt'> & {
  title: string;
  description: string;
  image: string;
};

const initialRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Ndole',
    description: 'A bitterleaf stew with peanuts and meat.',
    image: '/images/ndole-1.webp',
    rating: 5,
    liked: false,
    category: 'west',
    createdAt: '2024-05-01T12:00:00Z',
    visibleOn: 'both',
    region: 'centre',
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
  },
  {
    id: '3',
    title: 'Jollof Rice',
    description: 'Classic West African rice cooked in spicy tomato sauce.',
    image: '/images/jolof rice.jpeg',
    rating: 4,
    liked: false,
    category: 'westAfrica',
    createdAt: '2024-05-28T09:30:00Z',
    visibleOn: 'both',
    region: 'westAfrica',
  },
  {
    id: '4',
    title: 'Fufu & Light Soup',
    description: 'Ghanaian fufu served with spicy light soup.',
    image: '/images/Fufu and light soup.jpeg',
    rating: 3,
    liked: false,
    category: 'westAfrica',
    createdAt: '2024-05-10T14:00:00Z',
    visibleOn: 'both',
    region: 'westAfrica',
  },
  {
    id: '5',
    title: 'Spaghetti Bolognese',
    description: 'Italian classic with rich meat sauce.',
    image: '/images/spaghetti-bolognese.jpeg',
    rating: 5,
    liked: false,
    category: 'international Cuisine',
    createdAt: '2024-05-11T15:00:00Z',
    visibleOn: 'both',
    region: 'international',
  },
  {
    id: '6',
    title: 'Chicken Curry',
    description: 'Aromatic curry with tender chicken pieces.',
    image: '/images/chicken curry.jpeg',
    rating: 4,
    liked: false,
    category: 'international Cuisine',
    createdAt: '2024-05-12T10:00:00Z',
    visibleOn: 'both',
    region: 'international',
  },
  {
    id: '7',
    title: 'Puff Puff',
    description: 'A local breakfast with a beautiful texture.',
    image: '/images/puff puff.jpeg',
    rating: 4,
    liked: false,
    category: 'snacks',
    createdAt: '2024-05-13T11:00:00Z',
    visibleOn: 'both',
    region: 'centre',
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
  },
  {
    id: '13',
    title: 'Makayabu',
    description: 'Salted fish with vegetables, popular in Central Africa.',
    image: '/images/makayabu.jpg',
    rating: 4,
    liked: false,
    category: 'centralAfrica',
    createdAt: '2024-05-19T14:00:00Z',
    visibleOn: 'both',
    region: 'centralAfrica',
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
    region: 'eastAfrica',
  },
  {
    id: '15',
    title: 'Chakalaka',
    description: 'Spicy vegetable relish from South Africa.',
    image: '/images/chakalaka.jpeg',
    rating: 4,
    liked: false,
    category: 'southAfrica',
    createdAt: '2024-05-21T11:00:00Z',
    visibleOn: 'both',
    region: 'southAfrica',
  },
  {
    id: '16',
    title: 'Chocolate Cake',
    description: 'Decadent dessert with a gooey chocolate center.',
    image: '/images/choco cake.jpeg',
    rating: 5,
    liked: false,
    category: 'desserts',
    createdAt: '2024-05-22T19:00:00Z',
    visibleOn: 'both',
    region: 'international',
  },
  {
    id: '17',
    title: 'Fruit Salad ',
    description: 'Fresh fruits served with chilled yogurt.',
    image: '/images/fruit salad.jpg',
    rating: 4,
    liked: false,
    category: 'desserts',
    createdAt: '2024-05-23T07:00:00Z',
    visibleOn: 'both',
    region: 'international',
  },
  {
    id: '18',
    title: 'Yassa',
    description: 'A Senegalese dish made with marinated chicken or fish.',
    image: '/images/yassa.jpeg',
    rating: 4,
    liked: false,
    category: 'westAfrica',
    createdAt: '2024-05-24T10:00:00Z',
    visibleOn: 'both',
    region: 'Senegal',
  },
  {
    id: '19',
    title: 'Egusi Soup',
    description: 'Ground melon seed soup with vegetables and meat.',
    image: '/images/egusi.jpeg',
    rating: 5,
    liked: false,
    category: 'westAfrica',
    createdAt: '2024-05-25T12:00:00Z',
    visibleOn: 'both',
    region: 'nigeria',
  },
  {
    id: '20',
    title: 'Shawarma',
    description: 'Middle Eastern wrap with spiced meat.',
    image: '/images/shawarma.png',
    rating: 4,
    liked: false,
    category: 'international Cuisine',
    createdAt: '2024-05-26T18:00:00Z',
    visibleOn: 'both',
    region: 'international',
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
  },
  {
    id: '24',
    title: 'Lahoh with Suqaar',
    description: 'Somali spongy bread served with stir-fried meat.',
    image: '/images/lahoh.jpeg',
    rating: 4,
    liked: false,
    category: 'eastAfrica',
    createdAt: '2024-05-27T13:00:00Z',
    visibleOn: 'both',
    region: 'somalia',
  },
  {
    id: '25',
    title: 'Nyama Choma',
    description: 'Kenyan roasted meat often enjoyed with kachumbari.',
    image: '/images/Nyama-Choma.jpg',
    rating: 5,
    liked: false,
    category: 'eastAfrica',
    createdAt: '2024-05-27T14:00:00Z',
    visibleOn: 'both',
    region: 'kenya',
  },
  {
    id: '26',
    title: 'Matapa',
    description: 'Mozambican stew made with cassava leaves, garlic and coconut milk.',
    image: '/images/Matapa.webp',
    rating: 4,
    liked: false,
    category: 'southAfrica',
    createdAt: '2024-05-27T15:00:00Z',
    visibleOn: 'both',
    region: 'mozambique',
  },
  {
    id: '27',
    title: 'Tagine',
    description: 'Moroccan stew made with meat and dried fruits.',
    image: '/images/tagine.jpeg',
    rating: 5,
    liked: false,
    category: 'northAfrica',
    createdAt: '2024-05-27T16:00:00Z',
    visibleOn: 'both',
    region: 'morocco',
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
  },
  {
    id: '29',
    title: 'Beignets Manioc',
    description: 'Cassava fritters common in Central Africa.',
    image: '/images/accra casava.jpg',
    rating: 3,
    liked: false,
    category: 'snacks',
    createdAt: '2024-05-27T18:00:00Z',
    visibleOn: 'both',
    region: 'centralAfrica',
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
    region: 'Ghana',
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
  },
  {
    id: '32',
    title: 'Crepes Suzette',
    description: 'French crepes flambéed in orange liqueur.',
    image: '/images/Crepes Suzette.jpeg',
    rating: 4,
    liked: false,
    category: 'desserts',
    createdAt: '2024-05-27T21:00:00Z',
    visibleOn: 'both',
    region: 'international',
  },
  {
    id: '33',
    title: 'Tapioca Pudding',
    description: 'Chilled dessert with tapioca pearls and coconut milk.',
    image: '/images/tapioca Pudding.jpeg',
    rating: 3,
    liked: false,
    category: 'desserts',
    createdAt: '2024-05-27T22:00:00Z',
    visibleOn: 'both',
    region: 'international',
  },
  {
    id: '34',
    title: 'Naan & Butter Chicken',
    description: 'Indian bread served with creamy spiced chicken.',
    image: '/images/Naan & Butter Chicken.jpeg',
    rating: 5,
    liked: false,
    category: 'international Cuisine',
    createdAt: '2024-05-27T23:00:00Z',
    visibleOn: 'both',
    region: 'india',
  },
  {
    id: '35',
    title: 'Pho',
    description: 'Vietnamese noodle soup with herbs and beef.',
    image: '/images/pho.jpeg',
    rating: 5,
    liked: false,
    category: 'international Cuisine',
    createdAt: '2024-05-28T08:00:00Z',
    visibleOn: 'both',
    region: 'vietnam',
  },
  {
    id: '36',
    title: 'Bun Kabab',
    description: 'Pakistani street food burger with spicy patty.',
    image: '/images/Bun-Kabab.jpg',
    rating: 4,
    liked: false,
    category: 'international Cuisine',
    createdAt: '2024-05-28T09:00:00Z',
    visibleOn: 'both',
    region: 'pakistan',
  },
  {
    id: '37',
    title: 'Couscous Royal',
    description: 'North African semolina served with meat and vegetables.',
    image: '/images/Couscous Royal.jpeg',
    rating: 5,
    liked: false,
    category: 'northAfrica',
    createdAt: '2024-05-28T10:00:00Z',
    visibleOn: 'both',
    region: 'algeria',
  },
  {
    id: '38',
    title: 'Pancakes',
    description: 'Sweet and crispy pancakes, a popular side dish.',
    image: '/images/pancakes.jpeg',
    rating: 4,
    liked: false,
    category: 'breakfasts',
    createdAt: '2024-05-28T11:00:00Z',
    visibleOn: 'both',
    region: 'westAfrica',
  },
  {
    id: '39',
    title: 'Ndomba',
    description: 'Steamed fish with local spices wrapped in banana leaves.',
    image: '/images/ndomba.webp',
    rating: 4,
    liked: false,
    category: 'littoral',
    createdAt: '2024-05-28T12:00:00Z',
    visibleOn: 'both',
    region: 'littoral',
  },
  {
    id: '40',
    title: 'Kondre',
    description: 'Hearty spiced plantain and meat stew from the West. ',
    image: '/images/kondre.webp',
    rating: 5,
    liked: false,
    category: 'west',
    createdAt: '2024-05-28T13:00:00Z',
    visibleOn: 'both',
    region: 'west',
  },
];

const initialState: RecipesState = {
  recipes: initialRecipes,
  recommendedRecipes: [],
  status: 'idle',
  error: null,
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    toggleLike(state, action: PayloadAction<string>) {
      const recipe = state.recipes.find((r) => r.id === action.payload);
      const recommendedRecipe = state.recommendedRecipes.find(
        (r) => r.id === action.payload
      );
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
    addRecipe(state, action: PayloadAction<AddRecipePayload>) {
      const newRecipe: Recipe = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        rating: action.payload.rating ?? 0,
        liked: action.payload.liked ?? false,
        ingredients: action.payload.ingredients ?? [],
        instructions: action.payload.instructions ?? '',
        visibleOn: action.payload.visibleOn as VisibleOn,
        region: action.payload.region ?? 'unknown',
      };
      state.recipes.push(newRecipe);
    },
    removeRecipe(state, action: PayloadAction<string>) {
      state.recipes = state.recipes.filter((r) => r.id !== action.payload);
      state.recommendedRecipes = state.recommendedRecipes.filter(
        (r) => r.id !== action.payload
      );
    },
    updateRecipe(state, action: PayloadAction<Recipe>) {
      const index = state.recipes.findIndex((r) => r.id === action.payload.id);
      const recommendedIndex = state.recommendedRecipes.findIndex(
        (r) => r.id === action.payload.id
      );
      if (index !== -1) {
        state.recipes[index] = {
          ...state.recipes[index],
          ...action.payload,
          createdAt: action.payload.createdAt ?? state.recipes[index].createdAt,
        };
      }
      if (recommendedIndex !== -1) {
        state.recommendedRecipes[recommendedIndex] = {
          ...state.recommendedRecipes[recommendedIndex],
          ...action.payload,
          createdAt:
            action.payload.createdAt ??
            state.recommendedRecipes[recommendedIndex].createdAt,
        };
      }
    },
    setRecommendedRecipes(state, action: PayloadAction<string>) {
      const region = action.payload.toLowerCase();
      state.recommendedRecipes = state.recipes.filter(
        (recipe) =>
          (recipe.region?.toLowerCase() ?? 'unknown') === region &&
          (recipe.visibleOn === 'welcome' || recipe.visibleOn === 'both')
      );
      state.status = 'succeeded';
    },
  },
});

export const {
  toggleLike,
  setRating,
  addRecipe,
  removeRecipe,
  updateRecipe,
  setRecommendedRecipes,
} = recipesSlice.actions;

export default recipesSlice.reducer;