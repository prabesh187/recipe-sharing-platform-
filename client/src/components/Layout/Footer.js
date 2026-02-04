import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background: #2d3748;
  color: white;
  padding: 40px 0 20px;
  margin-top: 60px;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
`;

const FooterSection = styled.div`
  h3 {
    font-size: 18px;
    margin-bottom: 16px;
    color: #667eea;
  }
  
  p {
    color: #a0aec0;
    line-height: 1.6;
    margin-bottom: 16px;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FooterLink = styled(Link)`
  color: #a0aec0;
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: #667eea;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #4a5568;
  margin-top: 40px;
  padding-top: 20px;
  text-align: center;
  color: #a0aec0;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>RecipeShare</h3>
          <p>
            Discover, share, and enjoy amazing recipes from around the world. 
            Join our community of food lovers and cooking enthusiasts.
          </p>
        </FooterSection>
        
        <FooterSection>
          <h3>Quick Links</h3>
          <FooterLinks>
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/search">Browse Recipes</FooterLink>
            <FooterLink to="/create-recipe">Create Recipe</FooterLink>
            <FooterLink to="/recommendations">Recommendations</FooterLink>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <h3>Categories</h3>
          <FooterLinks>
            <FooterLink to="/search?category=breakfast">Breakfast</FooterLink>
            <FooterLink to="/search?category=lunch">Lunch</FooterLink>
            <FooterLink to="/search?category=dinner">Dinner</FooterLink>
            <FooterLink to="/search?category=dessert">Desserts</FooterLink>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <h3>Support</h3>
          <FooterLinks>
            <FooterLink to="/help">Help Center</FooterLink>
            <FooterLink to="/contact">Contact Us</FooterLink>
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
            <FooterLink to="/terms">Terms of Service</FooterLink>
          </FooterLinks>
        </FooterSection>
      </FooterContent>
      
      <FooterBottom>
        <p>&copy; 2024 RecipeShare. All rights reserved. Made with ❤️ by Prabesh and many more.</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;