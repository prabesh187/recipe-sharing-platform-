const express = require('express');
const { auth } = require('../middleware/auth');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Recipe = require('../models/Recipe');

const router = express.Router();

// Middleware to ensure only users (not admins) can place orders
const userOnly = (req, res, next) => {
  if (req.user.role === 'admin') {
    return res.status(403).json({ message: 'Admins cannot place orders. Orders are for users only.' });
  }
  next();
};

// All order routes require authentication and user role
router.use(auth);
router.use(userOnly);

// Get user's orders
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { user: req.user._id };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate({
        path: 'items.recipe',
        select: 'title images cuisine difficulty cookingTime'
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate({
      path: 'items.recipe',
      select: 'title images cuisine difficulty cookingTime author',
      populate: {
        path: 'author',
        select: 'username'
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create order from cart with comprehensive billing
router.post('/', async (req, res) => {
  try {
    const {
      billingDetails,
      deliveryAddress,
      paymentMethod,
      couponCode,
      notes
    } = req.body;

    // Validate required billing details
    if (!billingDetails || !billingDetails.fullName || !billingDetails.email || !billingDetails.phone) {
      return res.status(400).json({ message: 'Billing details are required' });
    }

    if (!billingDetails.address || !billingDetails.address.street || !billingDetails.address.city) {
      return res.status(400).json({ message: 'Complete billing address is required' });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.recipe');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate totals
    const subtotal = cart.subtotal;
    const tax = subtotal * 0.08; // 8% tax
    const deliveryFee = subtotal > 5000 ? 0 : 300; // Free delivery over Rs 5000
    let discount = 0;

    // Apply coupon if provided
    if (couponCode) {
      const coupons = {
        'WELCOME10': 0.10,
        'SAVE20': 0.20,
        'FIRST50': 0.50
      };
      
      if (coupons[couponCode]) {
        discount = subtotal * coupons[couponCode];
      }
    }

    const total = subtotal + tax + deliveryFee - discount;

    // Create order with comprehensive billing system
    const order = new Order({
      user: req.user._id,
      items: cart.items.map(item => ({
        recipe: item.recipe._id,
        quantity: item.quantity,
        price: item.price,
        servings: item.servings
      })),
      subtotal,
      tax,
      deliveryFee,
      discount,
      total,
      paymentMethod,
      billingDetails: {
        fullName: billingDetails.fullName,
        email: billingDetails.email,
        phone: billingDetails.phone,
        address: {
          street: billingDetails.address.street,
          city: billingDetails.address.city,
          state: billingDetails.address.state,
          zipCode: billingDetails.address.zipCode,
          country: billingDetails.address.country || 'Nepal'
        },
        company: billingDetails.company,
        taxId: billingDetails.taxId
      },
      deliveryAddress: deliveryAddress || billingDetails.address,
      couponCode,
      notes,
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
      // Initialize admin approval as pending
      adminApproval: {
        status: 'pending'
      },
      // Add initial status to history
      statusHistory: [{
        status: 'pending',
        changedBy: req.user._id,
        notes: 'Order placed by customer'
      }]
    });

    await order.save();

    // Clear cart after successful order
    cart.items = [];
    await cart.save();

    // Populate order before sending response
    await order.populate([
      {
        path: 'items.recipe',
        select: 'title images cuisine difficulty cookingTime author',
        populate: {
          path: 'author',
          select: 'username'
        }
      },
      {
        path: 'user',
        select: 'username email'
      }
    ]);

    res.status(201).json({
      message: 'Order placed successfully! Waiting for admin approval.',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order payment status (for payment processing)
router.put('/:id/payment', async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = paymentStatus;
    
    // If payment is successful, confirm the order
    if (paymentStatus === 'paid' && order.status === 'pending') {
      order.status = 'confirmed';
    }

    await order.save();

    res.json({ message: 'Payment status updated', order });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel order
router.put('/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({ message: 'Cannot cancel delivered order' });
    }

    if (order.status === 'preparing') {
      return res.status(400).json({ message: 'Cannot cancel order that is being prepared' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rate order
router.post('/:id/rate', async (req, res) => {
  try {
    const { rating, review } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ message: 'Can only rate delivered orders' });
    }

    order.rating = rating;
    order.review = review;
    await order.save();

    res.json({ message: 'Order rated successfully', order });
  } catch (error) {
    console.error('Rate order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;