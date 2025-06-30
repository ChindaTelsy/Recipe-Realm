'use client';

import { useMemo, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import RecipeCard from '@/components/RecipeCard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { toggleLike, setRating } from '@/store/RecipeSlice';
import { useTranslation } from 'react-i18next';

const ALL_CATEGORIES_KEYS = [
  'all', 'northWest', 'southWest', 'littoral', 'centre',
  'farNorth', 'west', 'south', 'north', 'east', 'adamawa',
  'westAfrica', 'centralAfrica', 'northAfrica', 'southAfrica', 'vegetarian',
  'quickEasy', 'streetFood', 'international Cuisine', 'snacks', 'breakfasts',
  'desserts', 'drinks'
];

export default function CategoriesPage() {
  const { t } = useTranslation('feed');
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const token = useSelector((state: RootState) => state.user.token);
  const categoryParam = searchParams.get('category') || 'all';
  const fromParam = searchParams.get('from') || 'welcome'; // Default to welcome if no from param

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 20;

  const visibleRecipes = useMemo(() => {
    const isFromHome = fromParam === 'home' && token;
    return recipes.filter(recipe =>
      isFromHome
        ? recipe.visibleOn === 'home' || recipe.visibleOn === 'both'
        : recipe.visibleOn === 'welcome' || recipe.visibleOn === 'both'
    );
  }, [recipes, fromParam, token]);

  const categoryMapping: { [key: string]: string } = {
    NorthWest: 'northwest',
    SouthWest: 'southwest',
    Littoral: 'littoral',
    Centre: 'centre',
    FarNorth: 'farNorth',
    West: 'west',
    South: 'south',
    North: 'north',
    East: 'east',
    Adamawa: 'adamawa',
    WestAfrica: 'westAfrica',
    CentralAfrica: 'centralAfrica',
    NorthAfrica: 'northAfrica',
    SouthAfrica: 'southAfrica',
    Vegetarian: 'vegetarian',
    QuickEasy: 'quickEasy',
    StreetFood: 'streetFood',
    International: 'international Cuisine',
    Snacks: 'snacks',
    Breakfasts: 'breakfasts',
    Desserts: 'desserts',
    Drinks: 'drinks',
    all: 'all',
  };

  const filteredRecipes = useMemo(() => {
    if (selectedCategory === 'all') return visibleRecipes;

    const normalizedCategoryParam = selectedCategory.toLowerCase().trim();
    const categoryMatch = Object.entries(categoryMapping).find(
      ([key, value]) => key.toLowerCase() === normalizedCategoryParam || value.toLowerCase() === normalizedCategoryParam
    );
    const targetCategory = categoryMatch ? categoryMatch[1] : normalizedCategoryParam;

    return visibleRecipes.filter(recipe =>
      (recipe.category?.toLowerCase().trim() ?? '') === targetCategory.toLowerCase()
    );
  }, [visibleRecipes, selectedCategory]);

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const paginatedRecipes = filteredRecipes.slice(
    (currentPage - 1) * recipesPerPage,
    currentPage * recipesPerPage
  );

  const handleLike = useCallback((id: string) => {
    if (!token) {
      router.push('/login');
      return;
    }
    dispatch(toggleLike(id));
  }, [dispatch, token, router]);

  const handleRate = useCallback((id: string, rating: number) => {
    if (!token) {
      router.push('/login');
      return;
    }
    dispatch(setRating({ id, rating }));
  }, [dispatch, token, router]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    router.push(`?category=${category.toLowerCase()}&from=${fromParam}`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-orange-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-700 transition-colors"
        >
          {t('categories.previous')}
        </button>
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-1 bg-white text-orange-700 rounded hover:bg-orange-100"
            >
              1
            </button>
            {startPage > 2 && <span className="px-3 py-1">...</span>}
          </>
        )}
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 ${page === currentPage ? 'bg-orange-600 text-white' : 'bg-white text-orange-700'} rounded hover:bg-orange-100`}
          >
            {page}
          </button>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-3 py-1">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-1 bg-white text-orange-700 rounded hover:bg-orange-100"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-orange-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-700 transition-colors"
        >
          {t('categories.next')}
        </button>
      </div>
    );
  };

  const recipeCount = filteredRecipes.length;
  let sidebarHeight;
  if (recipeCount <= 8) {
    sidebarHeight = 'h-screen';
  } else if (recipeCount < 20) {
    const minHeight = 100;
    const maxHeight = 200;
    const heightFactor = (recipeCount - 8) / (20 - 8);
    sidebarHeight = `h-[${minHeight + (maxHeight - minHeight) * heightFactor}vh]`;
  } else {
    sidebarHeight = 'h-[200vh]';
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <main className="flex-grow flex">
        <aside className={`w-full md:w-64 bg-white p-6 overflow-y-auto fixed md:static ${sidebarHeight}`}>
          <h2 className="font-playfair text-2xl font-semibold mb-4">{t('categories.title')}</h2>
          <div className="space-y-2">
            {ALL_CATEGORIES_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => handleCategoryClick(key)}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === key
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-orange-700 hover:bg-orange-100'
                }`}
                title={t('categories.filterByCategory', { category: t(`categories.${key}`) })}
              >
                {t(`categories.${key}`)}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-grow p-6 ml-0 md:ml-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedRecipes.length > 0 ? (
              paginatedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onLike={handleLike}
                  onRate={handleRate}
                />
              ))
            ) : (
              <p className="text-gray-600 text-center col-span-full">
                {t('categories.noResultsForCategory', { category: t(`categories.${selectedCategory}`) })}
              </p>
            )}
          </div>
          {renderPagination()}
        </div>
      </main>
    </div>
  );
}