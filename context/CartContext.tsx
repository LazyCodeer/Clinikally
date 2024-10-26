import React, { createContext, useState, useContext, ReactNode } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  inStock: boolean;
  quantity: number;
  imageUrl: string;
}

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    console.log("Adding to cart", item);
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.id === item.id
      );
      if (existingItem) {
        const updatedItems = prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        console.log("Updated cart items", updatedItems);
        return updatedItems;
      } else {
        const newItems = [...prevItems, { ...item, quantity: 1 }];
        console.log("New cart items", newItems);
        return newItems;
      }
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prevItems) =>
      quantity === 0
        ? prevItems.filter((cartItem) => cartItem.id !== id)
        : prevItems.map((cartItem) =>
            cartItem.id === id ? { ...cartItem, quantity } : cartItem
          )
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((cartItem) => cartItem.id !== id)
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
