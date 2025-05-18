// // lib/product-context.tsx
// "use client"

// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { useAuth } from '@/lib/auth-context';
// import { useToast } from '@/components/ui/use-toast';

// // Define product type
// export interface Product {
//   id: string;
//   title: string;
//   description: string;
//   price: number;
//   image?: string;
//   category?: string;
//   condition?: string;
//   userId: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface ProductContextType {
//   products: Product[];
//   userProducts: Product[];
//   loading: boolean;
//   fetchProducts: () => Promise<void>;
//   fetchUserProducts: () => Promise<void>;
//   deleteProduct: (id: string) => Promise<void>;
//   addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
// }


// const ProductContext = createContext<ProductContextType | undefined>(undefined);

// export function ProductProvider({ children }: { children: ReactNode }) {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [userProducts, setUserProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { user } = useAuth();
//   const { toast } = useToast();

//   // Fetch all products
//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('/api/products');
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch products');
//       }
//       // Add a product


      
//       const data = await response.json();
//       setProducts(data.products.map((p: any) => ({
//         ...p,
//         id: p._id
//       })));
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to load products",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch user's products
//   const fetchUserProducts = async () => {
//     if (!user) return;
    
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('ecofinds_token');
      
//       const response = await fetch('/api/products/my-listings', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch your products');
//       }
      
//       const data = await response.json();
//       setUserProducts(data.products.map((p: any) => ({
//         ...p,
//         id: p._id
//       })));
//     } catch (error) {
//       console.error('Error fetching user products:', error);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to load your listings",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };
//   const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
//   try {
//     const token = localStorage.getItem('ecofinds_token');
    
//     const response = await fetch('/api/products', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify(productData)
//     });
    
//     if (!response.ok) {
//       throw new Error('Failed to create product');
//     }
    
//     const newProduct = await response.json();
    
//     // Update local state with the new product
//     const formattedProduct = {
//       ...newProduct,
//       id: newProduct._id
//     };
    
//     setUserProducts([formattedProduct, ...userProducts]);
//     setProducts([formattedProduct, ...products]);
    
//     toast({
//       title: "Success",
//       description: "Product created successfully",
//     });
    
//     return formattedProduct;
//   } catch (error) {
//     console.error('Error creating product:', error);
//     toast({
//       variant: "destructive",
//       title: "Error",
//       description: "Failed to create product",
//     });
//     throw error;
//   }
// };

//   // Delete a product
//   const deleteProduct = async (id: string) => {
//     try {
//       const token = localStorage.getItem('ecofinds_token');
      
//       const response = await fetch(`/api/products/${id}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to delete product');
//       }
      
//       // Update local state
//       setUserProducts(userProducts.filter(product => product.id !== id));
//       setProducts(products.filter(product => product.id !== id));
      
//       toast({
//         title: "Success",
//         description: "Product deleted successfully",
//       });
//     } catch (error) {
//       console.error('Error deleting product:', error);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to delete product",
//       });
//     }
//   };

//   // Load user products when user changes
//   useEffect(() => {
//     if (user) {
//       fetchUserProducts();
//     } else {
//       setUserProducts([]);
//     }
//   }, [user]);

//   return (
//   <ProductContext.Provider value={{
//     products,
//     userProducts,
//     loading,
//     fetchProducts,
//     fetchUserProducts,
//     deleteProduct,
//     addProduct  // Add this line
//   }}>
//     {children}
//   </ProductContext.Provider>
// );

// }

// export function useProducts() {
//   const context = useContext(ProductContext);
//   if (context === undefined) {
//     throw new Error('useProducts must be used within a ProductProvider');
//   }
//   return context;
// }

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

// Define cart item type
export interface CartItem {
  productId: string;
  quantity: number;
}

interface ProductContextType {
  products: Product[];
  userProducts: Product[];
  cartItems: CartItem[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  fetchUserProducts: () => Promise<void>;
  fetchPurchases: () => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  // Cart functions
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  checkout: () => Promise<void>;
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
      image: "https://images.unsplash.com/photo-1583863788434-e58b8f6a2f74?w=500&auto=format",
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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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

  // Add a product
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

  // CART FUNCTIONS

  // Add to cart
  const addToCart = (productId: string, quantity: number) => {
    setCartItems(prevItems => {
      // Check if product already in cart
      const existingItem = prevItems.find(item => item.productId === productId);
      
      if (existingItem) {
        // Update quantity if product already in cart
        return prevItems.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // Add new item if product not in cart
        return [...prevItems, { productId, quantity }];
      }
    });
    
    // Show success toast
    const product = products.find(p => p.id === productId);
    toast({
      title: "Added to cart",
      description: `${product?.title || 'Product'} has been added to your cart`,
    });
  };

  // Remove from cart
  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
    
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
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.productId === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  // Checkout
  const checkout = async () => {
    try {
      // In a real app, you would call an API to process the order
      // For now, we'll just clear the cart
      
      // Show success message
      toast({
        title: "Order placed successfully",
        description: "Thank you for your purchase!",
      });
      
      // Clear cart
      setCartItems([]);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        variant: "destructive",
        title: "Checkout failed",
        description: "There was an error processing your order",
      });
      return Promise.reject(error);
    }
  };

  // Load cart from localStorage when component mounts
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`ecofinds_cart_${user.id}`);
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          console.error('Error parsing saved cart:', e);
        }
      }
      
      fetchUserProducts();
      fetchProducts();
    } else {
      setUserProducts([]);
      setCartItems([]);
    }
  }, [user]);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (user && cartItems.length > 0) {
      localStorage.setItem(`ecofinds_cart_${user.id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  return (
    <ProductContext.Provider value={{
      products,
      userProducts,
      cartItems,
      loading,
      fetchProducts,
      fetchUserProducts,
      deleteProduct,
      addProduct,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      checkout
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
