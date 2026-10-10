
import { api } from "./api";

// =====================================================
// GET ALL CATEGORIES
// GET /api/categories
// =====================================================

export const getCategories = async () => {
  return await api.get("/categories");
};

// =====================================================
// GET BREEDS BY CATEGORY
// GET /api/categories/:categoryId/breeds
// =====================================================

export const getBreedsByCategory = async (categoryId) => {
  if (!categoryId) {
    throw new Error("Category ID is required");
  }

  return await api.get(
    `/categories/${categoryId}/breeds`
  );
};

