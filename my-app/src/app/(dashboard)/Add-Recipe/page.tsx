"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { addRecipe } from '@/store/RecipeSlice';
import { v4 as uuidv4 } from 'uuid';
import type { VisibleOn } from '@/model/Recipe';
import { useTranslation } from 'react-i18next';

export default function AddRecipePage() {
  const dispatch = useDispatch();
  const { t } = useTranslation('addRecipe');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState<string[]>(['']);
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [openStep, setOpenStep] = useState<number | null>(null);

  // Define category keys with fallback labels
  const categoryKeys = [
    { key: 'northWest', fallback: 'North West' },
    { key: 'southWest', fallback: 'South West' },
    { key: 'littoral', fallback: 'Littoral' },
    { key: 'centre', fallback: 'Centre' },
    { key: 'farNorth', fallback: 'Far North' },
    { key: 'west', fallback: 'West' },
    { key: 'south', fallback: 'South' },
    { key: 'north', fallback: 'North' },
    { key: 'east', fallback: 'East' },
    { key: 'adamawa', fallback: 'Adamawa' },
    { key: 'westAfrican', fallback: 'West African' },
    { key: 'centralAfrican', fallback: 'Central African' },
    { key: 'northAfrican', fallback: 'North African' },
    { key: 'vegetarian', fallback: 'Vegetarian' },
    { key: 'quickEasy', fallback: 'Quick & Easy' },
    { key: 'streetFood', fallback: 'Street Food' },
    { key: 'international', fallback: 'International' },
    { key: 'snacks', fallback: 'Snacks' },
    { key: 'breakfasts', fallback: 'Breakfasts' },
    { key: 'desserts', fallback: 'Desserts' },
    { key: 'drinks', fallback: 'Drinks' },
  ];

  // Map categories with fallback logic
  const categories = categoryKeys.map(({ key, fallback }) => {
    const label = t(`categories.${key}`);
    // Log to debug translation resolution
    console.log(`Translation for categories.${key}:`, label);
    return {
      value: key,
      label: label.includes('categories.') ? fallback : label,
    };
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(t('addRecipe.alertFileTooLarge'));
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
      if (openStep === index) setOpenStep(null);
    }
  };

  const toggleStep = (index: number) => {
    setOpenStep(openStep === index ? null : index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !category || !ingredients || !minPrice || steps.some(step => !step)) {
      alert(t('addRecipe.alertMissingFields'));
      return;
    }

    const ingredientsArray = ingredients.split(',').map(item => item.trim()).filter(item => item.length > 0);
    const filteredSteps = steps.filter(step => step.trim().length > 0);

    const imageUrl = preview || '';

    const newRecipe = {
      id: uuidv4(),
      title,
      description,
      ingredients: ingredientsArray,
      steps: filteredSteps,
      category,
      minPrice,
      image: imageUrl,
      rating: 0,
      liked: false,
      visibleOn: 'both' as VisibleOn,
    };

    dispatch(addRecipe(newRecipe));
    alert(t('addRecipe.alertSubmitted'));

    setTitle('');
    setDescription('');
    setIngredients('');
    setSteps(['']);
    setCategory('');
    setMinPrice('');
    setImage(null);
    setPreview(null);
    setOpenStep(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-orange-700 mb-8">{t('addRecipe.title')}</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">{t('addRecipe.form.title')}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-5 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              placeholder={t('addRecipe.form.titlePlaceholder')}
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">{t('addRecipe.form.description')}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full px-5 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              placeholder={t('addRecipe.form.descriptionPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">{t('addRecipe.form.ingredients')}</label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
              rows={3}
              className="w-full px-5 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              placeholder={t('addRecipe.form.ingredientsPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-4">{t('addRecipe.form.instructions')}</label>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="border rounded-lg shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleStep(index)}
                    className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold transition"
                  >
                    <span>{t('addRecipe.form.stepLabel', { number: index + 1 })}</span>
                    <div className="flex items-center space-x-2">
                      <svg
                        className={`w-5 h-5 transform transition-transform ${openStep === index ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                      {steps.length > 1 && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            removeStep(index);
                          }}
                          className="cursor-pointer text-red-500 hover:text-red-600"
                          role="button"
                          aria-label={t('addRecipe.form.removeStep')}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </button>
                  {openStep === index && (
                    <div className="p-4 bg-white">
                      <textarea
                        value={step}
                        onChange={(e) => handleStepChange(index, e.target.value)}
                        required
                        rows={3}
                        className="w-full px-5 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                        placeholder={t('addRecipe.form.stepPlaceholder', { number: index + 1 })}
                      />
                    </div>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addStep}
                className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-semibold transition transform hover:scale-105"
              >
                {t('addRecipe.form.addStep')}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">{t('addRecipe.form.category')}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-5 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            >
              <option value="" disabled>{t('addRecipe.form.selectCategory')}</option>
              {categories.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">{t('addRecipe.form.minPrice')}</label>
            <input
              type="text"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              required
              className="w-full px-5 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              placeholder={t('addRecipe.form.minPricePlaceholder', { currency: 'CFA' })}
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">{t('addRecipe.form.image')}</label>
            <label className="cursor-pointer text-orange-600 hover:text-orange-700 underline transition">
              {t('addRecipe.form.chooseImage')}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {preview && (
              <div className="mt-4">
                <Image
                  src={preview}
                  alt="Recipe preview"
                  width={400}
                  height={250}
                  className="rounded-lg border shadow-md"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-full text-lg font-semibold transition transform hover:scale-105"
          >
            {t('addRecipe.form.submit')}
          </button>
        </form>
      </main>
    </div>
  );
}