'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import RecipeCard from '@/components/RecipeCard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import ProtectedRoute from '@/components/ProtectedRoute';
import { toggleLike, setRating, setRecommendedRecipes, fetchRecipesThunk } from '@/store/RecipeSlice';
import { useTranslation } from 'react-i18next';
import RecipeCardHorizontal from '@/components/RecipeCardHorz';
import { fetchUser } from '@/store/UserSlice';
import useDebounce from '@/hooks/UseDebounce';

const REGIONS = [
  { key: 'northWest', name: 'North West', image: '/images/NW.jpeg' },
  { key: 'southWest', name: 'South West', image: '/images/SW.jpeg' },
  { key: 'littoral', name: 'Littoral', image: '/images/LT.png' },
  { key: 'centre', name: 'Centre', image: '/images/CN.jpeg' },
  { key: 'farNorth', name: 'Far North', image: '/images/FN.jpeg' },
  { key: 'west', name: 'West', image: '/images/WT.avif' },
  { key: 'south', name: 'South', image: '/images/ST.webp' },
  { key: 'north', name: 'North', image: '/images/NT.jpeg' },
  { key: 'east', name: 'East', image: '/images/ET.jpeg' },
  { key: 'adamawa', name: 'Adamawa', image: '/images/AW.jpeg' },
];

export default function HomePage() {
  const { t } = useTranslation('home');
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.user.user);
  const userRegion = user?.location?.toLowerCase() ?? 'centre';
  const { recommendedRecipes, status, error, recipes } = useSelector((state: RootState) => state.recipes);

  const [recommendedRecipeIndex, setRecommendedRecipeIndex] = useState(0);
  const [latestRecipeIndex, setLatestRecipeIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
const isAuthenticated = !!localStorage.getItem('token');


  useEffect(() => {
    dispatch(fetchUser());
    dispatch(setRecommendedRecipes(userRegion));
  }, [dispatch, userRegion]);

  useEffect(() => {
    setIsSearchMode(!!debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  const categoryParam = searchParams.get('category') || 'all';


  useEffect(() => {
    dispatch(fetchRecipesThunk({ isAuthenticated }));
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearchQuery) {
      params.set('query', debouncedSearchQuery);
    } else {
      params.delete('query');
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [debouncedSearchQuery, router, searchParams]);

  const visibleRecipes = useMemo(() => {
    return recipes.filter(recipe =>
      recipe.visibleOn === 'home' || recipe.visibleOn === 'both'
    );
  }, [recipes]);

  const categoryMapping: { [key: string]: string } = {
    NorthWest: 'northwest',
    SouthWest: 'southwest',
    Littoral: 'littoral',
    Centre: 'centre',
    FarNorth: 'farnorth',
    West: 'west',
    South: 'south',
    North: 'north',
    East: 'east',
    Adamawa: 'adamawa',
    WestAfrica: 'westafrican',
    CentralAfrica: 'centralafrican',
    NorthAfrica: 'northafrican',
    Vegetarian: 'vegetarian',
    QuickEasy: 'quickeasy',
    StreetFood: 'streetfood',
    International: 'international',
    Snacks: 'snacks',
    Breakfasts: 'breakfasts',
    Desserts: 'desserts',
    Drinks: 'drinks',
    all: 'all',
  };

  const filteredRecipes = useMemo(() => {
    let filtered = [...visibleRecipes];

    if (debouncedSearchQuery) {
      filtered = filtered.filter(recipe =>
        (recipe.title?.toLowerCase() ?? '').includes(debouncedSearchQuery.toLowerCase()) ||
        (recipe.description?.toLowerCase() ?? '').includes(debouncedSearchQuery.toLowerCase()) ||
        (recipe.category?.toLowerCase() ?? '').includes(debouncedSearchQuery.toLowerCase())
      );
    }

    if (categoryParam !== 'all') {
      const normalizedCategoryParam = categoryParam.toLowerCase().trim();
      const categoryMatch = Object.entries(categoryMapping).find(
        ([key, value]) => key.toLowerCase() === normalizedCategoryParam || value.toLowerCase() === normalizedCategoryParam
      );
      const targetCategory = categoryMatch ? categoryMatch[1] : normalizedCategoryParam;
      filtered = filtered.filter(recipe =>
        (recipe.category?.toLowerCase().trim() ?? '') === targetCategory.toLowerCase()
      );
    }

    return filtered;
  }, [visibleRecipes, debouncedSearchQuery, categoryParam]);

  const handleLike = useCallback((id: string) => {
    dispatch(toggleLike(id));
  }, [dispatch]);

  const handleRate = useCallback((id: string, rating: number) => {
    dispatch(setRating({ id, rating }));
  }, [dispatch]);

  const handleRegionClick = (region: string) => {
    router.push(`/Feed?category=${region.toLowerCase()}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchMode(false);
  };

  const recipesPerPage = 4;
  const recommendedMaxIndex = Math.ceil(recommendedRecipes.length / recipesPerPage) - 1;

  const handleNextRecommendedRecipes = () => {
    setRecommendedRecipeIndex((prev) => Math.min(prev + 1, recommendedMaxIndex));
  };

  const handlePrevRecommendedRecipes = () => {
    setRecommendedRecipeIndex((prev) => Math.max(prev - 1, 0));
  };

  const visibleRecommendedRecipes = recommendedRecipes.slice(
    recommendedRecipeIndex * recipesPerPage,
    (recommendedRecipeIndex + 1) * recipesPerPage
  );

  const latestRecipes = useMemo(() => {
    return filteredRecipes
      .filter(recipe => recipe.createdAt)
      .sort((a, b) =>
        new Date(b.createdAt ?? '').getTime() - new Date(a.createdAt ?? '').getTime()
      )
      .slice(0, 12);
  }, [filteredRecipes]);

  const latestMaxIndex = Math.ceil(latestRecipes.length / recipesPerPage) - 1;

  const handleNextLatestRecipes = () => {
    setLatestRecipeIndex((prev) => Math.min(prev + 1, latestMaxIndex));
  };

  const handlePrevLatestRecipes = () => {
    setLatestRecipeIndex((prev) => Math.max(prev - 1, 0));
  };

  const visibleLatestRecipes = latestRecipes.slice(
    latestRecipeIndex * recipesPerPage,
    (latestRecipeIndex + 1) * recipesPerPage
  );

  // Debug logs
  console.log('All Recipes:', recipes);
  console.log('Visible Recipes:', visibleRecipes);
  console.log('Recommended Recipes:', recommendedRecipes);
  console.log('Latest Recipes:', latestRecipes);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
          {/* Search Bar */}
          <section className="mb-4 sm:mb-6 md:mb-8">
            <div className="relative max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={t('home.searchPlaceholder', 'Search recipes...')}
                className="w-full p-2 sm:p-3 pr-8 sm:pr-10 rounded-full border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                aria-label={t('home.searchPlaceholder', 'Search recipes...')}
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2 sm:right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-orange-600 hover:text-orange-800 text-sm sm:text-base md:text-lg"
                  title={t('home.clearSearch', 'Clear search')}
                  aria-label={t('home.clearSearch', 'Clear search')}
                >
                  ✕
                </button>
              )}
            </div>
          </section>

          {/* Conditional Rendering based on Search Mode */}
          {isSearchMode ? (
            <section className="min-h-screen px-2 sm:px-4">
              <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6 md:mb-8 text-orange-600 px-2 sm:px-4 py-1 sm:py-2 rounded">
                {t('home.searchResults', 'Search Results')}
              </h2>
              {filteredRecipes.length === 0 ? (
                <p className="text-gray-500 italic text-sm sm:text-base md:text-lg px-2 sm:px-4">{t('home.noResultsFound', 'No recipes found')}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-4">
                  {filteredRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onLike={handleLike}
                      onRate={handleRate}
                    />
                  ))}
                </div>
              )}
            </section>
          ) : (
            <>
              {/* Section 1: Enhanced Note and Picture Frame */}
              <section className="mb-6 sm:mb-10 md:mb-20 lg:mb-40">
                <div className="flex flex-col items-center sm:items-start md:flex-row justify-between gap-6 sm:gap-8 md:gap-12">
                  <div className="w-full md:w-1/2 order-1">
                    <div className="relative bg-gradient-to-r from-orange-500 to-orange-700 text-white p-4 sm:p-6 md:p-8 lg:p-12 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg">
                      <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 tracking-tight text-white px-2 sm:px-4 rounded">
                        {t('home.homeOfRecipes')}
                      </h2>
                      <p className="text-lg sm:text-xl md:text-2xl leading-relaxed px-2 sm:px-4">
                        {t('home.welcomeDescription')}
                      </p>
                      <div className="absolute top-0 left-0 w-12 sm:w-16 md:w-20 lg:w-24 h-12 sm:h-16 md:h-20 lg:h-24 bg-orange-300 rounded-full -translate-x-3 sm:-translate-x-4 md:-translate-x-5 lg:-translate-x-6 -translate-y-3 sm:-translate-y-4 md:-translate-y-5 lg:-translate-y-6 opacity-50"></div>
                      <div className="absolute bottom-0 right-0 w-16 sm:w-20 md:w-24 lg:w-32 h-16 sm:h-20 md:h-24 lg:h-32 bg-orange-300 rounded-full translate-x-4 sm:translate-x-5 md:translate-x-6 lg:translate-x-8 translate-y-4 sm:translate-y-5 md:translate-y-6 lg:translate-y-8 opacity-50"></div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 order-2">
                    <div className="relative w-full max-w-xs sm:max-w-md md:max-w-2xl h-64 sm:h-80 md:h-[500px] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                      <img
                        src="/images/back.jpeg"
                        alt={t('home.featuredDishAlt')}
                        className="rounded-xl sm:rounded-2xl md:rounded-3xl object-cover w-full h-full"
                      />

                      <div className="absolute inset-0 border-4 sm:border-6 md:border-8 border-orange-200 rounded-xl sm:rounded-2xl md:rounded-3xl pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2: Recommended Recipes with Navigation Arrows */}
              <section className="mb-6 sm:mb-10 md:mb-20 lg:mb-40">
                <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6 md:mb-8 text-orange-600 px-2 sm:px-4 py-1 sm:py-2 rounded">
                  {t('home.recommendedRecipes')}
                </h2>
                <div className="relative">
                  {status === 'loading' && (
                    <p className="text-gray-500 italic text-sm sm:text-base md:text-lg px-2 sm:px-4">{t('home.loadingRecipes')}</p>
                  )}
                  {status === 'failed' && (
                    <p className="text-red-500 italic text-sm sm:text-base md:text-lg px-2 sm:px-4">{t('home.errorFetchingRecipes', { error })}</p>
                  )}
                  {status === 'succeeded' && recommendedRecipes.length === 0 && (
                    <p className="text-gray-500 italic text-sm sm:text-base md:text-lg px-2 sm:px-4">{t('home.noRecommendedRecipes')}</p>
                  )}
                  {status === 'succeeded' && recommendedRecipes.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-4">
                      {visibleRecommendedRecipes.map((recipe) => (
                        <RecipeCardHorizontal
                          key={recipe.id}
                          recipe={recipe}
                          onLike={handleLike}
                          onRate={handleRate}
                        />
                      ))}
                    </div>
                  )}
                  <button
                    onClick={handlePrevRecommendedRecipes}
                    disabled={recommendedRecipeIndex === 0}
                    aria-disabled={recommendedRecipeIndex === 0}
                    className="absolute top-1/2 -left-2 sm:-left-4 transform -translate-y-1/2 p-1 sm:p-2 md:p-3 rounded-full bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title={t('home.previousRecipes')}
                    aria-label={t('home.previousRecipes')}
                  >
                    <ChevronLeft className="w-4 sm:w-6 md:w-6 h-4 sm:h-6 md:h-6" />
                  </button>
                  <button
                    onClick={handleNextRecommendedRecipes}
                    disabled={recommendedRecipeIndex === recommendedMaxIndex}
                    aria-disabled={recommendedRecipeIndex === recommendedMaxIndex}
                    className="absolute top-1/2 -right-2 sm:-right-4 transform -translate-y-1/2 p-1 sm:p-2 md:p-3 rounded-full bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title={t('home.nextRecipes')}
                    aria-label={t('home.nextRecipes')}
                  >
                    <ChevronRight className="w-4 sm:w-6 md:w-6 h-4 sm:h-6 md:h-6" />
                  </button>
                </div>
              </section>

              {/* Section 3: Latest Recipes with Navigation Arrows */}
              <section className="mb-6 sm:mb-10 md:mb-20 lg:mb-40">
                <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6 md:mb-8 text-orange-600 px-2 sm:px-4 py-1 sm:py-2 rounded">
                  {t('home.latestRecipes')}
                </h2>
                <div className="relative">
                  {status === 'loading' && (
                    <p className="text-gray-500 italic text-sm sm:text-base md:text-lg px-2 sm:px-4">{t('home.loadingRecipes')}</p>
                  )}
                  {status === 'failed' && (
                    <p className="text-red-500 italic text-sm sm:text-base md:text-lg px-2 sm:px-4">{t('home.errorFetchingRecipes', { error })}</p>
                  )}
                  {status === 'succeeded' && latestRecipes.length === 0 && (
                    <p className="text-gray-500 italic text-sm sm:text-base md:text-lg px-2 sm:px-4">{t('home.noResultsFound', 'No recipes found')}</p>
                  )}
                  {status === 'succeeded' && latestRecipes.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-4">
                      {visibleLatestRecipes.map((recipe) => (
                        <RecipeCard
                          key={recipe.id}
                          recipe={recipe}
                          onLike={handleLike}
                          onRate={handleRate}
                        />
                      ))}
                    </div>
                  )}
                  <button
                    onClick={handlePrevLatestRecipes}
                    disabled={latestRecipeIndex === 0}
                    aria-disabled={latestRecipeIndex === 0}
                    className="absolute top-1/2 -left-2 sm:-left-4 transform -translate-y-1/2 p-1 sm:p-2 md:p-3 rounded-full bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title={t('home.previousRecipes')}
                    aria-label={t('home.previousRecipes')}
                  >
                    <ChevronLeft className="w-4 sm:w-6 md:w-6 h-4 sm:h-6 md:h-6" />
                  </button>
                  <button
                    onClick={handleNextLatestRecipes}
                    disabled={latestRecipeIndex === latestMaxIndex}
                    aria-disabled={latestRecipeIndex === latestMaxIndex}
                    className="absolute top-1/2 -right-2 sm:-right-4 transform -translate-y-1/2 p-1 sm:p-2 md:p-3 rounded-full bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title={t('home.nextRecipes')}
                    aria-label={t('home.nextRecipes')}
                  >
                    <ChevronRight className="w-4 sm:w-6 md:w-6 h-4 sm:h-6 md:h-6" />
                  </button>
                </div>
              </section>

              {/* Section 4: Regions */}
              <section>
                <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6 md:mb-8 text-orange-600 px-2 sm:px-4 py-1 sm:py-2 rounded">
                  {t('home.exploreByRegion')}
                </h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 px-2 sm:px-4">
                  {REGIONS.slice(0, 5).map(({ key, name, image }) => (
                    <div key={key} className="flex flex-col items-center">
                      <div
                        className="w-20 sm:w-28 md:w-40 h-20 sm:h-28 md:h-40 rounded-full bg-cover bg-center relative overflow-hidden"
                        style={{ backgroundImage: `url(${image})` }}
                      />
                      <p
                        onClick={() => handleRegionClick(key)}
                        className="mt-1 sm:mt-2 text-center text-xs sm:text-sm md:text-base font-medium text-orange-700 cursor-pointer hover:text-orange-900"
                        title={t(`home.${key}`, name)}
                        aria-label={t(`home.${key}`, name)}
                      >
                        {t(`home.${key}`, name)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-4">
                  {REGIONS.slice(5, 10).map(({ key, name, image }) => (
                    <div key={key} className="flex flex-col items-center">
                      <div
                        className="w-20 sm:w-28 md:w-40 h-20 sm:h-28 md:h-40 rounded-full bg-cover bg-center relative overflow-hidden"
                        style={{ backgroundImage: `url(${image})` }}
                      />
                      <p
                        onClick={() => handleRegionClick(key)}
                        className="mt-1 sm:mt-2 text-center text-xs sm:text-sm md:text-base font-medium text-orange-700 cursor-pointer hover:text-orange-900"
                        title={t(`home.${key}`, name)}
                        aria-label={t(`home.${key}`, name)}
                      >
                        {t(`home.${key}`, name)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}