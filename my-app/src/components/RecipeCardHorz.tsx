import React from 'react';
import { Heart, Star } from 'lucide-react';
import Image from 'next/image';
import { Recipe } from '@/model/Recipe';

interface RecipeCardHorizontalProps {
  recipe: Recipe;
  onLike: (id: string) => void;
  onRate: (id: string, rating: number) => void;
}

const RecipeCardHorizontal: React.FC<RecipeCardHorizontalProps> = ({
  recipe,
  onLike,
  onRate,
}) => {
  return (
    <div className="flex flex-col sm:flex-row bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
       {/* left: Recipe Image */}
      <div className="w-full sm:w-1/3 relative h-54 sm:h-auto">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          style={{ objectFit: 'cover' }}
          className="w-full h-full"
        />
      </div>
      
      {/* right: Recipe Details */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{recipe.title}</h3>
          <p className="text-gray-600 mt-2">{recipe.description}</p>
          <p className="text-sm text-gray-500 mt-1">Region: {recipe.region}</p>
        </div>
        <div className="flex items-center mt-4 space-x-4">
          <button
            onClick={() => onLike(recipe.id)}
            className={`flex items-center ${
              recipe.liked ? 'text-red-600' : 'text-orange-600'
            } hover:text-orange-800`}
            aria-label={recipe.liked ? 'Unlike recipe' : 'Like recipe'}
          >
            <Heart className={`w-5 h-5 mr-1 ${recipe.liked ? 'fill-current' : ''}`} />
            <span>{recipe.liked ? 'Unlike' : 'Like'}</span>
          </button>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 cursor-pointer ${
                  star <= recipe.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
                onClick={() => onRate(recipe.id, star)}
              />
            ))}
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default RecipeCardHorizontal;