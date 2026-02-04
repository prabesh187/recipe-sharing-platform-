import React from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import RecipeCard from '../components/Recipe/RecipeCard';
import { FiHeart, FiTrendingUp, FiStar, FiUser } from 'react-icons/fi';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #2d3748;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #4a5568;
  max-width: 600px;
  margin: 0 auto;
`;

const Section = styled.section`
  margin-bottom: 60px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: #2d3748;
`;

const SectionDescription = styled.p`
  color: #4a5568;
  margin-left: auto;
  font-style: italic;
`;

const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
`;

const LoadingCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  
  h3 {
    font-size: 1.5rem;
    color: #2d3748;
    margin-bottom: 16px;
  }
  
  p {
    color: #4a5568;
    font-size: 1.1rem;
    margin-bottom: 24px;
  }
`;

const RecommendationCard = styled.div`
  position: relative;
  
  &::before {
    content: '${props => props.$reason || ''}';
    position: absolute;
    top: 12px;
    left: 12px;
    background: rgba(102, 126, 234, 0.9);
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    z-index: 10;
    backdrop-filter: blur(10px);
    display: ${props => props.$reason ? 'block' : 'none'};
  }
`;

const ScoreIndicator = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(237, 137, 54, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  z-index: 10;
  backdrop-filter: blur(10px);
`;

const Recommendations = () => {
  const { data: personalizedRecs, isLoading: personalizedLoading } = useQuery(
    'personalized-recommendations',
    () => axios.get('/api/recommendations/for-you?limit=8').then(res => res.data.recommendations)
  );

  const { data: trendingRecs, isLoading: trendingLoading } = useQuery(
    'trending-recommendations',
    () => axios.get('/api/recommendations/trending?limit=6').then(res => res.data.recipes)
  );

  const { data: popularRecs, isLoading: popularLoading } = useQuery(
    'popular-recommendations',
    () => axios.get('/api/recipes?sortBy=averageRating&limit=6').then(res => res.data.recipes)
  );

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <Title>
            <FiHeart /> Recommendations For You
          </Title>
          <Subtitle>
            Discover recipes tailored to your taste preferences, cooking style, and dietary needs. 
            Our smart algorithm learns from your interactions to suggest the perfect dishes.
          </Subtitle>
        </Header>

        <Section>
          <SectionHeader>
            <FiUser />
            <SectionTitle>Personalized Picks</SectionTitle>
            <SectionDescription>Based on your preferences and activity</SectionDescription>
          </SectionHeader>
          
          {personalizedLoading ? (
            <RecipeGrid>
              {[...Array(4)].map((_, index) => (
                <LoadingCard key={index}>
                  <div className="spinner"></div>
                  <p>Finding perfect recipes for you...</p>
                </LoadingCard>
              ))}
            </RecipeGrid>
          ) : personalizedRecs && personalizedRecs.length > 0 ? (
            <RecipeGrid>
              {personalizedRecs.map((rec, index) => (
                <motion.div
                  key={rec.recipe._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RecommendationCard $reason={rec.reason}>
                    <ScoreIndicator>
                      {Math.round(rec.score * 20)}% match
                    </ScoreIndicator>
                    <RecipeCard recipe={rec.recipe} />
                  </RecommendationCard>
                </motion.div>
              ))}
            </RecipeGrid>
          ) : (
            <EmptyState>
              <h3>Building Your Profile</h3>
              <p>
                Rate some recipes and mark your favorites to get personalized recommendations!
              </p>
              <a href="/search" className="btn btn-primary">
                Browse Recipes
              </a>
            </EmptyState>
          )}
        </Section>

        <Section>
          <SectionHeader>
            <FiTrendingUp />
            <SectionTitle>Trending Now</SectionTitle>
            <SectionDescription>What's popular in the community</SectionDescription>
          </SectionHeader>
          
          {trendingLoading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <RecipeGrid>
              {trendingRecs?.map((recipe, index) => (
                <motion.div
                  key={recipe._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </RecipeGrid>
          )}
        </Section>

        <Section>
          <SectionHeader>
            <FiStar />
            <SectionTitle>Highly Rated</SectionTitle>
            <SectionDescription>Community favorites with top ratings</SectionDescription>
          </SectionHeader>
          
          {popularLoading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <RecipeGrid>
              {popularRecs?.map((recipe, index) => (
                <motion.div
                  key={recipe._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </RecipeGrid>
          )}
        </Section>
      </motion.div>
    </Container>
  );
};

export default Recommendations;