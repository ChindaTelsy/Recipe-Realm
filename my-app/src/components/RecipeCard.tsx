import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import { Recipe } from '@/model/Recipe';


interface RecipeProps {
  recipe: Recipe;
  onLike?: (id: string) => void;
  onRate?: (id: string, rating: number) => void;
}

export default function RecipeCard({ recipe, onLike, onRate }: RecipeProps) {
 
  const { id, title, image, category, description, liked, rating } = recipe;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md">
      <Link href={`/recipes/${id}`}>
        <div className="relative w-full h-48"> {/* Reduced height for consistency with HomePage */}
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      <div className="p-3 min-h-[120px]"> {/* Reduced padding and min-height */}
        <div className="flex justify-between items-start">
          <Link href={`/recipes/${id}`}>
            <h2 className=" text-xl font-semibold text-gray-800 hover:underline">
              {title}
            </h2>
          </Link>
          <button onClick={() => onLike?.(id)} aria-label="Like recipe">
            <Heart
              className={`w-5 h-5 cursor-pointer ${liked ? 'text-red-600 fill-red-600' : 'text-red-300 hover:text-red-500'}`}
            />
          </button>
        </div>
        <p className="text-xl text-gray-600">{category}</p> {/* Added category display */}
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
        <div className="flex mt-2 text-yellow-400">
          {[...Array(5)].map((_, idx) => (
            <button key={idx} onClick={() => onRate?.(id, idx + 1)} aria-label={`Rate ${idx + 1} stars`}>
              <Star
                className={`w-4 h-4 ${idx < (rating || 0) ? 'fill-yellow-400' : 'stroke-yellow-400'}`}
                fill={idx < (rating || 0) ? 'currentColor' : 'none'}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}