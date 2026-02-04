import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Container = styled.div`
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
  z-index: 1;
  background-image: 
    radial-gradient(circle at 25% 25%, #ffffff 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, #ffffff 2px, transparent 2px);
  background-size: 50px 50px;
  animation: float 20s ease-in-out infinite;
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
  }
`;

const LoginGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  width: 100%;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
  z-index: 10;
  position: relative;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
`;

const ImageSection = styled.div`
  background: linear-gradient(45deg, rgba(102, 126, 234, 0.95), rgba(118, 75, 162, 0.95)),
              url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=800&fit=crop') center/cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 40px;
  color: white;
  text-align: center;
  position: relative;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const WelcomeTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  font-family: 'Georgia', serif;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.3rem;
  opacity: 0.95;
  line-height: 1.6;
  margin-bottom: 30px;
  font-weight: 300;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: flex-start;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 1.1rem;
  font-weight: 500;
  
  &::before {
    content: '✨';
    font-size: 1.3rem;
  }
`;

const FormSection = styled.div`
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  
  @media (max-width: 768px) {
    padding: 40px 30px;
  }
`;

const FormTitle = styled.h2`
  font-size: 2.5rem;
  color: #1a202c;
  margin-bottom: 10px;
  text-align: center;
  font-weight: 700;
  font-family: 'Georgia', serif;
`;

const FormSubtitle = styled.p`
  color: #4a5568;
  text-align: center;
  margin-bottom: 40px;
  font-size: 1.1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 10px;
  font-weight: 600;
  color: #2d3748;
  font-size: 1rem;
`;

const Input = styled.input`
  padding: 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #ffffff;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }
  
  &:invalid {
    border-color: #e53e3e;
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const Button = styled.button`
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
  padding: 12px;
  background: #fed7d7;
  border-radius: 8px;
  border: 1px solid #feb2b2;
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 30px;
  color: #4a5568;
  font-size: 1rem;
  
  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Check if user is admin and redirect to admin dashboard
      const response = await axios.get('/api/auth/me');
      const user = response.data;
      
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <Container>
      <BackgroundPattern />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        <LoginGrid>
          <ImageSection>
            <WelcomeTitle>Welcome Back!</WelcomeTitle>
            <WelcomeSubtitle>
              Join thousands of food lovers sharing amazing recipes and culinary experiences
            </WelcomeSubtitle>
            <FeatureList>
              <FeatureItem>Discover premium recipes</FeatureItem>
              <FeatureItem>Smart recommendations</FeatureItem>
              <FeatureItem>Order ingredients</FeatureItem>
              <FeatureItem>Connect with chefs</FeatureItem>
            </FeatureList>
          </ImageSection>
          
          <FormSection>
            <FormTitle>Sign In</FormTitle>
            <FormSubtitle>Access your recipe collection</FormSubtitle>
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  minLength={6}
                />
              </FormGroup>
              
              <Button type="submit" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
              
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </Form>
            
            <LinkText>
              Don't have an account? <Link to="/register">Sign up here</Link>
            </LinkText>
          </FormSection>
        </LoginGrid>
      </motion.div>
    </Container>
  );
};

export default Login;