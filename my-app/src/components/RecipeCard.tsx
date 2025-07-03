'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteRecipeThunk, toggleLike, setRating, updateRecipeFields } from '@/store/RecipeSlice';
import { AppDispatch, RootState } from '@/store/store';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Recipe } from '@/model/Recipe';

interface RecipeProps {
  recipe: Recipe;
  isProfilePage?: boolean;
  className?: string;
}

export default function RecipeCard({ recipe, isProfilePage = false, className }: RecipeProps) {
  const { id, title, image, category, description, liked, rating, userId } = recipe;
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation('recipe');
  const token = useSelector((state: RootState) => state.user?.token);
  const currentUserId = useSelector((state: RootState) => state.user?.user?.id);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localLiked, setLocalLiked] = useState<boolean>(liked || false);
  const [localRating, setLocalRating] = useState<number>(rating || 0);

  const imageSrc = image || '/default-recipe.png';

  const categoryKeys = [
    { id: 14, name: 'Vegetarian' },
    { id: 15, name: 'Quick & Easy' },
    { id: 16, name: 'Street Food' },
    { id: 17, name: 'International' },
    { id: 18, name: 'Snacks' },
    { id: 19, name: 'Breakfasts' },
    { id: 20, name: 'Desserts' },
    { id: 21, name: 'Drinks' },
  ];

  const categoryName = categoryKeys.find((cat) => cat.id === parseInt(category as string))?.name || (category as string);

  // Initialize localLiked and localRating from localStorage for unauthenticated users
  useEffect(() => {
    if (!token) {
      // Handle likes
      const storedLikes = localStorage.getItem('recipeLikes');
      const likedRecipes = storedLikes ? JSON.parse(storedLikes) : {};
      setLocalLiked(!!likedRecipes[id]);

      // Handle ratings
      const storedRatings = localStorage.getItem('recipeRatings');
      const ratedRecipes = storedRatings ? JSON.parse(storedRatings) : {};
      setLocalRating(ratedRecipes[id] || 0);
    } else {
      setLocalLiked(liked || false);
      setLocalRating(rating || 0);
    }
  }, [id, liked, rating, token]);

  const handleDelete = () => {
    if (!token) {
      toast.error(t('recipe.loginRequired', 'You must be logged in to delete a recipe.'));
      return;
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!token) {
      toast.error(t('recipe.loginRequired', 'You must be logged in to delete a recipe.'));
      setShowDeleteModal(false);
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(deleteRecipeThunk({ recipeId: id as string, token })).unwrap();
      toast.success(t('recipe.recipeDeleted', 'Recipe deleted successfully'));
    } catch (error: any) {
      toast.error(t('recipe.deleteFailed', 'Failed to delete recipe'));
      console.error('Delete error:', error);
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleLike = async () => {
    setIsLoading(true);

    if (token) {
      // Authenticated user: Update like via Redux and API
      console.log('Liking recipe (authenticated):', { id, title, image: imageSrc, isProfilePage });
      dispatch(updateRecipeFields({ id, liked: !liked }));

      try {
        await dispatch(toggleLike({ id: id as string, isProfilePage })).unwrap();
        toast.success(t('recipe.likeToggled', liked ? 'Recipe unliked' : 'Recipe liked'));
        setLocalLiked(!liked);
      } catch (error: any) {
        dispatch(updateRecipeFields({ id, liked }));
        toast.error(t('recipe.likeFailed', 'Failed to toggle like'));
        console.error('Like error:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Unauthenticated user: Update like in localStorage
      const storedLikes = localStorage.getItem('recipeLikes');
      const likedRecipes = storedLikes ? JSON.parse(storedLikes) : {};
      const newLikedState = !localLiked;

      if (newLikedState) {
        likedRecipes[id] = true;
      } else {
        delete likedRecipes[id];
      }

      localStorage.setItem('recipeLikes', JSON.stringify(likedRecipes));
      setLocalLiked(newLikedState);
      toast.success(t('recipe.likeToggled', newLikedState ? 'Recipe liked' : 'Recipe unliked'));
      setIsLoading(false);
    }
  };

  const handleRate = async (newRating: number) => {
  setIsLoading(true);

  if (token) {
    // Optimistic update
    dispatch(updateRecipeFields({ id, rating: newRating }));

    try {
      const response = await dispatch(
        setRating({ id: id as string, rating: newRating, isProfilePage })
      ).unwrap();

      const confirmedRating = response.rating ?? newRating;
      dispatch(updateRecipeFields({ id, rating: confirmedRating }));
      setLocalRating(confirmedRating);
      toast.success(t('recipe.ratingSet', 'Rating submitted'));
    } catch (error: any) {
      // Revert on error
      dispatch(updateRecipeFields({ id, rating }));
      setLocalRating(rating); // revert to old one
      toast.error(t('recipe.ratingFailed', 'Failed to set rating'));
      console.error('Rate error:', error);
    } finally {
      setIsLoading(false);
    }
  } else {
    // For unauthenticated users
    const storedRatings = localStorage.getItem('recipeRatings');
    const ratedRecipes = storedRatings ? JSON.parse(storedRatings) : {};
    ratedRecipes[id] = newRating;

    localStorage.setItem('recipeRatings', JSON.stringify(ratedRecipes));
    setLocalRating(newRating);
    toast.success(t('recipe.ratingSet', 'Rating submitted'));
    setIsLoading(false);
  }
};

  const isOwner = userId && currentUserId ? userId === currentUserId : false;

  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md ${className || ''}`}>
      <Link href={`/recipes/${id}`}>
        <div className="relative w-full h-48">
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onError={() => console.error('Image load failed:', imageSrc)}
          />
        </div>
      </Link>

      <div className="p-3 min-h-[120px]">
        <div className="flex justify-between items-start">
          <Link href={`/recipes/${id}`}>
            <h2 className="text-xl font-semibold text-gray-800 hover:underline">{title}</h2>
          </Link>
          <button onClick={handleLike} aria-label={localLiked ? 'Unlike recipe' : 'Like recipe'} disabled={isLoading}>
            <Heart
              className={`w-5 h-5 cursor-pointer ${localLiked ? 'text-red-600 fill-red-600' : 'text-red-300 hover:text-red-500'} ${isLoading ? 'opacity-50' : ''}`}
            />
          </button>
        </div>
        <p className="text-xl text-gray-600">{categoryName}</p>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
        <div className="flex mt-2 text-yellow-400">
          {[...Array(5)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleRate(idx + 1)}
              aria-label={`Rate ${idx + 1} stars`}
              disabled={isLoading}
            >
              <Star
                className={`w-4 h-4 ${idx < localRating ? 'fill-yellow-400' : 'stroke-yellow-400'} ${isLoading ? 'opacity-50' : ''}`}
                fill={idx < localRating ? '#FBBF24' : 'none'}
              />
            </button>
          ))}
        </div>
        {isProfilePage && userId && isOwner && (
          <button
            onClick={handleDelete}
            className="mt-2 text-red-600 hover:text-red-800 text-sm"
            aria-label={`Delete recipe ${title}`}
            disabled={isLoading}
          >
            {t('recipe.delete', 'Delete')}
          </button>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('recipe.confirmDeleteTitle', 'Confirm Deletion')}
            </h3>
            <p className="text-gray-600 mt-2">
              {t('recipe.confirmDelete', 'Are you sure you want to delete this recipe?')}
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
                aria-label={t('recipe.cancel', 'Cancel')}
                disabled={isLoading}
              >
                {t('recipe.cancel', 'Cancel')}
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                aria-label={t('recipe.delete', 'Delete')}
                disabled={isLoading}
              >
                {t('recipe.delete', 'Delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}