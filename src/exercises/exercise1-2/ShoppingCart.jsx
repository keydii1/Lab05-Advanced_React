import { useSelector, useDispatch } from "react-redux";
import {
  addItem,
  removeItem,
  clearCart,
  selectCartItems,
  selectCartSummary,
} from "./cartSlice";
import "./ShoppingCart.css";

// ======================================
// EXERCISE 1.2: Shopping Cart Component
// ======================================
// This component demonstrates Redux Toolkit in action
// with memoized selectors for tax calculation

// Sample products data
const PRODUCTS = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 99.99,
    image: "🎧",
    category: "Electronics",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 249.99,
    image: "⌚",
    category: "Electronics",
  },
  {
    id: 3,
    name: "Laptop Stand",
    price: 49.99,
    image: "💻",
    category: "Accessories",
  },
  {
    id: 4,
    name: "Mechanical Keyboard",
    price: 149.99,
    image: "⌨️",
    category: "Electronics",
  },
  {
    id: 5,
    name: "USB-C Hub",
    price: 79.99,
    image: "🔌",
    category: "Accessories",
  },
];

// Product Card Component
function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <span className="product-image">{product.image}</span>
      <h4>{product.name}</h4>
      <p className="category">{product.category}</p>
      <p className="price">${product.price.toFixed(2)}</p>
      <button onClick={() => onAddToCart(product)} className="add-btn">
        Add to Cart
      </button>
    </div>
  );
}

// Cart Item Component
function CartItem({ item, onAdd, onRemove }) {
  return (
    <div className="cart-item">
      <span className="item-image">{item.image}</span>
      <div className="item-details">
        <h5>{item.name}</h5>
        <p>${item.price.toFixed(2)} each</p>
      </div>
      <div className="quantity-controls">
        <button onClick={() => onRemove(item.id)} className="qty-btn">
          -
        </button>
        <span className="quantity">{item.quantity}</span>
        <button onClick={() => onAdd(item)} className="qty-btn">
          +
        </button>
      </div>
      <p className="item-total">${(item.price * item.quantity).toFixed(2)}</p>
    </div>
  );
}

// Main Shopping Cart Component
export default function ShoppingCart() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartSummary = useSelector(selectCartSummary);

  const handleAddItem = (product) => {
    dispatch(addItem(product));
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeItem(itemId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="shopping-cart-container">
      <h2>Exercise 1.2: Redux Toolkit Shopping Cart</h2>
      <p className="description">
        This component uses <code>Redux Toolkit</code> with{" "}
        <code>createSlice</code> for state management and{" "}
        <code>createSelector</code> for memoized tax calculation. Check the
        console to see when tax is recalculated!
      </p>

      <div className="shop-layout">
        {/* Products Section */}
        <div className="products-section">
          <h3>🛍️ Products</h3>
          <div className="products-grid">
            {PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddItem}
              />
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="cart-section">
          <div className="cart-header">
            <h3>🛒 Your Cart ({cartSummary.itemCount} items)</h3>
            {cartItems.length > 0 && (
              <button onClick={handleClearCart} className="clear-btn">
                Clear All
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onAdd={handleAddItem}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${cartSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row tax">
                  <span>Tax (10%):</span>
                  <span>${cartSummary.tax.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${cartSummary.total.toFixed(2)}</span>
                </div>
                <button className="checkout-btn">Proceed to Checkout</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Redux State Debug */}
      <div className="debug-info">
        <h4>Debug: Redux State</h4>
        <pre>
          {JSON.stringify({ items: cartItems, summary: cartSummary }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
