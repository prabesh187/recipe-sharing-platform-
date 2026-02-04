const express = require('express');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Collaborative Filtering Algorithm
class RecommendationEngine {
  // Calculate similarity between two users based on their ratings
  static calculateUserSimilarity(user1Ratings, user2Ratings) {
    const commonRecipes = [];
    const user1Map = new Map(user1Ratings.map(r => [r.recipe.toString(), r.rating]));
    
    user2Ratings.forEach(rating => {
      if (user1Map.has(rating.recipe.toString())) {
        commonRecipes.push({
          user1Rating: user1Map.get(rating.recipe.toString()),
          user2Rating: rating.rating
        });
      }
    });

    if (commonRecipes.length === 0) return 0;

    // Pearson correlation coefficient
    const n = commonRecipes.length;
    const sum1 = commonRecipes.reduce((sum, item) => sum + item.user1Rating, 0);
    const sum2 = commonRecipes.reduce((sum, item) => sum + item.user2Rating, 0);
    
    const sum1Sq = commonRecipes.reduce((sum, item) => sum + Math.pow(item.user1Rating, 2), 0);
    const sum2Sq = commonRecipes.reduce((sum, item) => sum + Math.pow(item.user2Rating, 2), 0);
    
    const pSum = commonRecipes.reduce((sum, item) => sum + item.user1Rating * item.user2Rating, 0);
    
    const num = pSum - (sum1 * sum2 / n);
    const den = Math.sqrt((sum1Sq - Math.pow(sum1, 2) / n) * (sum2Sq - Math.pow(sum2, 2) / n));
    
    return den === 0 ? 0 : num / den;
  }

  // Content-based filtering using recipe features
  static calculateRecipeSimilarity(recipe1, recipe2) {
    let similarity = 0;
    
    // Cuisine similarity (40% weight)
    if (recipe1.cuisine === recipe2.cuisine) similarity += 0.4;
    
    // Category similarity (20% weight)
    if (recipe1.category === recipe2.category) similarity += 0.2;
    
    // Difficulty similarity (10% weight)
    if (recipe1.difficulty === recipe2.difficulty) similarity += 0.1;
    
    // Dietary tags similarity (20% weight)
    const commonTags = recipe1.dietaryTags.filter(tag => recipe2.dietaryTags.includes(tag));
    similarity += (commonTags.length / Math.max(recipe1.dietaryTags.length, recipe2.dietaryTags.length, 1)) * 0.2;
    
    // Cooking time similarity (10% weight)
    const timeDiff = Math.abs(recipe1.cookingTime - recipe2.cookingTime);
    const timeScore = Math.max(0, 1 - timeDiff / 120); // Normalize by 2 hours
    similarity += timeScore * 0.1;
    
    return similarity;
  }

  // Hybrid recommendation combining collaborative and content-based filtering
  static async getRecommendations(userId, limit = 10) {
    try {
      const user = await User.findById(userId);
      if (!user) return [];

      // Get user's rated recipes
      const userRatedRecipes = await Recipe.find({
        'ratings.user': userId
      }).select('_id ratings');

      const userRatings = userRatedRecipes.map(recipe => ({
        recipe: recipe._id,
        rating: recipe.ratings.find(r => r.user.toString() === userId.toString()).rating
      }));

      // Get all recipes for content-based filtering
      const allRecipes = await Recipe.find({ isPublished: true })
        .populate('author', 'username avatar')
        .lean();

      const recommendations = new Map();

      // Content-based recommendations
      if (userRatings.length > 0) {
        const highRatedRecipes = userRatings.filter(r => r.rating >= 4);
        
        for (const userRating of highRatedRecipes) {
          const baseRecipe = allRecipes.find(r => r._id.toString() === userRating.recipe.toString());
          if (!baseRecipe) continue;

          for (const recipe of allRecipes) {
            if (recipe._id.toString() === userRating.recipe.toString()) continue;
            if (userRatings.some(ur => ur.recipe.toString() === recipe._id.toString())) continue;

            const similarity = this.calculateRecipeSimilarity(baseRecipe, recipe);
            const score = similarity * userRating.rating;

            if (recommendations.has(recipe._id.toString())) {
              recommendations.set(recipe._id.toString(), {
                ...recommendations.get(recipe._id.toString()),
                score: recommendations.get(recipe._id.toString()).score + score
              });
            } else {
              recommendations.set(recipe._id.toString(), {
                recipe,
                score,
                reason: 'Similar to recipes you liked'
              });
            }
          }
        }
      }

      // Add popular recipes for new users or as fallback
      const popularRecipes = allRecipes
        .filter(recipe => !userRatings.some(ur => ur.recipe.toString() === recipe._id.toString()))
        .sort((a, b) => (b.averageRating * b.totalRatings) - (a.averageRating * a.totalRatings))
        .slice(0, 5);

      popularRecipes.forEach(recipe => {
        if (!recommendations.has(recipe._id.toString())) {
          recommendations.set(recipe._id.toString(), {
            recipe,
            score: recipe.averageRating * 0.5,
            reason: 'Popular recipe'
          });
        }
      });

      // Add personalized recommendations based on user preferences
      if (user.dietaryPreferences.length > 0 || user.cuisinePreferences.length > 0) {
        const personalizedRecipes = allRecipes.filter(recipe => {
          const matchesDietary = user.dietaryPreferences.length === 0 || 
            user.dietaryPreferences.some(pref => recipe.dietaryTags.includes(pref));
          const matchesCuisine = user.cuisinePreferences.length === 0 || 
            user.cuisinePreferences.includes(recipe.cuisine);
          
          return matchesDietary && matchesCuisine && 
            !userRatings.some(ur => ur.recipe.toString() === recipe._id.toString());
        });

        personalizedRecipes.forEach(recipe => {
          if (!recommendations.has(recipe._id.toString())) {
            recommendations.set(recipe._id.toString(), {
              recipe,
              score: recipe.averageRating * 0.7,
              reason: 'Matches your preferences'
            });
          }
        });
      }

      // Sort by score and return top recommendations
      return Array.from(recommendations.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    } catch (error) {
      console.error('Recommendation error:', error);
      return [];
    }
  }
}

// Get personalized recommendations
router.get('/for-you', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const recommendations = await RecommendationEngine.getRecommendations(req.user._id, limit);
    
    res.json({
      recommendations: recommendations.map(rec => ({
        recipe: rec.recipe,
        score: rec.score,
        reason: rec.reason
      }))
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trending recipes
router.get('/trending', optionalAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const timeframe = req.query.timeframe || '7d'; // 1d, 7d, 30d
    
    let dateFilter = new Date();
    switch (timeframe) {
      case '1d':
        dateFilter.setDate(dateFilter.getDate() - 1);
        break;
      case '7d':
        dateFilter.setDate(dateFilter.getDate() - 7);
        break;
      case '30d':
        dateFilter.setDate(dateFilter.getDate() - 30);
        break;
    }

    const trendingRecipes = await Recipe.aggregate([
      {
        $match: {
          isPublished: true,
          createdAt: { $gte: dateFilter }
        }
      },
      {
        $addFields: {
          trendingScore: {
            $add: [
              { $multiply: ['$views', 0.3] },
              { $multiply: ['$favorites', 0.4] },
              { $multiply: ['$totalRatings', 0.3] }
            ]
          }
        }
      },
      {
        $sort: { trendingScore: -1 }
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
          pipeline: [{ $project: { username: 1, avatar: 1 } }]
        }
      },
      {
        $unwind: '$author'
      }
    ]);

    res.json({ recipes: trendingRecipes });
  } catch (error) {
    console.error('Get trending recipes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get similar recipes
router.get('/similar/:recipeId', optionalAuth, async (req, res) => {
  try {
    const { recipeId } = req.params;
    const limit = parseInt(req.query.limit) || 5;

    const baseRecipe = await Recipe.findById(recipeId);
    if (!baseRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const allRecipes = await Recipe.find({
      _id: { $ne: recipeId },
      isPublished: true
    }).populate('author', 'username avatar').lean();

    const similarRecipes = allRecipes
      .map(recipe => ({
        recipe,
        similarity: RecommendationEngine.calculateRecipeSimilarity(baseRecipe, recipe)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => item.recipe);

    res.json({ recipes: similarRecipes });
  } catch (error) {
    console.error('Get similar recipes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;