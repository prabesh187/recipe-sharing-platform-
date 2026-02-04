import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiTrash2, FiPlus, FiMinus, FiShoppingCart, FiCreditCard } from 'react-icons/fi';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #1a202c;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const CartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const CartItems = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const CartItem = styled.div`
  display: flex;
  gap: 16px;
  padding: 20px 0;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
`;

const ItemImagePlaceholder = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 4px;
`;

const ItemAuthor = styled.p`
  color: #4a5568;
  font-size: 14px;
  margin-bottom: 8px;
`;

const ItemPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #667eea;
`;

const ItemControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f7fafc;
  border-radius: 8px;
  padding: 4px;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #667eea;
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
  min-width: 40px;
  text-align: center;
  font-weight: 600;
`;

const RemoveButton = styled.button`
  background: #fed7d7;
  color: #c53030;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #feb2b2;
  }
`;

const OrderSummary = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 100px;
`;

const SummaryTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 20px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  
  &.total {
    font-size: 1.2rem;
    font-weight: 700;
    color: #1a202c;
    padding-top: 12px;
    border-top: 2px solid #e2e8f0;
    margin-top: 16px;
  }
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  h2 {
    font-size: 2rem;
    color: #1a202c;
    margin-bottom: 16px;
  }
  
  p {
    color: #4a5568;
    font-size: 1.1rem;
    margin-bottom: 32px;
  }
`;

const Cart = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const { data: cart, isLoading } = useQuery(
    'cart',
    () => axios.get('/api/cart').then(res => res.data)
  );

  const updateItemMutation = useMutation(
    ({ itemId, quantity }) => axios.put(`/api/cart/update/${itemId}`, { quantity }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cart');
      },
      onError: () => {
        toast.error('Failed to update item');
      }
    }
  );

  const removeItemMutation = useMutation(
    (itemId) => axios.delete(`/api/cart/remove/${itemId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cart');
        toast.success('Item removed from cart');
      },
      onError: () => {
        toast.error('Failed to remove item');
      }
    }
  );

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateItemMutation.mutate({ itemId, quantity: newQuantity });
  };

  const handleRemoveItem = (itemId) => {
    removeItemMutation.mutate(itemId);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <Container>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <EmptyCart>
            <FiShoppingCart size={64} color="#cbd5e0" />
            <h2>Your cart is empty</h2>
            <p>Discover amazing premium recipes and add them to your cart!</p>
            <Link to="/search" className="btn btn-primary">
              Browse Recipes
            </Link>
          </EmptyCart>
        </motion.div>
      </Container>
    );
  }

  const tax = cart.subtotal * 0.08;
  const deliveryFee = cart.subtotal > 5000 ? 0 : 300;
  const total = cart.subtotal + tax + deliveryFee;

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>
          <FiShoppingCart /> Your Cart ({cart.itemCount} items)
        </Title>

        <CartGrid>
          <CartItems>
            {cart.items.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CartItem>
                  {item.recipe.images && item.recipe.images.length > 0 ? (
                    <ItemImage src={item.recipe.images[0].url} alt={item.recipe.title} />
                  ) : (
                    <ItemImagePlaceholder>🍳</ItemImagePlaceholder>
                  )}
                  
                  <ItemDetails>
                    <ItemTitle>{item.recipe.title}</ItemTitle>
                    <ItemAuthor>by {item.recipe.author.username}</ItemAuthor>
                    <ItemPrice>Rs {item.price.toFixed(0)} each</ItemPrice>
                  </ItemDetails>
                  
                  <ItemControls>
                    <QuantityControls>
                      <QuantityButton
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updateItemMutation.isLoading}
                      >
                        <FiMinus size={16} />
                      </QuantityButton>
                      <QuantityDisplay>{item.quantity}</QuantityDisplay>
                      <QuantityButton
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        disabled={updateItemMutation.isLoading}
                      >
                        <FiPlus size={16} />
                      </QuantityButton>
                    </QuantityControls>
                    
                    <RemoveButton
                      onClick={() => handleRemoveItem(item._id)}
                      disabled={removeItemMutation.isLoading}
                    >
                      <FiTrash2 size={16} />
                    </RemoveButton>
                  </ItemControls>
                </CartItem>
              </motion.div>
            ))}
          </CartItems>

          <OrderSummary>
            <SummaryTitle>Order Summary</SummaryTitle>
            
            <SummaryRow>
              <span>Subtotal ({cart.itemCount} items)</span>
              <span>Rs {cart.subtotal.toFixed(0)}</span>
            </SummaryRow>
            
            <SummaryRow>
              <span>Tax (8%)</span>
              <span>Rs {tax.toFixed(0)}</span>
            </SummaryRow>
            
            <SummaryRow>
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? 'FREE' : `Rs ${deliveryFee.toFixed(0)}`}</span>
            </SummaryRow>
            
            {cart.subtotal <= 50 && (
              <p style={{ 
                fontSize: '14px', 
                color: '#667eea', 
                marginTop: '8px',
                fontStyle: 'italic'
              }}>
                Add Rs {(5000 - cart.subtotal).toFixed(0)} more for free delivery!
              </p>
            )}
            
            <SummaryRow className="total">
              <span>Total</span>
              <span>Rs {total.toFixed(0)}</span>
            </SummaryRow>
            
            <CheckoutButton
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              <FiCreditCard size={20} />
              {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
            </CheckoutButton>
          </OrderSummary>
        </CartGrid>
      </motion.div>
    </Container>
  );
};

export default Cart;