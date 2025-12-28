import { createSlice, createSelector } from "@reduxjs/toolkit";

// ======================================
// EXERCISE 1.2: The Global Store (Redux Toolkit)
// ======================================
// Context: Redux Toolkit (RTK) simplifies Redux setup by providing
// tools like configureStore and createSlice, which automatically
// generate action creators and handle immutability.

const initialState = {
  items: [],
  totalAmount: 0,
};

// Helper function to calculate total amount
const calculateTotal = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Create the cart slice with RTK
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add item or increment quantity if already exists
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === newItem.id
      );

      if (existingItemIndex >= 0) {
        // Item exists, increment quantity
        state.items[existingItemIndex].quantity += 1;
      } else {
        // Add new item with quantity 1
        state.items.push({
          ...newItem,
          quantity: 1,
        });
      }

      // Recalculate total
      state.totalAmount = calculateTotal(state.items);
    },

    // Remove item or decrement quantity
    removeItem: (state, action) => {
      const itemId = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === itemId
      );

      if (existingItemIndex >= 0) {
        const existingItem = state.items[existingItemIndex];

        if (existingItem.quantity > 1) {
          // Decrement quantity
          state.items[existingItemIndex].quantity -= 1;
        } else {
          // Remove item completely
          state.items.splice(existingItemIndex, 1);
        }

        // Recalculate total
        state.totalAmount = calculateTotal(state.items);
      }
    },

    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
  },
});

// Export actions
export const { addItem, removeItem, clearCart } = cartSlice.actions;

// Base selectors
const selectCart = (state) => state.cart;
const selectTotalAmount = (state) => state.cart.totalAmount;

// Memoized selector for tax calculation (10%)
// This only recalculates when totalAmount changes
export const selectCartTax = createSelector(
  [selectTotalAmount],
  (totalAmount) => {
    console.log("🧮 Calculating tax... (only runs when totalAmount changes)");
    return totalAmount * 0.1;
  }
);

// Memoized selector for cart summary
export const selectCartSummary = createSelector(
  [selectCart, selectCartTax],
  (cart, tax) => ({
    itemCount: cart.items.reduce((count, item) => count + item.quantity, 0),
    subtotal: cart.totalAmount,
    tax: tax,
    total: cart.totalAmount + tax,
  })
);

// Selector for items
export const selectCartItems = (state) => state.cart.items;

export default cartSlice.reducer;
