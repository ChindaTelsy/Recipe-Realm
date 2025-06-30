'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { addRecipeThunk, resetStatus } from '@/store/RecipeSlice';
import axios from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/store/store';
import { toast } from 'react-toastify';

export default function AddRecipePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation('addRecipe');
  const router = useRouter();
  const { status, error } = useSelector((state: RootState) => state.recipes);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [steps, setSteps] = useState<string[]>(['']);
  const [category, setCategory] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [cookTime, setCookTime] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [openStep, setOpenStep] = useState<number | null>(null);
  const [regions, setRegions] = useState<{ value: string; label: string }[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const categoryKeys = [
    { key: 'vegetarian', fallback: 'Vegetarian', id: 14 },
    { key: 'quickEasy', fallback: 'Quick & Easy', id: 15 },
    { key: 'streetFood', fallback: 'Street Food', id: 16 },
    { key: 'international', fallback: 'International', id: 17 },
    { key: 'snacks', fallback: 'Snacks', id: 18 },
    { key: 'breakfasts', fallback: 'Breakfasts', id: 19 },
    { key: 'desserts', fallback: 'Desserts', id: 20 },
    { key: 'drinks', fallback: 'Drinks', id: 21 },
  ];

  const categories = categoryKeys.map(({ key, fallback, id }) => ({
    value: id.toString(),
    label: t(`categories.${key}`, { defaultValue: fallback }),
  }));

  useEffect(() => {
    dispatch(resetStatus());

    const fetchRegions = async () => {
      try {
        const response = await axios.get('/regions');
        const fetchedRegions = response.data.map((region: { id: number; name: string }) => ({
          value: region.id.toString(),
          label: region.name,
        }));
        setRegions(fetchedRegions);
      } catch (error: any) {
        console.error('Failed to fetch regions:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(
          error.response?.status === 500
            ? t('addRecipe.alertFailedToFetchRegions', { defaultValue: 'Server error while fetching regions.' })
            : error.response?.status === 404
            ? t('addRecipe.alertNoRegions', { defaultValue: 'No regions available.' })
            : t('addRecipe.alertNetworkError', { defaultValue: 'Network error while fetching regions.' })
        );
      }
    };
    fetchRegions();
  }, [dispatch, t]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  useEffect(() => {
    if (isSubmitted && status === 'succeeded') {
      toast.success(t('addRecipe.successMessage', { defaultValue: 'Recipe added successfully!' }));
      setTimeout(() => {
        setIsSubmitted(false);
        router.push('/Home');
      }, 2000);
    } else if (status === 'failed' && error) {
      const errorMsg =
        error === 'Recipe ID is missing in response'
          ? t('addRecipe.alertInvalidResponse', { defaultValue: 'Invalid response from server. Please try again.' })
          : error.includes('Unauthenticated')
          ? t('addRecipe.alertUnauthorized', { defaultValue: 'Your session has expired. Please log in again.' })
          : error.includes('Validation error')
          ? t('addRecipe.alertValidationError', { defaultValue: error })
          : t('addRecipe.alertServerError', { defaultValue: error });
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  }, [status, error, isSubmitted, router, t]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        const errorMsg = t('addRecipe.alertInvalidFileType', { defaultValue: 'Please select an image file.' });
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        const errorMsg = t('addRecipe.alertFileTooLarge', { defaultValue: 'Image size exceeds 5MB.' });
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
        return;
      }
      if (preview) {
        URL.revokeObjectURL(preview);
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMessage('');

      const token = localStorage.getItem('token');
      if (!token) {
        const errorMsg = t('addRecipe.unauthorized', { defaultValue: 'Please log in to add a recipe.' });
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
        return;
      }

      const trimmedTitle = title.trim();
      const trimmedDescription = description.trim();
      const trimmedCookTime = cookTime.trim();
      const trimmedPrepTime = prepTime.trim();
      const filteredIngredients = ingredientsInput
        .split('\n')
        .map((item) => item.trim())
        .filter((item) => item);
      const filteredSteps = steps.filter((step) => step.trim());
      const price = parseFloat(minPrice);

      const errors: string[] = [];
      if (!trimmedTitle) errors.push(t('addRecipe.alertMissingTitle', { defaultValue: 'Title is required.' }));
      if (!trimmedDescription) errors.push(t('addRecipe.alertMissingDescription', { defaultValue: 'Description is required.' }));
      if (filteredIngredients.length === 0) errors.push(t('addRecipe.alertMissingIngredients', { defaultValue: 'At least one ingredient is required.' }));
      if (filteredSteps.length === 0) errors.push(t('addRecipe.alertMissingSteps', { defaultValue: 'At least one step is required.' }));
      if (!category || !categories.some((c) => c.value === category))
        errors.push(t('addRecipe.alertMissingCategory', { defaultValue: 'Category is required.' }));
      if (!region || !regions.some((r) => r.value === region))
        errors.push(t('addRecipe.alertMissingRegion', { defaultValue: 'Region is required.' }));
      if (isNaN(price) || price < 0) errors.push(t('addRecipe.alertInvalidPrice', { defaultValue: 'Price must be a valid number >= 0.' }));
      if (!trimmedCookTime) errors.push(t('addRecipe.alertMissingCookTime', { defaultValue: 'Cook time is required.' }));
      if (!trimmedPrepTime) errors.push(t('addRecipe.alertMissingPrepTime', { defaultValue: 'Prep time is required.' }));

      if (errors.length > 0) {
        const errorMsg = errors.join(', ');
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
        return;
      }

      const formData = new FormData();
      formData.append('title', trimmedTitle);
      formData.append('description', trimmedDescription);
      formData.append('ingredients', JSON.stringify(filteredIngredients));
      formData.append('steps', JSON.stringify(filteredSteps));
      formData.append('category_id', category);
      formData.append('region_id', region);
      formData.append('min_price', price.toString());
      formData.append('cook_time', trimmedCookTime);
      formData.append('prep_time', trimmedPrepTime);
      formData.append('visible_on', 'both');
      if (image instanceof File) {
        formData.append('image_path', image); // Ensure the field name matches backend
        console.log('Uploading image:', image.name, 'size:', image.size, 'type:', image.type);
      }

      console.log('Submitting recipe with data:', Object.fromEntries(formData.entries()));

      try {
        const result = await dispatch(addRecipeThunk({ recipeData: formData, token })).unwrap();
        console.log('Recipe created with response:', result); // Debug full response
        if (result && 'image_path' in result) {
          console.log('Image path returned:', result.image_path);
        } else {
          console.log('No image_path returned in response, received:', result);
        }
        setIsSubmitted(true);
        setTitle('');
        setDescription('');
        setIngredientsInput('');
        setSteps(['']);
        setCategory('');
        setRegion('');
        setMinPrice('');
        setCookTime('');
        setPrepTime('');
        setImage(null);
        setPreview(null);
        setOpenStep(null);
      }catch (error: any) {
  console.error('Full error in handleSubmit:', error);
  const errorMsg =
    error === 'Recipe ID is missing in response'
      ? t('addRecipe.alertInvalidResponse', { defaultValue: 'Invalid response from server. Please try again.' })
      : error.includes?.('Unauthenticated')
        ? t('addRecipe.alertUnauthorized', { defaultValue: 'Your session has expired. Please log in again.' })
        : error.includes?.('Validation error')
          ? t('addRecipe.alertValidationError', { defaultValue: error.message || 'Invalid input data.' })
          : t('addRecipe.alertServerError', { defaultValue: error.message || 'An unexpected error occurred.' });
  setErrorMessage(errorMsg);
  toast.error(errorMsg);
  if (errorMsg.includes('Unauthenticated')) {
    localStorage.removeItem('token');
    console.log('Token removed due to Unauthenticated error');
  }
}
    },
    [
      title,
      description,
      ingredientsInput,
      steps,
      category,
      region,
      minPrice,
      cookTime,
      prepTime,
      image,
      dispatch,
      router,
      t,
    ]
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <main className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-orange-700 mb-8">{t('addRecipe.title')}</h1>

          {errorMessage && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{errorMessage}</div>
          )}

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
                value={ingredientsInput}
                onChange={(e) => setIngredientsInput(e.target.value)}
                required
                rows={4}
                className="w-full px-5 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                placeholder={t('addRecipe.form.ingredientsPlaceholder')}
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">{t('addRecipe.form.instructions')}</label>
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const stepLabel = t('addRecipe.form.stepLabel', { number: index + 1 });
                  return (
                    <div key={index} className="border rounded-lg shadow-sm overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleStep(index)}
                        className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold transition"
                      >
                        <span>{stepLabel.includes('{number}') ? `Step ${index + 1}` : stepLabel}</span>
                        <div className="flex items-center space-x-2">
                          <svg
                            className={`w-5 h-5 transform transition-transform ${openStep === index ? 'rotate-180' : ''}`}
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
                            placeholder={t('addRecipe.form.stepPlaceholder', { number: index + 1 }) || `Describe step ${index + 1}`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
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
              <label className="block text-lg font-semibold text-gray-800 mb-2">{t('addRecipe.form.region')}</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                required
                className="w-full px-5 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              >
                <option value="" disabled>{t('addRecipe.form.selectRegion')}</option>
                {regions.map(({ value, label }) => (
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
                placeholder={t('addRecipe.form.minPricePlaceholder', { currency: 'FCFA' })}
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">{t('addRecipe.form.prepTime')}</label>
              <input
                type="text"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                required
                className="w-full px-5 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                placeholder={t('addRecipe.form.prepTimePlaceholder')}
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">{t('addRecipe.form.cookTime')}</label>
              <input
                type="text"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                required
                className="w-full px-5 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                placeholder={t('addRecipe.form.cookTimePlaceholder')}
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
              disabled={status === 'loading'}
              className={`w-full px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-full text-lg font-semibold transition transform hover:scale-105 ${status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {status === 'loading' ? t('addRecipe.form.submitting') : t('addRecipe.form.submit')}
            </button>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}