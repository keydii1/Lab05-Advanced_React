import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../exercises/exercise1-2/cartSlice";

// ======================================
// Redux Store Configuration
// ======================================
// Using configureStore from Redux Toolkit for simplified setup

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  // Redux Toolkit includes redux-thunk by default
  // and adds helpful development checks
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
