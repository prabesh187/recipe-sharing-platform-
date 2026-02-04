import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import RecipeCard from '../components/Recipe/RecipeCard';
import { 
  FiUser, FiHeart, FiUsers, FiEdit, FiUserPlus, FiUserMinus, FiBook 
} from 'react-icons/fi';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const ProfileHeader = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 40px;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #667eea;
`;

const AvatarPlaceholder = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: bold;
  border: 4px solid #667eea;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const Username = styled.h1`
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 8px;
`;

const Bio = styled.p`
  color: #4a5568;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const Stats = styled.div`
  display: flex;
  gap: 30px;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const StatItem = styled.div`
  text-align: center;
  
  .number {
    font-size: 1.5rem;
    font-weight: bold;
    color: #667eea;
    display: block;
  }
  
  .label {
    color: #4a5568;
    font-size: 14px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 2px solid #667eea;
  background: ${props => props.primary ? '#667eea' : 'white'};
  color: ${props => props.primary ? 'white' : '#667eea'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TabContainer = styled.div`
  margin-bottom: 40px;
`;

const TabButtons = styled.div`
  display: flex;
  gap: 0;
  background: white;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  border: none;
  background: ${props => props.active ? '#667eea' : 'transparent'};
  color: ${props => props.active ? 'white' : '#4a5568'};
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? '#667eea' : '#f7fafc'};
  }
`;

const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
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
  }
`;

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('recipes');

  const { data: profileData, isLoading } = useQuery(
    ['user-profile', id],
    () => axios.get(`/api/users/${id}`).then(res => res.data)
  );

  const followMutation = useMutation(
    () => axios.post(`/api/users/${id}/follow`),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['user-profile', id]);
        toast.success(data.data.message);
      },
      onError: () => {
        toast.error('Failed to update follow status');
      }
    }
  );

  const isOwnProfile = currentUser && currentUser.id === id;
  const isFollowing = profileData?.user?.followers?.some(followerId => 
    followerId.toString() === currentUser?.id?.toString()
  );

  const handleFollow = () => {
    if (!currentUser) {
      toast.error('Please login to follow users');
      return;
    }
    followMutation.mutate();
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

  if (!profileData) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <h2>User not found</h2>
          <p>The user profile you're looking for doesn't exist.</p>
        </div>
      </Container>
    );
  }

  const { user, recipes, stats } = profileData;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'recipes':
        return recipes && recipes.length > 0 ? (
          <RecipeGrid>
            {recipes.map((recipe, index) => (
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
        ) : (
          <EmptyState>
            <h3>No recipes yet</h3>
            <p>
              {isOwnProfile 
                ? "You haven't shared any recipes yet. Create your first recipe!"
                : `${user.username} hasn't shared any recipes yet.`
              }
            </p>
          </EmptyState>
        );

      case 'favorites':
        return user.favoriteRecipes && user.favoriteRecipes.length > 0 ? (
          <RecipeGrid>
            {user.favoriteRecipes.map((recipe, index) => (
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
        ) : (
          <EmptyState>
            <h3>No favorite recipes</h3>
            <p>
              {isOwnProfile 
                ? "You haven't favorited any recipes yet."
                : `${user.username} hasn't favorited any recipes yet.`
              }
            </p>
          </EmptyState>
        );

      default:
        return null;
    }
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ProfileHeader>
          <ProfileInfo>
            {user.avatar ? (
              <Avatar src={user.avatar} alt={user.username} />
            ) : (
              <AvatarPlaceholder>
                {user.username.charAt(0).toUpperCase()}
              </AvatarPlaceholder>
            )}
            
            <UserDetails>
              <Username>{user.username}</Username>
              {user.bio && <Bio>{user.bio}</Bio>}
              
              <Stats>
                <StatItem>
                  <span className="number">{stats.totalRecipes}</span>
                  <span className="label">Recipes</span>
                </StatItem>
                <StatItem>
                  <span className="number">{stats.totalFollowers}</span>
                  <span className="label">Followers</span>
                </StatItem>
                <StatItem>
                  <span className="number">{stats.totalFollowing}</span>
                  <span className="label">Following</span>
                </StatItem>
                <StatItem>
                  <span className="number">{stats.totalFavorites}</span>
                  <span className="label">Favorites</span>
                </StatItem>
              </Stats>
            </UserDetails>
            
            <ActionButtons>
              {isOwnProfile ? (
                <ActionButton primary>
                  <FiEdit /> Edit Profile
                </ActionButton>
              ) : currentUser ? (
                <ActionButton 
                  primary={!isFollowing}
                  onClick={handleFollow}
                  disabled={followMutation.isLoading}
                >
                  {isFollowing ? <FiUserMinus /> : <FiUserPlus />}
                  {followMutation.isLoading 
                    ? 'Loading...' 
                    : isFollowing 
                      ? 'Unfollow' 
                      : 'Follow'
                  }
                </ActionButton>
              ) : null}
            </ActionButtons>
          </ProfileInfo>
        </ProfileHeader>

        <TabContainer>
          <TabButtons>
            <TabButton 
              active={activeTab === 'recipes'} 
              onClick={() => setActiveTab('recipes')}
            >
              <FiBook /> Recipes ({stats.totalRecipes})
            </TabButton>
            {(isOwnProfile || user.favoriteRecipes?.length > 0) && (
              <TabButton 
                active={activeTab === 'favorites'} 
                onClick={() => setActiveTab('favorites')}
              >
                <FiHeart /> Favorites ({stats.totalFavorites})
              </TabButton>
            )}
          </TabButtons>
          
          {renderTabContent()}
        </TabContainer>
      </motion.div>
    </Container>
  );
};

export default Profile;