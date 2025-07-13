import { apiRequest } from "./queryClient";
import type { 
  ApiCollection, 
  ApiProduct, 
  ApiConfiguration, 
  ApiMaterial, 
  ApiMechanism,
  PriceCalculationReq,
  PriceCalculationRes 
} from "@/types/furniture";

// Use our backend proxy instead of direct API calls
const API_BASE_URL = "/api/v1";

// No need for auth header since our backend handles authentication
const getAuthHeader = () => {
  return "";
};

// Helper function to make API calls - only authentic data
async function apiCall<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

// Adapter functions to convert API response to UI format
function adaptCollectionToUI(apiCollection: any): any {
  return {
    id: apiCollection.id,
    name: apiCollection.label,
    label: apiCollection.label,
    description: apiCollection.category?.label || "",
    category: apiCollection.category,
    image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    product_count: 0
  };
}

// Adapter for products
function adaptProductToUI(apiProduct: any): any {
  return {
    id: apiProduct.id,
    name: apiProduct.label,
    label: apiProduct.label,
    description: apiProduct.subcategory?.label || "",
    base_price: "0", // API doesn't provide base price
    image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    dimensions: "Размеры уточняются",
    subcategory: apiProduct.subcategory,
    collection_id: apiProduct.collection_id,
    allowed_section_counts: apiProduct.allowed_section_counts
  };
}

export const furnitureApi = {
  // Collections
  async getCollections(): Promise<any[]> {
    const rawCollections = await apiCall<any[]>(`${API_BASE_URL}/collections`);
    return rawCollections.map(adaptCollectionToUI);
  },

  async getCollectionProducts(collectionId: number): Promise<any[]> {
    const rawProducts = await apiCall<any[]>(`${API_BASE_URL}/collections/${collectionId}/products`);
    return rawProducts.map(adaptProductToUI);
  },

  async getCollectionCategories(collectionId: number): Promise<any[]> {
    return apiCall(`${API_BASE_URL}/collections/${collectionId}/categories`);
  },

  // Products - requires subcategory_id parameter
  async getProductConfigurations(productId: number, subcategoryId: number): Promise<any[]> {
    return apiCall(`${API_BASE_URL}/products/${productId}/configurations?subcategory_id=${subcategoryId}`);
  },

  // Price calculation
  async calculatePrice(parameters: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/prices/sum`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ parameters }),
    });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  },

  async getAllPrices(): Promise<any[]> {
    return apiCall(`${API_BASE_URL}/prices`);
  }
};
