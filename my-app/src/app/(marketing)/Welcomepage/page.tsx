'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { toggleLike, setRating, setRecommendedRecipes } from '@/store/RecipeSlice';
import { useTranslation } from 'react-i18next';
import RecipeCard from '@/components/RecipeCard';
import RecipeCardHorizontal from '@/components/RecipeCardHorz';
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

const images = [
  '/images/family.jpg',
  '/images/hero.jpeg',
  '/images/back.jpeg',
  '/images/pic.jpg',
  '/images/drinks.jpg',
  '/images/soya.jpeg',
  '/images/drink.avif',
];

const FALLBACK_IMAGE = '/images/placeholder.jpg'; // Placeholder image for fallbacks

export default function Welcomepage() {
  const { t } = useTranslation('welcome');
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.user.user);
  const userRegion = user?.location?.toLowerCase() ?? 'centre';
  const { recommendedRecipes, recipes } = useSelector((state: RootState) => state.recipes);

  const [index, setIndex] = useState(0);
  const [recommendedRecipeIndex, setRecommendedRecipeIndex] = useState(0);
  const [latestRecipeIndex, setLatestRecipeIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    dispatch(setRecommendedRecipes(userRegion));
  }, [dispatch, userRegion]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsSearchMode(!!debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  const categoryParam = searchParams.get('category') || 'all';

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
      recipe.visibleOn === 'welcome' || recipe.visibleOn === 'both'
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
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
        {/* Search Bar */}
        <section className="mb-4 sm:mb-6 md:mb-8">
          <div className="relative max-w-xs sm:max-w-sm md:max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t('welcome.searchPlaceholder', 'Search recipes...')}
              className="w-full p-2 sm:p-3 pr-8 sm:pr-10 rounded-full border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
              aria-label={t('welcome.searchPlaceholder', 'Search recipes...')}
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-orange-600 hover:text-orange-800 text-sm sm:text-base"
                title={t('welcome.clearSearch', 'Clear search')}
                aria-label={t('welcome.clearSearch', 'Clear search')}
              >
                ✕
              </button>
            )}
          </div>
        </section>

        {/* Conditional Rendering based on Search Mode */}
        {isSearchMode ? (
          <section className="min-h-screen px-2 sm:px-4">
            <h2 className="font-playfair text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-orange-600 px-2 sm:px-4 py-1 sm:py-2 rounded">
              {t('welcome.searchResults', 'Search Results')}
            </h2>
            {filteredRecipes.length === 0 ? (
              <p className="text-gray-500 italic text-sm sm:text-base px-2 sm:px-4">{t('welcome.noResultsFound', 'No recipes found')}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-4">
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
            <section className="mb-6 sm:mb-10 md:mb-30">
              <div className="flex flex-col items-center sm:items-start md:flex-row justify-between gap-6 sm:gap-8 md:gap-16">
                <div className="w-full md:w-1/2 order-1">
                  <div className="relative bg-gradient-to-r from-orange-500 to-orange-700 text-white p-4 sm:p-6 md:p-12 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg">
                    <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 tracking-tight text-white px-2 sm:px-4 rounded">
                      {t('welcome.welcomeTitle')}
                    </h2>
                    <p className="text-lg sm:text-xl md:text-2xl leading-relaxed px-2 sm:px-4">
                      {t('welcome.welcomeDescription')}
                    </p>
                    <div className="absolute top-0 left-0 w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 bg-orange-300 rounded-full -translate-x-3 sm:-translate-x-4 md:-translate-x-6 -translate-y-3 sm:-translate-y-4 md:-translate-y-6 opacity-50"></div>
                    <div className="absolute bottom-0 right-0 w-16 sm:w-20 md:w-32 h-16 sm:h-20 md:h-32 bg-orange-300 rounded-full translate-x-4 sm:translate-x-6 md:translate-x-8 translate-y-4 sm:translate-y-6 md:translate-y-8 opacity-50"></div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 order-2">
                  <div className="relative w-full max-w-xs sm:max-w-md md:max-w-2xl h-48 sm:h-64 md:h-[500px] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                    <picture>
                      <source srcSet={images[index]} type="image/jpeg" />
                      <source srcSet={images[index].replace('.jpg', '.webp').replace('.jpeg', '.webp').replace('.png', '.webp')} type="image/webp" />
                      <img
                        src={FALLBACK_IMAGE}
                        alt={t('welcome.featuredDishAlt', 'Featured dish')}
                        className="w-full h-full object-cover rounded-xl sm:rounded-2xl md:rounded-3xl transition-opacity duration-1000 ease-in-out"
                        onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                      />
                    </picture>
                    <div className="absolute inset-0 border-4 sm:border-6 md:border-8 border-orange-200 rounded-xl sm:rounded-2xl md:rounded-3xl pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Recommended Recipes with Navigation Arrows */}
            <section className="mb-6 sm:mb-10 md:mb-30">
              <h2 className="font-playfair text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-orange-600 px-2 sm:px-4 py-1 sm:py-2 rounded">
                {t('welcome.recommendedRecipes')}
              </h2>
              <div className="relative">
                {recommendedRecipes.length === 0 ? (
                  <p className="text-gray-500 italic text-sm sm:text-base px-2 sm:px-4">{t('welcome.noRecommendedRecipes')}</p>
                ) : (
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
                  className="absolute top-1/2 -left-2 sm:-left-4 transform -translate-y-1/2 p-1 sm:p-2 rounded-full bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={t('welcome.previousRecipes')}
                  aria-label={t('welcome.previousRecipes')}
                >
                  <ChevronLeft className="w-4 sm:w-6 h-4 sm:h-6" />
                </button>
                <button
                  onClick={handleNextRecommendedRecipes}
                  disabled={recommendedRecipeIndex === recommendedMaxIndex}
                  aria-disabled={recommendedRecipeIndex === recommendedMaxIndex}
                  className="absolute top-1/2 -right-2 sm:-right-4 transform -translate-y-1/2 p-1 sm:p-2 rounded-full bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={t('welcome.nextRecipes')}
                  aria-label={t('welcome.nextRecipes')}
                >
                  <ChevronRight className="w-4 sm:w-6 h-4 sm:h-6" />
                </button>
              </div>
            </section>

            {/* Section 3: Latest Recipes with Navigation Arrows */}
            <section className="mb-6 sm:mb-10 md:mb-30">
              <h2 className="font-playfair text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-orange-600 px-2 sm:px-4 py-1 sm:py-2 rounded">
                {t('welcome.latestRecipes')}
              </h2>
              <div className="relative">
                {latestRecipes.length === 0 ? (
                  <p className="text-gray-500 italic text-sm sm:text-base px-2 sm:px-4">{t('welcome.noResultsFound', 'No recipes found')}</p>
                ) : (
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
                  className="absolute top-1/2 -left-2 sm:-left-4 transform -translate-y-1/2 p-1 sm:p-2 rounded-full bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={t('welcome.previousRecipes')}
                  aria-label={t('welcome.previousRecipes')}
                >
                  <ChevronLeft className="w-4 sm:w-6 h-4 sm:h-6" />
                </button>
                <button
                  onClick={handleNextLatestRecipes}
                  disabled={latestRecipeIndex === latestMaxIndex}
                  aria-disabled={latestRecipeIndex === latestMaxIndex}
                  className="absolute top-1/2 -right-2 sm:-right-4 transform -translate-y-1/2 p-1 sm:p-2 rounded-full bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={t('welcome.nextRecipes')}
                  aria-label={t('welcome.nextRecipes')}
                >
                  <ChevronRight className="w-4 sm:w-6 h-4 sm:h-6" />
                </button>
              </div>
            </section>

            {/* Section 4: Regions */}
            <section>
              <h1 className="font-playfair text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-orange-600 px-2 sm:px-4 py-1 sm:py-2 rounded">
                {t('welcome.exploreByRegion')}
              </h1>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 px-2 sm:px-4">
                {REGIONS.slice(0, 5).map(({ key, name, image }) => (
                  <div key={key} className="flex flex-col items-center">
                    <div className="w-20 sm:w-28 md:w-40 h-20 sm:h-28 md:h-40 rounded-full overflow-hidden relative">
                      <picture>
                        <source srcSet={image} type={image.endsWith('.png') ? 'image/png' : 'image/jpeg'} />
                        <source srcSet={image.replace('.jpg', '.webp').replace('.jpeg', '.webp').replace('.png', '.webp').replace('.avif', '.webp')} type="image/webp" />
                        <img
                          src={FALLBACK_IMAGE}
                          alt={t(`welcome.${key}`, name)}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                        />
                      </picture>
                    </div>
                    <p
                      onClick={() => handleRegionClick(key)}
                      className="mt-1 sm:mt-2 text-center text-xs sm:text-sm md:text-base font-medium text-orange-700 cursor-pointer hover:text-orange-900"
                      title={t(`welcome.${key}`, name)}
                      aria-label={t(`welcome.${key}`, name)}
                    >
                      {t(`welcome.${key}`, name)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-4">
                {REGIONS.slice(5, 10).map(({ key, name, image }) => (
                  <div key={key} className="flex flex-col items-center">
                    <div className="w-20 sm:w-28 md:w-40 h-20 sm:h-28 md:h-40 rounded-full overflow-hidden relative">
                      <picture>
                        <source srcSet={image} type={image.endsWith('.png') ? 'image/png' : 'image/jpeg'} />
                        <source srcSet={image.replace('.jpg', '.webp').replace('.jpeg', '.webp').replace('.png', '.webp').replace('.avif', '.webp')} type="image/webp" />
                        <img
                          src={FALLBACK_IMAGE}
                          alt={t(`welcome.${key}`, name)}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                        />
                      </picture>
                    </div>
                    <p
                      onClick={() => handleRegionClick(key)}
                      className="mt-1 sm:mt-2 text-center text-xs sm:text-sm md:text-base font-medium text-orange-700 cursor-pointer hover:text-orange-900"
                      title={t(`welcome.${key}`, name)}
                      aria-label={t(`welcome.${key}`, name)}
                    >
                      {t(`welcome.${key}`, name)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}