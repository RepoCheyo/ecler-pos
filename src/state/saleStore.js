import { create } from 'zustand';

const useCartStore = create((set) => ({
  cart: [],
  total: 0,

  // Add a product to the cart
  addProduct: (product, flavor) =>
    set((state) => {
      return {
        cart: [...state.cart, { ...product, flavor }],
        total: state.total + parseInt(product.price),
      };
    }),

  // Remove a product from the cart
  removeProduct: (index, amount) =>
    set((state) => ({
      cart: state.cart.filter((_, i) => i !== index),
      total: state.total - amount,
    })),

  // Clear the cart
  clearCart: () => set({ cart: [], total: 0 }),
}));

export default useCartStore;
