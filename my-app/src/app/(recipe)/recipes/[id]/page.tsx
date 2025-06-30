'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { toggleLike, setRating } from '@/store/RecipeSlice';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Define Recipe type to match Redux store structure
interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  ingredients: string[];
  steps: string[];
  likes?: number;
  liked?: boolean;
  rating?: number;
  minPrice: string;
  prepTime: string;
  cookTime: string;
  reviews?: { id: number; user: string; rating: number }[];
}

const FALLBACK_IMAGE = '/images/placeholder.webp'; // Ensure this exists

export default function RecipePage() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { recipes, status } = useSelector((state: RootState) => state.recipes);
  const user = useSelector((state: RootState) => state.user.user);

  // Find recipe or show not found
  const recipe = recipes.find((r) => r.id === id) as Recipe | undefined;
  if (!recipe || status === 'loading') return notFound(); // Handle loading state

  // Initialize state with recipe data, syncing with Redux
  const [liked, setLiked] = useState(recipe.liked || false);
  const [likes, setLikes] = useState(recipe.likes || 0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [reviews, setReviews] = useState(recipe.reviews || []);
  const [openStep, setOpenStep] = useState<number | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Sync local state with Redux after actions
  useEffect(() => {
    setLiked(recipe.liked || false);
    setLikes(recipe.likes || 0);
    setReviews(recipe.reviews || []);
  }, [recipe]);

  const handleLike = () => {
    dispatch(toggleLike(recipe.id));
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleRating = (rating: number) => {
    dispatch(setRating({ id: recipe.id, rating }));
    setUserRating(rating);
    setReviews((prev) => [
      ...prev,
      { id: Date.now(), user: user?.name || 'You', rating },
    ]);
  };

  const toggleStep = (index: number) => {
    setOpenStep(openStep === index ? null : index);
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : recipe.rating || 0;

  const generatePDF = async () => {
    if (!pdfRef.current) return;
    setIsGeneratingPDF(true);
    try {
      const canvas = await html2canvas(pdfRef.current!, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${recipe.title}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 text-gray-800">
      <main className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 space-y-10">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Title, Description, Save Button, Likes, and Ratings */}
            <div className="w-full md:w-1/2">
              <h1 className="text-3xl md:text-4xl font-bold text-orange-700 mb-4">{recipe.title}</h1>
              <p className="text-gray-600 text-base md:text-lg mb-4">{recipe.description}</p>
              <button
                onClick={generatePDF}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold mb-4 transition-all duration-300 ease-in-out hover:scale-105 disabled:opacity-50"
                disabled={isGeneratingPDF}
              >
                Save as PDF
              </button>
              <p className="text-gray-700 text-sm md:text-base mb-4"><strong>Estimated Cost:</strong> {recipe.minPrice}</p>
              <div className="flex items-center space-x-6 mb-4">
                <div
                  onClick={handleLike}
                  className="flex items-center space-x-2 text-red-500 cursor-pointer hover:text-red-600 transition-colors"
                >
                  <span className="text-xl">{liked ? '💖' : '🤍'}</span>
                  <span className="font-medium text-lg">{likes} Likes</span>
                </div>
                <div className="flex items-center space-x-1 text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="cursor-pointer text-2xl"
                      onClick={() => handleRating(i + 1)}
                    >
                      {i < (userRating ?? Math.round(averageRating)) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Image Frame */}
            <div className="w-full md:w-1/2 flex justify-end">
              <div className="w-full max-w-xs h-64 md:h-72 bg-white rounded-lg shadow-md overflow-hidden">
                <picture>
                  <source srcSet={recipe.image} type={recipe.image.endsWith('.png') ? 'image/png' : 'image/jpeg'} />
                  <source srcSet={recipe.image.replace('.jpg', '.webp').replace('.jpeg', '.webp').replace('.png', '.webp')} type="image/webp" />
                  <img
                    src={FALLBACK_IMAGE}
                    alt={recipe.title}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; console.log(`Image failed, using fallback for ${recipe.image}`); }}
                  />
                </picture>
              </div>
            </div>
          </div>

          <hr className="border-t border-gray-200" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm1-6a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
              <span className="text-base font-medium"><strong>Prep Time:</strong> {recipe.prepTime}</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm1-6a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
              <span className="text-base font-medium"><strong>Cook Time:</strong> {recipe.cookTime}</span>
            </div>
          </div>

          <hr className="border-t border-gray-200" />

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-orange-700">Ingredients</h2>
            <ul className="list-disc pl-5 space-y-2">
              {recipe.ingredients.map((item, idx) => (
                <li key={idx} className="text-base text-gray-800">{item}</li>
              ))}
            </ul>
          </div>

          <hr className="border-t border-gray-200" />

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-orange-700">Preparation Steps</h2>
            <div className="space-y-3">
              {recipe.steps.map((step, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg shadow-sm bg-white">
                  <button
                    onClick={() => toggleStep(idx)}
                    className="w-full flex items-center justify-between p-4 text-left text-gray-800 font-medium hover:bg-gray-50 transition-colors"
                  >
                    <span>Step {idx + 1}</span>
                    <svg
                      className={`w-5 h-5 transform transition-transform ${openStep === idx ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openStep === idx && (
                    <div className="p-4 text-gray-700">
                      <p className="text-sm md:text-base">{step}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <hr className="border-t border-gray-200" />

          {recipe.reviews && reviews.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-orange-700">Reviews</h2>
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg bg-orange-50 p-4 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{review.user}</span>
                      <span className="text-yellow-500 text-lg">⭐ {review.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hidden PDF for download */}
        <div
          ref={pdfRef}
          className={`fixed top-0 left-0 w-full h-full bg-white p-6 sm:p-8 lg:p-10 overflow-auto z-50 ${isGeneratingPDF ? 'block' : 'hidden'}`}
          style={{ boxSizing: 'border-box' }}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-700 mb-4">{recipe.title}</h1>
          <p className="text-lg sm:text-xl mb-4"><strong>Estimated Minimum Cost:</strong> {recipe.minPrice}</p>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2">Ingredients</h2>
          <ul className="list-disc pl-6 space-y-2">
            {recipe.ingredients.map((item, idx) => (
              <li key={idx} className="text-base sm:text-lg">{item}</li>
            ))}
          </ul>
          <h2 className="text-2xl sm:text-3xl font-semibold mt-4 mb-2">Preparation Steps</h2>
          <ol className="list-decimal pl-6 space-y-2">
            {recipe.steps.map((step, idx) => (
              <li key={idx} className="text-base sm:text-lg">{step}</li>
            ))}
          </ol>
        </div>
      </main>
    </div>
  );
}