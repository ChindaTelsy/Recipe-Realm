"use client";

import React, { useRef, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Static recipe data (will be replaced with dynamic source later)
const recipeData = [
  {
    id: "1",
    title: "Ndole",
    description: "Traditional Cameroonian dish made with bitterleaf and groundnuts.",
    image: "/images/Ndole-1.webp",
    ingredients: ["Bitterleaf", "Groundnuts", "Meat", "Maggi", "Salt"],
    steps: [
      "Boil the bitterleaf and drain.",
      "Grind the groundnuts into a paste.",
      "Cook meat with seasoning.",
      "Mix all together and simmer.",
    ],
    likes: 40,
    rating: 4.7,
    author: "Jane Doe",
    prepTime: "20 mins",
    cookTime: "1 hr",
    minPrice: "5000XAF",
    reviews: [
      { id: 1, user: "Alice", rating: 5 },
      { id: 2, user: "Bob", rating: 4 },
    ],
  },
  {
    id: "2",
    title: "Eru",
    description: "Spicy green leafy vegetable dish popular in the southwest of Cameroon.",
    image: "/images/Eru.jpeg",
    ingredients: ["Eru leaves", "Waterleaf", "Palm oil", "Smoked fish", "Beef", "Crayfish"],
    steps: [
      "Prepare eru and waterleaf.",
      "Boil meat and smoked fish.",
      "Mix with oil and seasonings.",
      "Simmer until well combined.",
    ],
    likes: 32,
    rating: 4.7,
    author: "Jane Doe",
    prepTime: "15 mins",
    cookTime: "45 mins",
    minPrice: "7000XAF",
    reviews: [
      { id: 1, user: "Alice", rating: 5 },
      { id: 2, user: "Bob", rating: 4 },
    ],
  },
];

export default function RecipePage() {
  const { id } = useParams();
  const recipe = recipeData.find((r) => r.id === id);
  if (!recipe) return notFound();

  const [likes, setLikes] = useState(recipe.likes);
  const [liked, setLiked] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [reviews, setReviews] = useState(recipe.reviews);
  const [openStep, setOpenStep] = useState<number | null>(null);

  const pdfRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
    setReviews((prev) => [
      ...prev,
      { id: prev.length + 1, user: "You", rating },
    ]);
  };

  const toggleStep = (index: number) => {
    setOpenStep(openStep === index ? null : index);
  };

  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const generatePDF = async () => {
    if (!pdfRef.current) return;
    setIsGeneratingPDF(true);
    setTimeout(async () => {
      const canvas = await html2canvas(pdfRef.current!, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${recipe.title}.pdf`);
      setIsGeneratingPDF(false);
    }, 300);
  };

  return (

    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">

      {/* Save Button on the Left Side */}
        <div className="mr-0 sm:mr-4 mt-4">
            <button
              onClick={generatePDF}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 "
              disabled={isGeneratingPDF}
            >
              Save Recipe as PDF
            </button>
        </div>

      {/* Centered Content without Container */}
      <div className="mx-auto max-w-4xl bg-white/80 backdrop-blur-sm p-6 sm:p-8 lg:p-10 space-y-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6">
          {/* Title, Description, Likes, and Ratings at Top Left */}
          <div className="ml-0 sm:ml-4">
            <h1 className="text-4xl sm:text-5xl lg:text-4xl font-bold text-orange-700 mb-2">{recipe.title}</h1>
            <p className="text-gray-800  text-lg sm:text-xl lg:text-1xl mb-4">{recipe.description}</p>
            <p className="text-gray-700 text-base sm:text-sm lg:text-xl mb-4"><strong>Estimated Minimum Cost:</strong> {recipe.minPrice}</p>
            <div className="flex items-center space-x-6">
              <div
                onClick={handleLike}
                className="flex items-center space-x-2 text-red-500 cursor-pointer hover:text-red-600 transition-all duration-300"
              >
                <span className="text-1xl sm:text-1xl">{liked ? "💖" : "🤍"}</span>
                <span className="font-medium text-lg sm:text-xl">{likes} Likes</span>
              </div>
              <div className="flex items-center space-x-1 text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="cursor-pointer text-2xl sm:text-3xl"
                    onClick={() => handleRating(i + 1)}
                  >
                    {i < (userRating ?? Math.round(averageRating)) ? "★" : "☆"}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Image Frame at Top Right */}
          <div className="float-right mr-0 sm:mr-4 w-64 sm:w-72 lg:w-80 h-52 sm:h-56 lg:h-64 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <Image
              src={recipe.image}
              alt={recipe.title}
              width={320}
              height={240}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        <hr className="border-t border-gray-200" />

        <div className="flex items-center justify-start text-gray-700 space-x-8">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm1-6a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
            <span className="text-base sm:text-lg"><strong>PREP TIME:</strong> {recipe.prepTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm1-6a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
            <span className="text-base sm:text-lg"><strong>COOK TIME:</strong> {recipe.cookTime}</span>
          </div>
        </div>

        <hr className="border-t border-gray-200" />

        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-orange-700">Ingredients</h2>
          <ul className="list-disc pl-6 space-y-2">
            {recipe.ingredients.map((item, idx) => (
              <li key={idx} className="text-lg sm:text-xl text-gray-800">{item}</li>
            ))}
          </ul>
        </div>

        <hr className="border-t border-gray-200" />

        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-orange-700">Preparation Steps</h2>
          <div className="space-y-4">
            {recipe.steps.map((step, idx) => (
              <div key={idx} className="border rounded-2xl shadow-lg overflow-hidden">
                <button
                  onClick={() => toggleStep(idx)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold transition-all duration-300"
                >
                  <span>Step {idx + 1}</span>
                  <svg
                    className={`w-5 h-5 sm:w-6 sm:h-6 transform transition-transform ${openStep === idx ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openStep === idx && (
                  <div className="p-4 bg-white text-gray-800">
                    <p className="text-base sm:text-lg">{step}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <hr className="border-t border-gray-200" />

        {reviews.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-orange-700">Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border p-4 rounded-2xl bg-orange-50/50 shadow-md">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-800 text-base sm:text-lg">{review.user}</span>
                    <span className="text-yellow-500 text-lg sm:text-xl">⭐ {review.rating}</span>
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
        className={`fixed top-0 left-0 w-full h-full bg-white p-6 sm:p-8 lg:p-10 overflow-auto z-50 ${isGeneratingPDF ? "block" : "hidden"}`}
        style={{ boxSizing: "border-box" }}
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
    </div>
  );
}