const express = require('express');
const { auth } = require('../middleware/auth');
const Cart = require('../models/Cart');
const Recipe = require('../models/Recipe');

const router = express.Router();

// Middleware to ensure only users (not admins) can access cart
const userOnly = (req, res, next) => {
  if (req.user.role === 'admin') {
    return res.status(403).json({ message: 'Admins cannot use shopping cart. Cart is for users only.' });
  }
  next();
};

// All cart routes require authentication and user role
router.use(auth);
router.use(userOnly);

// Get user's cart
router.get('/', async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.recipe',
        select: 'title images price finalPrice isPremium author cuisine difficulty cookingTime',
        populate: {
          path: 'author',
          select: 'username'
        }
      });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add item to cart
router.post('/add', async (req, res) => {
  try {
    const { recipeId, quantity = 1, servings = 1 } = req.body;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (!recipe.isPremium && recipe.price === 0) {
      return res.status(400).json({ message: 'This recipe is free and cannot be added to cart' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.recipe.toString() === recipeId
    );

    const itemPrice = recipe.finalPrice || recipe.price;

    if (existingItemIndex > -1) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].servings = servings;
      cart.items[existingItemIndex].price = itemPrice;
    } else {
      // Add new item
      cart.items.push({
        recipe: recipeId,
        quantity,
        servings,
        price: itemPrice
      });
    }

    await cart.save();
    
    // Populate the cart before sending response
    await cart.populate({
      path: 'items.recipe',
      select: 'title images price finalPrice isPremium author cuisine difficulty cookingTime',
      populate: {
        path: 'author',
        select: 'username'
      }
    });

    res.json({ message: 'Item added to cart', cart });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update cart item
router.put('/update/:itemId', async (req, res) => {
  try {
    const { quantity, servings } = req.body;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity !== undefined) item.quantity = quantity;
    if (servings !== undefined) item.servings = servings;

    await cart.save();
    
    await cart.populate({
      path: 'items.recipe',
      select: 'title images price finalPrice isPremium author cuisine difficulty cookingTime',
      populate: {
        path: 'author',
        select: 'username'
      }
    });

    res.json({ message: 'Cart updated', cart });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items.pull(itemId);
    await cart.save();

    await cart.populate({
      path: 'items.recipe',
      select: 'title images price finalPrice isPremium author cuisine difficulty cookingTime',
      populate: {
        path: 'author',
        select: 'username'
      }
    });

    res.json({ message: 'Item removed from cart', cart });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear cart
router.delete('/clear', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json({ message: 'Cart cleared', cart });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;