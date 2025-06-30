// src/api/recipeApi.ts
import axios from '../lib/axios';

export async function deleteRecipe(recipeId: string, token: string) {
  const res = await axios.delete(`/api/recipes/${recipeId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // Optional: If the API returns data, specify its type (e.g., { success: boolean })
}
