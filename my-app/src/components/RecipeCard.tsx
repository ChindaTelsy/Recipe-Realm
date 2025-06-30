import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import { Recipe } from '@/model/Recipe';
import { useDispatch, useSelector } from 'react-redux';
import { deleteRecipeThunk, toggleLike, setRating } from '@/store/RecipeSlice';
import { AppDispatch, RootState } from '@/store/store'; // Import your Redux store's RootState type

interface RecipeProps {
   recipe: Recipe;
  isProfilePage?: boolean;
  onLike?: (id: string) => void;
  onRate?: (id: string, rating: number) => void;
  className?: string;
}

export default function RecipeCard({ recipe, isProfilePage = false, className }: RecipeProps) {
  const { id, title, image, category, description, liked, rating, userId } = recipe;

  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.user?.token);
  const currentUserId = useSelector((state: RootState) => state.user?.user?.id);

  const imageSrc = image
    ? image.startsWith('/') || image.startsWith('http')
      ? image
      : `/storage/images/${image}`
    : '/images/placeholder.jpg';

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

  const handleDelete = () => {
    if (!token) {
      alert('You must be logged in to delete a recipe.');
      return;
    }
    if (!confirm('Are you sure you want to delete this recipe?')) return;
    dispatch(deleteRecipeThunk({ recipeId: id as string, token }));
  };

  const handleLike = () => {
    if (token) {
      dispatch(toggleLike(id as string));
    }
  };

  const handleRate = (newRating: number) => {
    if (token) {
      dispatch(setRating({ id: id as string, rating: newRating }));
    }
  };

  const isOwner = userId && currentUserId ? userId === currentUserId : false;

  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md ${className || ''}`}>
      <Link href={`/recipes/${id}`}>
        <div className="relative w-full h-48">
          <Image src={imageSrc} alt={title} fill className="object-cover" />
        </div>
      </Link>

      <div className="p-3 min-h-[120px]">
        <div className="flex justify-between items-start">
          <Link href={`/recipes/${id}`}>
            <h2 className="text-xl font-semibold text-gray-800 hover:underline">
              {title}
            </h2>
          </Link>
          <button onClick={handleLike} aria-label="Like recipe">
            <Heart
              className={`w-5 h-5 cursor-pointer ${liked ? 'text-red-600 fill-red-600' : 'text-red-300 hover:text-red-500'}`}
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
            >
              <Star
                className={`w-4 h-4 ${idx < (rating || 0) ? 'fill-yellow-400' : 'stroke-yellow-400'}`}
                fill={idx < (rating || 0) ? '#FBBF24' : 'none'}
              />
            </button>
          ))}
        </div>
        {isProfilePage && userId && isOwner && (
          <button
            onClick={handleDelete}
            className="mt-2 text-red-600 hover:text-red-800 text-sm"
            aria-label="Delete recipe"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}