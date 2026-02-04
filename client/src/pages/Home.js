import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import RecipeCard from '../components/Recipe/RecipeCard';
import { FiTrendingUp, FiClock, FiStar, FiPlus, FiSettings } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 0;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 40px;
  opacity: 0.9;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Section = styled.section`
  padding: 60px 0;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 50px;
  color: #2d3748;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const StatsSection = styled.section`
  background: #f7fafc;
  padding: 60px 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 30px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: #4a5568;
  font-weight: 500;
`;

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: trendingRecipes, isLoading: trendingLoading } = useQuery(
    'trending-recipes',
    () => axios.get('/api/recommendations/trending?limit=6').then(res => res.data.recipes),
    { 
      retry: 1,
      onError: (error) => console.error('Trending recipes error:', error)
    }
  );

  const { data: popularRecipes, isLoading: popularLoading } = useQuery(
    'popular-recipes',
    () => axios.get('/api/recipes?sortBy=averageRating&limit=6').then(res => res.data.recipes),
    { 
      retry: 1,
      onError: (error) => console.error('Popular recipes error:', error)
    }
  );

  const { data: recentRecipes, isLoading: recentLoading } = useQuery(
    'recent-recipes',
    () => axios.get('/api/recipes?sortBy=createdAt&limit=6').then(res => res.data.recipes),
    { 
      retry: 1,
      onError: (error) => console.error('Recent recipes error:', error)
    }
  );

  // Redirect admin to dashboard immediately
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);
  
  // Don't render home page for admin - but do this AFTER all hooks
  if (user && user.role === 'admin') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <HeroSection>
        <HeroContent>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {user && user.role === 'admin' ? (
              <>
                <HeroTitle>👑 Admin Dashboard</HeroTitle>
                <HeroSubtitle>
                  Manage your recipe platform, create amazing content, and monitor user activity
                </HeroSubtitle>
                <HeroButtons>
                  <Link to="/create-recipe" className="btn btn-primary">
                    <FiPlus style={{ marginRight: '8px' }} />
                    Create Recipe
                  </Link>
                  <Link to="/admin" className="btn btn-outline">
                    <FiSettings style={{ marginRight: '8px' }} />
                    Admin Dashboard
                  </Link>
                </HeroButtons>
              </>
            ) : (
              <>
                <HeroTitle>Discover Amazing Recipes</HeroTitle>
                <HeroSubtitle>
                  Explore thousands of delicious recipes from food lovers around the world. Find your next favorite dish.
                  {user ? ' Find your next favorite dish!' : ' Join our community today!'}
                </HeroSubtitle>
                <HeroButtons>
                  <Link to="/search" className="btn btn-primary">
                    Browse Recipes
                  </Link>
                  {user ? (
                    <Link to="/recommendations" className="btn btn-outline">
                      For You
                    </Link>
                  ) : (
                    <Link to="/register" className="btn btn-outline">
                      Join Community
                    </Link>
                  )}
                </HeroButtons>
              </>
            )}
          </motion.div>
        </HeroContent>
      </HeroSection>

      <StatsSection>
        <div className="container">
          <StatsGrid>
            <StatCard>
              <StatNumber>10K+</StatNumber>
              <StatLabel>Recipes Shared</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>5K+</StatNumber>
              <StatLabel>Active Cooks</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>50+</StatNumber>
              <StatLabel>Cuisines</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>4.8★</StatNumber>
              <StatLabel>Average Rating</StatLabel>
            </StatCard>
          </StatsGrid>
        </div>
      </StatsSection>

      <Section>
        <div className="container">
          <SectionTitle>
            <FiTrendingUp /> Trending Now
          </SectionTitle>
          {trendingLoading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <RecipeGrid>
              {trendingRecipes?.map((recipe, index) => (
                <motion.div
                  key={recipe._id}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </RecipeGrid>
          )}
        </div>
      </Section>

      <Section style={{ background: '#f7fafc' }}>
        <div className="container">
          <SectionTitle>
            <FiStar /> Highest Rated
          </SectionTitle>
          {popularLoading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <RecipeGrid>
              {popularRecipes?.map((recipe, index) => (
                <motion.div
                  key={recipe._id}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </RecipeGrid>
          )}
        </div>
      </Section>

      <Section>
        <div className="container">
          <SectionTitle>
            <FiClock /> Recently Added
          </SectionTitle>
          {recentLoading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <RecipeGrid>
              {recentRecipes?.map((recipe, index) => (
                <motion.div
                  key={recipe._id}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </RecipeGrid>
          )}
        </div>
      </Section>
    </motion.div>
  );
};

export default Home;