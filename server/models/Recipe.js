const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  ingredients: [{
    name: {
      type: String,
      required: true
    },
    amount: {
      type: String,
      required: true
    },
    unit: {
      type: String,
      required: true
    },
    cost: {
      type: Number,
      default: 0
    }
  }],
  instructions: [{
    step: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: String,
    duration: Number // in minutes
  }],
  images: [{
    url: String,
    publicId: String,
    caption: String
  }],
  cookingTime: {
    type: Number,
    required: true // in minutes
  },
  prepTime: {
    type: Number,
    required: true // in minutes
  },
  servings: {
    type: Number,
    required: true,
    min: 1
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  cuisine: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'appetizer', 'beverage'],
    required: true
  },
  dietaryTags: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'low-carb', 'mediterranean']
  }],
  nutritionInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    sugar: Number,
    sodium: Number
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  favorites: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    default: 0 // Price for premium recipes
  },
  originalPrice: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0,
    max: 100
  },
  tags: [String],
  videoUrl: String,
  estimatedCost: {
    type: Number,
    default: 0 // Estimated cost to make the recipe
  },
  chefTips: [String],
  equipment: [String],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  }
}, {
  timestamps: true
});

// Index for search functionality
recipeSchema.index({ 
  title: 'text', 
  description: 'text', 
  'ingredients.name': 'text',
  cuisine: 'text',
  tags: 'text'
});

// Index for filtering and sorting
recipeSchema.index({ cuisine: 1, category: 1, difficulty: 1 });
recipeSchema.index({ averageRating: -1, createdAt: -1 });
recipeSchema.index({ views: -1 });
recipeSchema.index({ price: 1, isPremium: 1 });

// Calculate average rating before saving
recipeSchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    this.averageRating = sum / this.ratings.length;
    this.totalRatings = this.ratings.length;
  }
  
  // Calculate estimated cost from ingredients
  if (this.ingredients.length > 0) {
    this.estimatedCost = this.ingredients.reduce((total, ingredient) => {
      return total + (ingredient.cost || 0);
    }, 0);
  }
  
  next();
});

// Virtual for final price after discount
recipeSchema.virtual('finalPrice').get(function() {
  if (this.discount > 0) {
    return this.price * (1 - this.discount / 100);
  }
  return this.price;
});

// Virtual for total cooking time
recipeSchema.virtual('totalTime').get(function() {
  return this.prepTime + this.cookingTime;
});

module.exports = mongoose.model('Recipe', recipeSchema);