const express = require('express');
const { body, validationResult } = require('express-validator');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');
const { adminAuth } = require('../middleware/admin');

const router = express.Router();

// Get all recipes with filtering and pagination
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      cuisine,
      category,
      difficulty,
      dietaryTags,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      author
    } = req.query;

    const query = { isPublished: true };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (cuisine) query.cuisine = cuisine;
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (author) query.author = author;
    if (dietaryTags) {
      const tags = Array.isArray(dietaryTags) ? dietaryTags : [dietaryTags];
      query.dietaryTags = { $in: tags };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const recipes = await Recipe.find(query)
      .populate('author', 'username avatar')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Recipe.countDocuments(query);

    res.json({
      recipes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single recipe
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'username avatar bio')
      .populate('ratings.user', 'username avatar');

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Increment view count
    recipe.views += 1;
    await recipe.save();

    res.json(recipe);
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create recipe (Admin only)
router.post('/', auth, adminAuth, [
  body('title').isLength({ min: 1, max: 100 }).trim().escape(),
  body('description').isLength({ min: 1, max: 500 }).trim().escape(),
  body('ingredients').isArray({ min: 1 }),
  body('instructions').isArray({ min: 1 }),
  body('cookingTime').isInt({ min: 1 }),
  body('prepTime').isInt({ min: 1 }),
  body('servings').isInt({ min: 1 }),
  body('difficulty').isIn(['easy', 'medium', 'hard']),
  body('cuisine').isLength({ min: 1 }).trim().escape(),
  body('category').isIn(['breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'appetizer', 'beverage'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Process instructions to add step numbers
    const processedInstructions = req.body.instructions.map((instruction, index) => {
      // Handle both object format {description: "..."} and string format
      const description = typeof instruction === 'string' ? instruction : instruction.description;
      return {
        step: index + 1,
        description: description
      };
    });

    // Validate that all instructions have descriptions
    const invalidInstructions = processedInstructions.filter(inst => !inst.description || inst.description.trim() === '');
    if (invalidInstructions.length > 0) {
      return res.status(400).json({ 
        message: 'All instruction steps must have descriptions',
        errors: [{ msg: 'All instruction steps must have descriptions' }]
      });
    }

    // Validate that all ingredients have required fields
    const invalidIngredients = req.body.ingredients.filter(ing => !ing.name || !ing.amount || !ing.unit);
    if (invalidIngredients.length > 0) {
      return res.status(400).json({ 
        message: 'All ingredients must have name, amount, and unit',
        errors: [{ msg: 'All ingredients must have name, amount, and unit' }]
      });
    }

    const recipeData = {
      ...req.body,
      instructions: processedInstructions,
      author: req.user._id,
      // Ensure default values for optional fields
      images: req.body.images || [{
        url: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=800&h=600&fit=crop',
        caption: 'Delicious homemade recipe'
      }],
      tags: req.body.tags || req.body.dietaryTags || [],
      nutritionInfo: req.body.nutritionInfo || {},
      chefTips: req.body.chefTips || [],
      equipment: req.body.equipment || [],
      isPremium: req.body.isPremium || false,
      price: req.body.price || 0,
      originalPrice: req.body.originalPrice || 0,
      discount: req.body.discount || 0
    };

    const recipe = new Recipe(recipeData);
    await recipe.save();

    const populatedRecipe = await Recipe.findById(recipe._id)
      .populate('author', 'username avatar');

    res.status(201).json({
      message: 'Recipe created successfully',
      recipe: populatedRecipe
    });
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({ message: 'Server error during recipe creation' });
  }
});

// Update recipe (Admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user is the author (admin check already done by middleware)
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this recipe' });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username avatar');

    res.json({
      message: 'Recipe updated successfully',
      recipe: updatedRecipe
    });
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({ message: 'Server error during recipe update' });
  }
});

// Delete recipe (Admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user is the author (admin check already done by middleware)
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ message: 'Server error during recipe deletion' });
  }
});

// Rate recipe (Users only)
router.post('/:id/rate', auth, [
  body('rating').isInt({ min: 1, max: 5 }),
  body('review').optional().isLength({ max: 500 }).trim().escape()
], async (req, res) => {
  try {
    // Block admins from rating recipes
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Admins cannot rate recipes. Only users can provide reviews.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, review } = req.body;
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user already rated this recipe
    const existingRatingIndex = recipe.ratings.findIndex(
      r => r.user.toString() === req.user._id.toString()
    );

    if (existingRatingIndex > -1) {
      // Update existing rating
      recipe.ratings[existingRatingIndex] = {
        user: req.user._id,
        rating,
        review,
        createdAt: new Date()
      };
    } else {
      // Add new rating
      recipe.ratings.push({
        user: req.user._id,
        rating,
        review
      });
    }

    await recipe.save();

    const updatedRecipe = await Recipe.findById(req.params.id)
      .populate('ratings.user', 'username avatar');

    res.json({
      message: 'Rating added successfully',
      recipe: updatedRecipe
    });
  } catch (error) {
    console.error('Rate recipe error:', error);
    res.status(500).json({ message: 'Server error during rating' });
  }
});

// Toggle favorite
router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const isFavorited = user.favoriteRecipes.includes(recipe._id);

    if (isFavorited) {
      user.favoriteRecipes.pull(recipe._id);
      recipe.favorites -= 1;
    } else {
      user.favoriteRecipes.push(recipe._id);
      recipe.favorites += 1;
    }

    await Promise.all([user.save(), recipe.save()]);

    res.json({
      message: isFavorited ? 'Recipe removed from favorites' : 'Recipe added to favorites',
      isFavorited: !isFavorited
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;