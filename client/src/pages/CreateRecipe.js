import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiPlus, FiX, FiUpload, FiLock } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 40px;
  text-align: center;
`;

const Form = styled.form`
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const Section = styled.div`
  margin-bottom: 40px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e2e8f0;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2d3748;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
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

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const IngredientItem = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 12px;
  align-items: end;
  padding: 16px;
  background: #f7fafc;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const InstructionItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: start;
  padding: 16px;
  background: #f7fafc;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const StepNumber = styled.div`
  background: #667eea;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
  margin-top: 12px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const SecondaryButton = styled(Button)`
  background: #e2e8f0;
  color: #4a5568;
  
  &:hover:not(:disabled) {
    background: #cbd5e0;
  }
`;

const RemoveButton = styled(Button)`
  background: #fed7d7;
  color: #c53030;
  padding: 8px;
  
  &:hover:not(:disabled) {
    background: #feb2b2;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const Tag = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #667eea;
  }
  
  input:checked + & {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }
`;

const CreateRecipe = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      ingredients: [{ name: '', amount: '', unit: '' }],
      instructions: [{ description: '' }]
    }
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: 'ingredients'
  });

  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control,
    name: 'instructions'
  });

  const dietaryOptions = [
    'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 
    'keto', 'paleo', 'low-carb', 'mediterranean'
  ];

  const cuisines = [
    'Italian', 'Chinese', 'Mexican', 'Indian', 'French', 
    'Japanese', 'Thai', 'Greek', 'Spanish', 'American'
  ];

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const recipeData = {
        ...data,
        dietaryTags: selectedTags,
        tags: selectedTags
      };

      await axios.post('/api/recipes', recipeData);
      toast.success('Recipe created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Create recipe error:', error);
      toast.error(error.response?.data?.message || 'Failed to create recipe');
    } finally {
      setLoading(false);
    }
  };

  // Admin-only protection - AFTER all hooks
  if (!user || user.role !== 'admin') {
    return (
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}
        >
          <FiLock size={64} color="#e53e3e" style={{ marginBottom: '20px' }} />
          <h2 style={{ color: '#2d3748', marginBottom: '16px' }}>Admin Access Required</h2>
          <p style={{ color: '#4a5568', marginBottom: '24px' }}>
            Only administrators can create recipes. This helps maintain quality and consistency across the platform.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '12px 24px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Back to Home
          </button>
        </motion.div>
      </Container>
    );
  }

  const categories = [
    'breakfast', 'lunch', 'dinner', 'dessert', 
    'snack', 'appetizer', 'beverage'
  ];

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Create New Recipe</Title>
        
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Section>
            <SectionTitle>Basic Information</SectionTitle>
            
            <FormGroup>
              <Label htmlFor="title">Recipe Title *</Label>
              <Input
                id="title"
                {...register('title', { required: 'Title is required' })}
                placeholder="Enter recipe title"
              />
              {errors.title && <div className="error">{errors.title.message}</div>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register('description', { required: 'Description is required' })}
                placeholder="Describe your recipe..."
              />
              {errors.description && <div className="error">{errors.description.message}</div>}
            </FormGroup>

            <GridContainer>
              <FormGroup>
                <Label htmlFor="cuisine">Cuisine *</Label>
                <Select
                  id="cuisine"
                  {...register('cuisine', { required: 'Cuisine is required' })}
                >
                  <option value="">Select cuisine</option>
                  {cuisines.map(cuisine => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </Select>
                {errors.cuisine && <div className="error">{errors.cuisine.message}</div>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="category">Category *</Label>
                <Select
                  id="category"
                  {...register('category', { required: 'Category is required' })}
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </Select>
                {errors.category && <div className="error">{errors.category.message}</div>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="difficulty">Difficulty *</Label>
                <Select
                  id="difficulty"
                  {...register('difficulty', { required: 'Difficulty is required' })}
                >
                  <option value="">Select difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </Select>
                {errors.difficulty && <div className="error">{errors.difficulty.message}</div>}
              </FormGroup>
            </GridContainer>

            <GridContainer>
              <FormGroup>
                <Label htmlFor="prepTime">Prep Time (minutes) *</Label>
                <Input
                  id="prepTime"
                  type="number"
                  {...register('prepTime', { required: 'Prep time is required', min: 1 })}
                  placeholder="15"
                />
                {errors.prepTime && <div className="error">{errors.prepTime.message}</div>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="cookingTime">Cooking Time (minutes) *</Label>
                <Input
                  id="cookingTime"
                  type="number"
                  {...register('cookingTime', { required: 'Cooking time is required', min: 1 })}
                  placeholder="30"
                />
                {errors.cookingTime && <div className="error">{errors.cookingTime.message}</div>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="servings">Servings *</Label>
                <Input
                  id="servings"
                  type="number"
                  {...register('servings', { required: 'Servings is required', min: 1 })}
                  placeholder="4"
                />
                {errors.servings && <div className="error">{errors.servings.message}</div>}
              </FormGroup>
            </GridContainer>
          </Section>

          <Section>
            <SectionTitle>Ingredients</SectionTitle>
            
            {ingredientFields.map((field, index) => (
              <IngredientItem key={field.id}>
                <div>
                  <Label>Ingredient Name *</Label>
                  <Input
                    {...register(`ingredients.${index}.name`, { required: 'Ingredient name is required' })}
                    placeholder="e.g., Flour"
                  />
                </div>
                <div>
                  <Label>Amount *</Label>
                  <Input
                    {...register(`ingredients.${index}.amount`, { required: 'Amount is required' })}
                    placeholder="2"
                  />
                </div>
                <div>
                  <Label>Unit *</Label>
                  <Input
                    {...register(`ingredients.${index}.unit`, { required: 'Unit is required' })}
                    placeholder="cups"
                  />
                </div>
                {ingredientFields.length > 1 && (
                  <RemoveButton
                    type="button"
                    onClick={() => removeIngredient(index)}
                  >
                    <FiX />
                  </RemoveButton>
                )}
              </IngredientItem>
            ))}
            
            <SecondaryButton
              type="button"
              onClick={() => appendIngredient({ name: '', amount: '', unit: '' })}
            >
              <FiPlus /> Add Ingredient
            </SecondaryButton>
          </Section>

          <Section>
            <SectionTitle>Instructions</SectionTitle>
            
            {instructionFields.map((field, index) => (
              <InstructionItem key={field.id}>
                <StepNumber>{index + 1}</StepNumber>
                <div style={{ flex: 1 }}>
                  <Label>Step {index + 1} *</Label>
                  <Textarea
                    {...register(`instructions.${index}.description`, { required: 'Instruction is required' })}
                    placeholder="Describe this step..."
                  />
                </div>
                {instructionFields.length > 1 && (
                  <RemoveButton
                    type="button"
                    onClick={() => removeInstruction(index)}
                  >
                    <FiX />
                  </RemoveButton>
                )}
              </InstructionItem>
            ))}
            
            <SecondaryButton
              type="button"
              onClick={() => appendInstruction({ description: '' })}
            >
              <FiPlus /> Add Step
            </SecondaryButton>
          </Section>

          <Section>
            <SectionTitle>Dietary Tags</SectionTitle>
            <TagsContainer>
              {dietaryOptions.map(tag => (
                <Tag key={tag}>
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                    style={{ display: 'none' }}
                  />
                  <span style={{ 
                    background: selectedTags.includes(tag) ? '#667eea' : '#f7fafc',
                    color: selectedTags.includes(tag) ? 'white' : '#4a5568',
                    padding: '8px 12px',
                    borderRadius: '20px',
                    border: `2px solid ${selectedTags.includes(tag) ? '#667eea' : '#e2e8f0'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}>
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </span>
                </Tag>
              ))}
            </TagsContainer>
          </Section>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <SecondaryButton
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Recipe'}
            </PrimaryButton>
          </div>
        </Form>
      </motion.div>
    </Container>
  );
};

export default CreateRecipe;