import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import RecipeCard from '../components/Recipe/RecipeCard';
import { FiFilter, FiX } from 'react-icons/fi';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const SearchHeader = styled.div`
  margin-bottom: 40px;
`;

const SearchTitle = styled.h1`
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 16px;
`;

const SearchSubtitle = styled.p`
  color: #4a5568;
  font-size: 1.1rem;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: #2d3748;
  font-size: 14px;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 2px solid #667eea;
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#667eea'};
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: #667eea;
    color: white;
  }
`;

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

const ActiveFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background: #667eea;
  color: white;
  border-radius: 20px;
  font-size: 14px;
`;

const RemoveFilter = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const ResultsInfo = styled.div`
  margin-bottom: 30px;
  color: #4a5568;
  font-size: 1.1rem;
`;

const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #4a5568;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 16px;
  }
  
  p {
    font-size: 1.1rem;
  }
`;

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    cuisine: searchParams.get('cuisine') || '',
    category: searchParams.get('category') || '',
    difficulty: searchParams.get('difficulty') || '',
    dietaryTags: searchParams.get('dietaryTags') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc'
  });

  const { data, isLoading, error } = useQuery(
    ['search-recipes', filters],
    () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      return axios.get(`/api/recipes?${params.toString()}`).then(res => res.data);
    },
    {
      keepPreviousData: true,
      enabled: true
    }
  );

  useEffect(() => {
    const newParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
    });
    setSearchParams(newParams);
  }, [filters, setSearchParams]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const removeFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: '' }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      cuisine: '',
      category: '',
      difficulty: '',
      dietaryTags: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const activeFilters = Object.entries(filters).filter(([key, value]) => 
    value && key !== 'sortBy' && key !== 'sortOrder'
  );

  const cuisines = ['Italian', 'Chinese', 'Mexican', 'Indian', 'French', 'Japanese', 'Thai', 'Mediterranean', 'American'];
  const categories = ['breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'appetizer', 'beverage'];
  const difficulties = ['easy', 'medium', 'hard'];
  const dietaryOptions = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'low-carb'];

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SearchHeader>
          <SearchTitle>
            {filters.search ? `Search Results for "${filters.search}"` : 'Browse Recipes'}
          </SearchTitle>
          <SearchSubtitle>
            Discover amazing recipes from our community of food lovers
          </SearchSubtitle>
        </SearchHeader>

        <FiltersContainer>
          <FilterGroup>
            <FilterLabel>Cuisine</FilterLabel>
            <FilterSelect
              value={filters.cuisine}
              onChange={(e) => updateFilter('cuisine', e.target.value)}
            >
              <option value="">All Cuisines</option>
              {cuisines.map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Category</FilterLabel>
            <FilterSelect
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Difficulty</FilterLabel>
            <FilterSelect
              value={filters.difficulty}
              onChange={(e) => updateFilter('difficulty', e.target.value)}
            >
              <option value="">All Levels</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Dietary</FilterLabel>
            <FilterSelect
              value={filters.dietaryTags}
              onChange={(e) => updateFilter('dietaryTags', e.target.value)}
            >
              <option value="">All Diets</option>
              {dietaryOptions.map(option => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Sort By</FilterLabel>
            <FilterSelect
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                updateFilter('sortBy', sortBy);
                updateFilter('sortOrder', sortOrder);
              }}
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="averageRating-desc">Highest Rated</option>
              <option value="views-desc">Most Popular</option>
              <option value="cookingTime-asc">Quickest</option>
            </FilterSelect>
          </FilterGroup>

          {activeFilters.length > 0 && (
            <FilterButton onClick={clearAllFilters}>
              <FiX /> Clear All
            </FilterButton>
          )}
        </FiltersContainer>

        {activeFilters.length > 0 && (
          <ActiveFilters>
            {activeFilters.map(([key, value]) => (
              <ActiveFilter key={key}>
                {key === 'dietaryTags' ? 'Diet' : key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                <RemoveFilter onClick={() => removeFilter(key)}>
                  <FiX size={14} />
                </RemoveFilter>
              </ActiveFilter>
            ))}
          </ActiveFilters>
        )}

        {isLoading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: '#e53e3e', padding: '40px' }}>
            Error loading recipes. Please try again.
          </div>
        ) : (
          <>
            <ResultsInfo>
              Found {data?.total || 0} recipes
              {filters.search && ` for "${filters.search}"`}
            </ResultsInfo>

            {data?.recipes?.length > 0 ? (
              <RecipeGrid>
                {data.recipes.map((recipe, index) => (
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
              <NoResults>
                <h3>No recipes found</h3>
                <p>Try adjusting your search criteria or browse all recipes</p>
              </NoResults>
            )}
          </>
        )}
      </motion.div>
    </Container>
  );
};

export default Search;