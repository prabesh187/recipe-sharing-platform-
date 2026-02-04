import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiClock, FiUsers, FiStar, FiHeart, FiEdit, FiTrash2, 
  FiBook, FiBookmark, FiShare2 
} from 'react-icons/fi';

// Simple star rating component
const StarRating = ({ rating, size = 16, editable = false, onChange }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleClick = (starRating) => {
    if (editable && onChange) {
      onChange(starRating);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          size={size}
          style={{
            color: star <= (hoverRating || rating) ? '#ed8936' : '#e2e8f0',
            fill: star <= (hoverRating || rating) ? '#ed8936' : 'none',
            cursor: editable ? 'pointer' : 'default',
            transition: 'all 0.2s ease'
          }}
          onClick={() => handleClick(star)}
          onMouseEnter={() => editable && setHoverRating(star)}
          onMouseLeave={() => editable && setHoverRating(0)}
        />
      ))}
    </div>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const RecipeHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  height: 400px;
`;

const RecipeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 4rem;
`;

const RecipeInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 16px;
  line-height: 1.2;
`;

const Description = styled.p`
  color: #4a5568;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const MetaInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f7fafc;
  border-radius: 8px;
  
  svg {
    color: #667eea;
  }
`;

const AuthorSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: #f7fafc;
  border-radius: 12px;
  margin-bottom: 24px;
`;

const AuthorInfo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  
  &:hover {
    color: #667eea;
  }
`;

const AuthorAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 2px solid #667eea;
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#667eea'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: #667eea;
    color: white;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const Section = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IngredientList = styled.ul`
  list-style: none;
  padding: 0;
`;

const IngredientItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const InstructionList = styled.ol`
  padding-left: 0;
  counter-reset: step-counter;
`;

const InstructionItem = styled.li`
  counter-increment: step-counter;
  margin-bottom: 20px;
  padding-left: 60px;
  position: relative;
  
  &::before {
    content: counter(step-counter);
    position: absolute;
    left: 0;
    top: 0;
    background: #667eea;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

const Tag = styled.span`
  padding: 4px 12px;
  background: #edf2f7;
  color: #4a5568;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
`;

const RatingSection = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 40px;
`;

const RatingForm = styled.form`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
`;

const RecipeDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const { data: recipe, isLoading, error } = useQuery(
    ['recipe', id],
    () => axios.get(`/api/recipes/${id}`).then(res => res.data)
  );

  const { data: similarRecipes } = useQuery(
    ['similar-recipes', id],
    () => axios.get(`/api/recommendations/similar/${id}?limit=4`).then(res => res.data.recipes),
    { enabled: !!id }
  );

  const favoriteMutation = useMutation(
    () => axios.post(`/api/recipes/${id}/favorite`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['recipe', id]);
        toast.success('Recipe favorite status updated!');
      },
      onError: () => {
        toast.error('Failed to update favorite status');
      }
    }
  );

  const ratingMutation = useMutation(
    (data) => axios.post(`/api/recipes/${id}/rate`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['recipe', id]);
        toast.success('Rating submitted successfully!');
        setRating(0);
        setReview('');
      },
      onError: () => {
        toast.error('Failed to submit rating');
      }
    }
  );

  const handleFavorite = () => {
    if (!user) {
      toast.error('Please login to favorite recipes');
      return;
    }
    favoriteMutation.mutate();
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to rate recipes');
      return;
    }
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    ratingMutation.mutate({ rating, review });
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

  if (error || !recipe) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <h2>Recipe not found</h2>
          <p>The recipe you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </Container>
    );
  }

  const isOwner = user && user.id === recipe.author._id;
  const userRating = recipe.ratings?.find(r => r.user._id === user?.id);
  const mainImage = recipe.images && recipe.images.length > 0 ? recipe.images[0].url : null;

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <RecipeHeader>
          <ImageContainer>
            {mainImage ? (
              <RecipeImage src={mainImage} alt={recipe.title} />
            ) : (
              <ImagePlaceholder>🍳</ImagePlaceholder>
            )}
          </ImageContainer>

          <RecipeInfo>
            <div>
              <Title>{recipe.title}</Title>
              <Description>{recipe.description}</Description>
              
              <MetaInfo>
                <MetaItem>
                  <FiClock />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>
                      {recipe.prepTime + recipe.cookingTime}m
                    </div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>
                      Total Time
                    </div>
                  </div>
                </MetaItem>
                <MetaItem>
                  <FiUsers />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{recipe.servings}</div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>Servings</div>
                  </div>
                </MetaItem>
                <MetaItem>
                  <FiBook />
                  <div>
                    <div style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                      {recipe.difficulty}
                    </div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>Difficulty</div>
                  </div>
                </MetaItem>
                <MetaItem>
                  <FiStar />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>
                      {recipe.averageRating.toFixed(1)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>
                      ({recipe.totalRatings} reviews)
                    </div>
                  </div>
                </MetaItem>
              </MetaInfo>

              {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
                <TagsContainer>
                  {recipe.dietaryTags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </TagsContainer>
              )}
            </div>

            <AuthorSection>
              <AuthorInfo to={`/user/${recipe.author._id}`}>
                {recipe.author.avatar ? (
                  <AuthorAvatar src={recipe.author.avatar} alt={recipe.author.username} />
                ) : (
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#667eea',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold'
                  }}>
                    {recipe.author.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 'bold' }}>{recipe.author.username}</div>
                  <div style={{ fontSize: '14px', color: '#718096' }}>Recipe Author</div>
                </div>
              </AuthorInfo>

              <ActionButtons>
                {user && (
                  <ActionButton onClick={handleFavorite}>
                    <FiHeart fill={user.favoriteRecipes?.includes(recipe._id) ? 'currentColor' : 'none'} />
                    Favorite
                  </ActionButton>
                )}
                {isOwner && (
                  <>
                    <ActionButton onClick={() => navigate(`/edit-recipe/${recipe._id}`)}>
                      <FiEdit /> Edit
                    </ActionButton>
                    <ActionButton style={{ borderColor: '#e53e3e', color: '#e53e3e' }}>
                      <FiTrash2 /> Delete
                    </ActionButton>
                  </>
                )}
              </ActionButtons>
            </AuthorSection>
          </RecipeInfo>
        </RecipeHeader>

        <ContentGrid>
          <Section>
            <SectionTitle>
              <FiBookmark /> Ingredients
            </SectionTitle>
            <IngredientList>
              {recipe.ingredients.map((ingredient, index) => (
                <IngredientItem key={index}>
                  <span>{ingredient.name}</span>
                  <span style={{ fontWeight: 'bold' }}>
                    {ingredient.amount} {ingredient.unit}
                  </span>
                </IngredientItem>
              ))}
            </IngredientList>
          </Section>

          <Section>
            <SectionTitle>
              <FiBook /> Instructions
            </SectionTitle>
            <InstructionList>
              {recipe.instructions.map((instruction, index) => (
                <InstructionItem key={index}>
                  {instruction.description}
                </InstructionItem>
              ))}
            </InstructionList>
          </Section>
        </ContentGrid>

        <RatingSection>
          <SectionTitle>
            <FiStar /> Ratings & Reviews
          </SectionTitle>
          
          {recipe.ratings && recipe.ratings.length > 0 ? (
            <div>
              {recipe.ratings.slice(0, 5).map((rating, index) => (
                <div key={index} style={{ 
                  padding: '16px 0', 
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  gap: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <StarRating rating={rating.rating} size={16} />
                    <span style={{ fontWeight: 'bold' }}>{rating.user.username}</span>
                  </div>
                  {rating.review && (
                    <p style={{ margin: 0, color: '#4a5568' }}>{rating.review}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#718096' }}>No reviews yet. Be the first to rate this recipe!</p>
          )}

          {user && !userRating && !isOwner && user.role !== 'admin' && (
            <RatingForm onSubmit={handleRatingSubmit}>
              <h3>Rate this recipe</h3>
              <div style={{ marginBottom: '16px' }}>
                <StarRating 
                  rating={rating} 
                  size={24} 
                  editable={true} 
                  onChange={setRating} 
                />
              </div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write a review (optional)..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={ratingMutation.isLoading}
              >
                {ratingMutation.isLoading ? 'Submitting...' : 'Submit Rating'}
              </button>
            </RatingForm>
          )}
          
          {user && user.role === 'admin' && (
            <div style={{
              background: '#f7fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '16px',
              marginTop: '20px',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, color: '#4a5568' }}>
                👑 <strong>Admin Note:</strong> Administrators cannot rate recipes. Only users can provide reviews to maintain objectivity.
              </p>
            </div>
          )}
        </RatingSection>
      </motion.div>
    </Container>
  );
};

export default RecipeDetail;