import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiClock, FiUsers, FiStar, FiHeart, FiShoppingCart, FiDollarSign } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Card = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 220px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const RecipeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
`;

const PremiumBadge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #1a202c;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
`;

const DifficultyBadge = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.$difficulty) {
      case 'easy': return 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
      case 'medium': return 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)';
      case 'hard': return 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)';
      default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  }};
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const FavoriteButton = styled.button`
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: white;
    transform: scale(1.1);
  }
  
  svg {
    color: ${props => props.$isFavorited ? '#e53e3e' : '#4a5568'};
    fill: ${props => props.$isFavorited ? '#e53e3e' : 'none'};
  }
`;

const CardContent = styled.div`
  padding: 24px;
`;

const RecipeTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1a202c;
  line-height: 1.3;
  
  a {
    text-decoration: none;
    color: inherit;
    
    &:hover {
      color: #667eea;
    }
  }
`;

const RecipeDescription = styled.p`
  color: #4a5568;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const RecipeInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 14px;
  color: #4a5568;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  
  svg {
    color: #667eea;
  }
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Price = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #667eea;
`;

const OriginalPrice = styled.span`
  font-size: 1rem;
  color: #a0aec0;
  text-decoration: line-through;
`;

const DiscountBadge = styled.span`
  background: #e53e3e;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Author = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #4a5568;
  font-size: 14px;
  
  &:hover {
    color: #667eea;
  }
`;

const AuthorAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #ed8936;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(ActionButton)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

const SecondaryButton = styled(ActionButton)`
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  
  &:hover:not(:disabled) {
    background: #edf2f7;
    border-color: #cbd5e0;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
`;

const Tag = styled.span`
  padding: 4px 8px;
  background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
  color: #4a5568;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const RecipeCard = ({ recipe }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  if (!recipe) return null;
  
  const {
    _id,
    title,
    description,
    images,
    cookingTime = 0,
    prepTime = 0,
    servings = 1,
    difficulty = 'easy',
    author,
    averageRating = 0,
    totalRatings = 0,
    dietaryTags = [],
    cuisine = 'Other',
    isPremium = false,
    price = 0,
    originalPrice = 0,
    discount = 0
  } = recipe;

  const totalTime = cookingTime + prepTime;
  const mainImage = images && images.length > 0 ? images[0].url : null;
  const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;

  if (!author) return null;

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (user.role === 'admin') {
      toast.error('Admins cannot add items to cart. Cart is for users only.');
      return;
    }

    if (!isPremium || price === 0) {
      toast.error('This recipe is free and cannot be added to cart');
      return;
    }

    setIsAddingToCart(true);
    try {
      await axios.post('/api/cart/add', {
        recipeId: _id,
        quantity: 1,
        servings: servings
      });
      toast.success('Recipe added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error('Please login to favorite recipes');
      navigate('/login');
      return;
    }

    try {
      await axios.post(`/api/recipes/${_id}/favorite`);
      toast.success('Recipe favorited!');
    } catch (error) {
      toast.error('Failed to favorite recipe');
    }
  };

  return (
    <Card>
      <ImageContainer>
        {mainImage ? (
          <RecipeImage src={mainImage} alt={title} />
        ) : (
          <ImagePlaceholder>🍳</ImagePlaceholder>
        )}
        
        {isPremium && <PremiumBadge>Premium</PremiumBadge>}
        
        <DifficultyBadge $difficulty={difficulty}>
          {difficulty}
        </DifficultyBadge>
        
        <FavoriteButton 
          onClick={handleFavorite}
          $isFavorited={user?.favoriteRecipes?.includes(_id)}
        >
          <FiHeart size={18} />
        </FavoriteButton>
      </ImageContainer>
      
      <CardContent>
        <RecipeTitle>
          <Link to={`/recipe/${_id}`}>{title}</Link>
        </RecipeTitle>
        
        <RecipeDescription>{description}</RecipeDescription>
        
        <RecipeInfo>
          <InfoItem>
            <FiClock size={16} />
            {totalTime}m
          </InfoItem>
          <InfoItem>
            <FiUsers size={16} />
            {servings} servings
          </InfoItem>
          <InfoItem>
            <span style={{ 
              padding: '2px 8px', 
              background: 'linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%)', 
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {cuisine}
            </span>
          </InfoItem>
        </RecipeInfo>

        {isPremium && price > 0 && (
          <PriceSection>
            <PriceContainer>
              <Price>Rs {finalPrice.toFixed(0)}</Price>
              {discount > 0 && (
                <>
                  <OriginalPrice>Rs {originalPrice.toFixed(0)}</OriginalPrice>
                  <DiscountBadge>{discount}% OFF</DiscountBadge>
                </>
              )}
            </PriceContainer>
          </PriceSection>
        )}
        
        <AuthorInfo>
          <Author to={`/user/${author._id}`}>
            {author.avatar ? (
              <AuthorAvatar src={author.avatar} alt={author.username} />
            ) : (
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {author.username.charAt(0).toUpperCase()}
              </div>
            )}
            {author.username}
          </Author>
          
          {totalRatings > 0 && (
            <Rating>
              <FiStar fill="currentColor" />
              {averageRating.toFixed(1)} ({totalRatings})
            </Rating>
          )}
        </AuthorInfo>

        <ActionButtons>
          {isPremium && price > 0 ? (
            user && user.role !== 'admin' ? (
              <PrimaryButton 
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                <FiShoppingCart size={16} />
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </PrimaryButton>
            ) : user && user.role === 'admin' ? (
              <PrimaryButton as={Link} to={`/recipe/${_id}`}>
                <FiStar size={16} />
                View Recipe (Admin)
              </PrimaryButton>
            ) : (
              <PrimaryButton as={Link} to="/login">
                <FiShoppingCart size={16} />
                Login to Purchase
              </PrimaryButton>
            )
          ) : (
            <PrimaryButton as={Link} to={`/recipe/${_id}`}>
              <FiStar size={16} />
              View Recipe
            </PrimaryButton>
          )}
          
          <SecondaryButton as={Link} to={`/recipe/${_id}`}>
            View Details
          </SecondaryButton>
        </ActionButtons>
        
        {dietaryTags && dietaryTags.length > 0 && (
          <TagsContainer>
            {dietaryTags.slice(0, 3).map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
            {dietaryTags.length > 3 && (
              <Tag>+{dietaryTags.length - 3} more</Tag>
            )}
          </TagsContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeCard;