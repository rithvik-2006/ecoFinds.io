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

interface CartItem {
  productId: string;
  quantity: number;
}

interface ProductContextType {
  products: Product[];
  userProducts: Product[];
  purchases: any[];
  cart: CartItem[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  fetchUserProducts: () => Promise<void>;
  fetchPurchases: () => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      title: "Vintage Camera",
      description: "Beautiful vintage camera in excellent condition. Perfect for collectors.",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format",
      category: "Electronics",
      condition: "Used - Like New",
      userId: "dummy-user-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "2",
      title: "Organic Cotton T-Shirt",
      description: "100% organic cotton t-shirt, brand new with tags.",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format",
      category: "Clothing",
      condition: "New",
      userId: "dummy-user-2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "3",
      title: "Bamboo Cutting Board",
      description: "Sustainable bamboo cutting board, handmade and eco-friendly.",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format",
      category: "Home & Kitchen",
      condition: "New",
      userId: "dummy-user-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "4",
      title: "Recycled Glass Vase",
      description: "Beautiful vase made from 100% recycled glass.",
      price: 45.00,
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format",
      category: "Home Decor",
      condition: "New",
      userId: "dummy-user-3",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "5",
      title: "Solar Power Bank",
      description: "Portable solar charger with 10000mAh capacity.",
      price: 59.99,
      image: "https://5.imimg.com/data5/SELLER/Default/2023/9/343608031/RL/XW/MB/160915923/71tmdbz-g-l.jpg",
      category: "Electronics",
      condition: "New",
      userId: "dummy-user-2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "6",
      title: "Upcycled Denim Bag",
      description: "Handmade bag created from recycled denim jeans.",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&auto=format",
      category: "Accessories",
      condition: "Used - Good",
      userId: "dummy-user-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false); // Set to false since we have initial data
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

  // Add fetchPurchases function
  const fetchPurchases = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('ecofinds_token');
      
      const response = await fetch('/api/purchases', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch purchases');
      }
      
      const data = await response.json();
      setPurchases(data.purchases || []);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load purchases",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load purchases when user changes
  useEffect(() => {
    if (user) {
      fetchPurchases();
    } else {
      setPurchases([]);
    }
  }, [user]);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const token = localStorage.getItem('ecofinds_token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create product');
      }
      
      // Update local state with the new product
      const formattedProduct = {
        ...data,
        id: data._id
      };
      
      setUserProducts(prev => [formattedProduct, ...prev]);
      setProducts(prev => [formattedProduct, ...prev]);
      
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
        description: error instanceof Error ? error.message : "Failed to create product",
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

  // Add to cart
  const addToCart = (productId: string, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === productId);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevCart, { productId, quantity }];
    });

    toast({
      title: "Added to cart",
      description: "Item has been added to your cart",
    });
  };

  // Remove from cart
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
    
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart",
    });
  };

  // Update cart item quantity
  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  return (
  <ProductContext.Provider value={{
    products,
    userProducts,
    purchases,
    cart,
    loading,
    fetchProducts,
    fetchUserProducts,
    fetchPurchases,
    deleteProduct,
    addProduct,
    addToCart,
    removeFromCart,
    updateCartItemQuantity
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
