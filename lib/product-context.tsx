// lib/product-context.tsx
"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/use-toast';

// Define product type
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  condition?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductContextType {
  products: Product[];
  userProducts: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  fetchUserProducts: () => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}


const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      // Add a product


      
      const data = await response.json();
      setProducts(data.products.map((p: any) => ({
        ...p,
        id: p._id
      })));
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load products",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's products
  const fetchUserProducts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('ecofinds_token');
      
      const response = await fetch('/api/products/my-listings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch your products');
      }
      
      const data = await response.json();
      setUserProducts(data.products.map((p: any) => ({
        ...p,
        id: p._id
      })));
    } catch (error) {
      console.error('Error fetching user products:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your listings",
      });
    } finally {
      setLoading(false);
    }
  };
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const token = localStorage.getItem('ecofinds_token');
    
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    
    const newProduct = await response.json();
    
    // Update local state with the new product
    const formattedProduct = {
      ...newProduct,
      id: newProduct._id
    };
    
    setUserProducts([formattedProduct, ...userProducts]);
    setProducts([formattedProduct, ...products]);
    
    toast({
      title: "Success",
      description: "Product created successfully",
    });
    
    return formattedProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to create product",
    });
    throw error;
  }
};

  // Delete a product
  const deleteProduct = async (id: string) => {
    try {
      const token = localStorage.getItem('ecofinds_token');
      
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      
      // Update local state
      setUserProducts(userProducts.filter(product => product.id !== id));
      setProducts(products.filter(product => product.id !== id));
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product",
      });
    }
  };

  // Load user products when user changes
  useEffect(() => {
    if (user) {
      fetchUserProducts();
    } else {
      setUserProducts([]);
    }
  }, [user]);

  return (
  <ProductContext.Provider value={{
    products,
    userProducts,
    loading,
    fetchProducts,
    fetchUserProducts,
    deleteProduct,
    addProduct  // Add this line
  }}>
    {children}
  </ProductContext.Provider>
);

}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
