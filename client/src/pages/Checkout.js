import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiCreditCard, FiUser, FiMapPin, FiCheck, FiArrowLeft } from 'react-icons/fi';

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

const BackButton = styled.button`
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #edf2f7;
  }
`;

const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const CheckoutForm = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const Section = styled.div`
  margin-bottom: 40px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #2d3748;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &.error {
    border-color: #e53e3e;
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const PaymentMethods = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
`;

const PaymentMethod = styled.div`
  border: 2px solid ${props => props.selected ? '#667eea' : '#e2e8f0'};
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  background: ${props => props.selected ? '#f0f4ff' : 'white'};
  
  &:hover {
    border-color: #667eea;
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

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 4px;
`;

const ItemMeta = styled.div`
  font-size: 14px;
  color: #4a5568;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0;
  
  &.total {
    font-size: 1.2rem;
    font-weight: 700;
    color: #1a202c;
    padding-top: 12px;
    border-top: 2px solid #e2e8f0;
    margin-top: 20px;
  }
`;

const PlaceOrderButton = styled.button`
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
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 14px;
  margin-top: 4px;
`;

const Checkout = () => {
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errors, setErrors] = useState({});

  const [billingData, setBillingData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Nepal'
    }
  });

  const [deliveryData, setDeliveryData] = useState({
    sameAsBilling: true,
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nepal',
    phone: '',
    instructions: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card');

  const { data: cart, isLoading } = useQuery(
    'cart',
    () => axios.get('/api/cart').then(res => res.data)
  );

  const placeOrderMutation = useMutation(
    (orderData) => axios.post('/api/orders', orderData),
    {
      onSuccess: (response) => {
        toast.success('Order placed successfully! Waiting for admin approval.');
        navigate(`/order-confirmation/${response.data.order.orderNumber}`);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to place order');
        setIsPlacingOrder(false);
      }
    }
  );

  const handleInputChange = (section, field, value) => {
    if (section === 'billing') {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        setBillingData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      } else {
        setBillingData(prev => ({
          ...prev,
          [field]: value
        }));
      }
    } else if (section === 'delivery') {
      setDeliveryData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Billing validation
    if (!billingData.fullName) newErrors.fullName = 'Full name is required';
    if (!billingData.email) newErrors.email = 'Email is required';
    if (!billingData.phone) newErrors.phone = 'Phone is required';
    if (!billingData.address.street) newErrors['address.street'] = 'Street address is required';
    if (!billingData.address.city) newErrors['address.city'] = 'City is required';
    if (!billingData.address.state) newErrors['address.state'] = 'State is required';
    if (!billingData.address.zipCode) newErrors['address.zipCode'] = 'ZIP code is required';

    // Delivery validation (if different from billing)
    if (!deliveryData.sameAsBilling) {
      if (!deliveryData.street) newErrors['delivery.street'] = 'Delivery street is required';
      if (!deliveryData.city) newErrors['delivery.city'] = 'Delivery city is required';
      if (!deliveryData.state) newErrors['delivery.state'] = 'Delivery state is required';
      if (!deliveryData.zipCode) newErrors['delivery.zipCode'] = 'Delivery ZIP is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsPlacingOrder(true);

    const orderData = {
      billingDetails: billingData,
      deliveryAddress: deliveryData.sameAsBilling ? billingData.address : deliveryData,
      paymentMethod,
      notes: deliveryData.instructions
    };

    placeOrderMutation.mutate(orderData);
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
    navigate('/cart');
    return null;
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
          <BackButton onClick={() => navigate('/cart')}>
            <FiArrowLeft size={20} />
          </BackButton>
          Checkout
        </Title>

        <CheckoutGrid>
          <CheckoutForm>
            {/* Billing Information */}
            <Section>
              <SectionTitle>
                <FiUser /> Billing Information
              </SectionTitle>
              
              <FormGrid>
                <FormGroup>
                  <Label>Full Name *</Label>
                  <Input
                    type="text"
                    value={billingData.fullName}
                    onChange={(e) => handleInputChange('billing', 'fullName', e.target.value)}
                    className={errors.fullName ? 'error' : ''}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <ErrorMessage>{errors.fullName}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    value={billingData.email}
                    onChange={(e) => handleInputChange('billing', 'email', e.target.value)}
                    className={errors.email ? 'error' : ''}
                    placeholder="Enter your email"
                  />
                  {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label>Phone Number *</Label>
                  <Input
                    type="tel"
                    value={billingData.phone}
                    onChange={(e) => handleInputChange('billing', 'phone', e.target.value)}
                    className={errors.phone ? 'error' : ''}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label>Company (Optional)</Label>
                  <Input
                    type="text"
                    value={billingData.company}
                    onChange={(e) => handleInputChange('billing', 'company', e.target.value)}
                    placeholder="Company name"
                  />
                </FormGroup>
              </FormGrid>

              <FormGrid style={{ marginTop: '20px' }}>
                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <Label>Street Address *</Label>
                  <Input
                    type="text"
                    value={billingData.address.street}
                    onChange={(e) => handleInputChange('billing', 'address.street', e.target.value)}
                    className={errors['address.street'] ? 'error' : ''}
                    placeholder="Enter street address"
                  />
                  {errors['address.street'] && <ErrorMessage>{errors['address.street']}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label>City *</Label>
                  <Input
                    type="text"
                    value={billingData.address.city}
                    onChange={(e) => handleInputChange('billing', 'address.city', e.target.value)}
                    className={errors['address.city'] ? 'error' : ''}
                    placeholder="City"
                  />
                  {errors['address.city'] && <ErrorMessage>{errors['address.city']}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label>State/Province *</Label>
                  <Input
                    type="text"
                    value={billingData.address.state}
                    onChange={(e) => handleInputChange('billing', 'address.state', e.target.value)}
                    className={errors['address.state'] ? 'error' : ''}
                    placeholder="State/Province"
                  />
                  {errors['address.state'] && <ErrorMessage>{errors['address.state']}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label>ZIP/Postal Code *</Label>
                  <Input
                    type="text"
                    value={billingData.address.zipCode}
                    onChange={(e) => handleInputChange('billing', 'address.zipCode', e.target.value)}
                    className={errors['address.zipCode'] ? 'error' : ''}
                    placeholder="ZIP Code"
                  />
                  {errors['address.zipCode'] && <ErrorMessage>{errors['address.zipCode']}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label>Country *</Label>
                  <Select
                    value={billingData.address.country}
                    onChange={(e) => handleInputChange('billing', 'address.country', e.target.value)}
                  >
                    <option value="Nepal">Nepal</option>
                    <option value="India">India</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Canada">Canada</option>
                  </Select>
                </FormGroup>
              </FormGrid>
            </Section>

            {/* Delivery Information */}
            <Section>
              <SectionTitle>
                <FiMapPin /> Delivery Information
              </SectionTitle>
              
              <FormGroup style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={deliveryData.sameAsBilling}
                    onChange={(e) => handleInputChange('delivery', 'sameAsBilling', e.target.checked)}
                  />
                  Same as billing address
                </label>
              </FormGroup>

              {!deliveryData.sameAsBilling && (
                <FormGrid>
                  <FormGroup style={{ gridColumn: '1 / -1' }}>
                    <Label>Delivery Street Address *</Label>
                    <Input
                      type="text"
                      value={deliveryData.street}
                      onChange={(e) => handleInputChange('delivery', 'street', e.target.value)}
                      className={errors['delivery.street'] ? 'error' : ''}
                      placeholder="Enter delivery address"
                    />
                    {errors['delivery.street'] && <ErrorMessage>{errors['delivery.street']}</ErrorMessage>}
                  </FormGroup>

                  <FormGroup>
                    <Label>City *</Label>
                    <Input
                      type="text"
                      value={deliveryData.city}
                      onChange={(e) => handleInputChange('delivery', 'city', e.target.value)}
                      className={errors['delivery.city'] ? 'error' : ''}
                      placeholder="City"
                    />
                    {errors['delivery.city'] && <ErrorMessage>{errors['delivery.city']}</ErrorMessage>}
                  </FormGroup>

                  <FormGroup>
                    <Label>State/Province *</Label>
                    <Input
                      type="text"
                      value={deliveryData.state}
                      onChange={(e) => handleInputChange('delivery', 'state', e.target.value)}
                      className={errors['delivery.state'] ? 'error' : ''}
                      placeholder="State/Province"
                    />
                    {errors['delivery.state'] && <ErrorMessage>{errors['delivery.state']}</ErrorMessage>}
                  </FormGroup>

                  <FormGroup>
                    <Label>ZIP/Postal Code *</Label>
                    <Input
                      type="text"
                      value={deliveryData.zipCode}
                      onChange={(e) => handleInputChange('delivery', 'zipCode', e.target.value)}
                      className={errors['delivery.zipCode'] ? 'error' : ''}
                      placeholder="ZIP Code"
                    />
                    {errors['delivery.zipCode'] && <ErrorMessage>{errors['delivery.zipCode']}</ErrorMessage>}
                  </FormGroup>

                  <FormGroup>
                    <Label>Delivery Phone</Label>
                    <Input
                      type="tel"
                      value={deliveryData.phone}
                      onChange={(e) => handleInputChange('delivery', 'phone', e.target.value)}
                      placeholder="Delivery contact number"
                    />
                  </FormGroup>
                </FormGrid>
              )}

              <FormGroup style={{ marginTop: '20px' }}>
                <Label>Delivery Instructions (Optional)</Label>
                <Input
                  type="text"
                  value={deliveryData.instructions}
                  onChange={(e) => handleInputChange('delivery', 'instructions', e.target.value)}
                  placeholder="Special delivery instructions"
                />
              </FormGroup>
            </Section>

            {/* Payment Method */}
            <Section>
              <SectionTitle>
                <FiCreditCard /> Payment Method
              </SectionTitle>
              
              <PaymentMethods>
                <PaymentMethod
                  selected={paymentMethod === 'card'}
                  onClick={() => setPaymentMethod('card')}
                >
                  <FiCreditCard size={24} style={{ marginBottom: '8px' }} />
                  <div>Credit/Debit Card</div>
                </PaymentMethod>

                <PaymentMethod
                  selected={paymentMethod === 'cash'}
                  onClick={() => setPaymentMethod('cash')}
                >
                  💵
                  <div>Cash on Delivery</div>
                </PaymentMethod>

                <PaymentMethod
                  selected={paymentMethod === 'bank_transfer'}
                  onClick={() => setPaymentMethod('bank_transfer')}
                >
                  🏦
                  <div>Bank Transfer</div>
                </PaymentMethod>
              </PaymentMethods>
            </Section>
          </CheckoutForm>

          <OrderSummary>
            <SummaryTitle>Order Summary</SummaryTitle>
            
            {cart.items.map((item) => (
              <SummaryItem key={item._id}>
                <ItemDetails>
                  <ItemName>{item.recipe.title}</ItemName>
                  <ItemMeta>Qty: {item.quantity} × Rs {item.price.toFixed(0)}</ItemMeta>
                </ItemDetails>
                <div style={{ fontWeight: '600' }}>
                  Rs {(item.price * item.quantity).toFixed(0)}
                </div>
              </SummaryItem>
            ))}
            
            <div style={{ marginTop: '20px' }}>
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
              
              <SummaryRow className="total">
                <span>Total</span>
                <span>Rs {total.toFixed(0)}</span>
              </SummaryRow>
            </div>
            
            <PlaceOrderButton
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
            >
              <FiCheck size={20} />
              {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
            </PlaceOrderButton>

            <div style={{ 
              fontSize: '12px', 
              color: '#4a5568', 
              textAlign: 'center', 
              marginTop: '16px',
              lineHeight: '1.4'
            }}>
              Your order will be sent to admin for approval. You'll receive a confirmation email once approved.
            </div>
          </OrderSummary>
        </CheckoutGrid>
      </motion.div>
    </Container>
  );
};

export default Checkout;