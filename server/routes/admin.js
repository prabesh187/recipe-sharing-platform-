const express = require('express');
const { auth } = require('../middleware/auth');
const { adminAuth } = require('../middleware/admin');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Order = require('../models/Order');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(auth);
router.use(adminAuth);

// Enhanced Dashboard stats with real-time data
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      totalRecipes,
      totalOrders,
      totalRevenue,
      pendingOrders,
      recentOrders,
      topRecipes,
      recentReviews,
      monthlyStats,
      pendingApprovals
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      Recipe.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.countDocuments({ 'adminApproval.status': 'pending' }),
      Order.find()
        .populate('user', 'username email avatar')
        .populate('items.recipe', 'title images')
        .sort({ createdAt: -1 })
        .limit(10),
      Recipe.find()
        .populate('author', 'username')
        .sort({ views: -1, averageRating: -1 })
        .limit(10),
      Recipe.aggregate([
        { $unwind: '$ratings' },
        { $sort: { 'ratings.createdAt': -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'users',
            localField: 'ratings.user',
            foreignField: '_id',
            as: 'reviewer'
          }
        },
        {
          $project: {
            title: 1,
            'ratings.rating': 1,
            'ratings.review': 1,
            'ratings.createdAt': 1,
            'reviewer.username': 1,
            'reviewer.avatar': 1
          }
        }
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            orders: { $sum: 1 },
            revenue: { $sum: '$total' }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Order.countDocuments({ 'adminApproval.status': 'pending' })
    ]);

    res.json({
      stats: {
        totalUsers,
        totalRecipes,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingOrders,
        pendingApprovals
      },
      recentOrders,
      topRecipes,
      recentReviews,
      monthlyStats
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Enhanced User management with detailed analytics
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, sortBy = 'createdAt' } = req.query;
    
    const query = { role: { $ne: 'admin' } };
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.role = role;

    const users = await User.find(query)
      .select('-password')
      .sort({ [sortBy]: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Add comprehensive user analytics
    const usersWithAnalytics = await Promise.all(
      users.map(async (user) => {
        const [orderCount, totalSpent, avgOrderValue, lastOrderDate, reviewCount] = await Promise.all([
          Order.countDocuments({ user: user._id }),
          Order.aggregate([
            { $match: { user: user._id, paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$total' } } }
          ]),
          Order.aggregate([
            { $match: { user: user._id, paymentStatus: 'paid' } },
            { $group: { _id: null, avg: { $avg: '$total' } } }
          ]),
          Order.findOne({ user: user._id }).sort({ createdAt: -1 }).select('createdAt'),
          Recipe.aggregate([
            { $unwind: '$ratings' },
            { $match: { 'ratings.user': user._id } },
            { $count: 'total' }
          ])
        ]);

        return {
          ...user.toObject(),
          analytics: {
            orderCount,
            totalSpent: totalSpent[0]?.total || 0,
            avgOrderValue: avgOrderValue[0]?.avg || 0,
            lastOrderDate: lastOrderDate?.createdAt,
            reviewCount: reviewCount[0]?.total || 0
          }
        };
      })
    );

    const total = await User.countDocuments(query);

    res.json({
      users: usersWithAnalytics,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user status
router.put('/users/:id/status', async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User status updated', user });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Enhanced Recipe management with reviews and analytics
router.get('/recipes', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, sortBy = 'createdAt' } = req.query;
    
    const query = {};
    if (search) {
      query.$text = { $search: search };
    }
    if (status) query.status = status;

    const recipes = await Recipe.find(query)
      .populate('author', 'username email')
      .sort({ [sortBy]: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Add analytics for each recipe
    const recipesWithAnalytics = await Promise.all(
      recipes.map(async (recipe) => {
        const [orderCount, revenue, recentReviews] = await Promise.all([
          Order.aggregate([
            { $unwind: '$items' },
            { $match: { 'items.recipe': recipe._id } },
            { $group: { _id: null, total: { $sum: '$items.quantity' } } }
          ]),
          Order.aggregate([
            { $unwind: '$items' },
            { $match: { 'items.recipe': recipe._id, paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } }
          ]),
          Recipe.findById(recipe._id)
            .select('ratings')
            .populate('ratings.user', 'username avatar')
            .then(r => r.ratings.slice(-5))
        ]);

        return {
          ...recipe.toObject(),
          analytics: {
            orderCount: orderCount[0]?.total || 0,
            revenue: revenue[0]?.total || 0,
            recentReviews
          }
        };
      })
    );

    const total = await Recipe.countDocuments(query);

    res.json({
      recipes: recipesWithAnalytics,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get admin recipes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update recipe status
router.put('/recipes/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('author', 'username');

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json({ message: 'Recipe status updated', recipe });
  } catch (error) {
    console.error('Update recipe status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Enhanced Order management with approval system
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search, approvalStatus } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (search) query.orderNumber = { $regex: search, $options: 'i' };
    if (approvalStatus) query['adminApproval.status'] = approvalStatus;

    const orders = await Order.find(query)
      .populate('user', 'username email phone avatar')
      .populate('items.recipe', 'title images price')
      .populate('adminApproval.approvedBy', 'username')
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
    console.error('Get admin orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Order approval system
router.put('/orders/:id/approve', async (req, res) => {
  try {
    const { action, notes, rejectionReason } = req.body; // action: 'approve' or 'reject'
    
    const updateData = {
      'adminApproval.status': action === 'approve' ? 'approved' : 'rejected',
      'adminApproval.approvedBy': req.user._id,
      'adminApproval.approvedAt': new Date(),
      'adminApproval.adminNotes': notes
    };

    if (action === 'reject') {
      updateData['adminApproval.rejectionReason'] = rejectionReason;
      updateData.status = 'cancelled';
    } else {
      updateData.status = 'confirmed';
    }

    // Add to status history
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.statusHistory.push({
      status: action === 'approve' ? 'approved' : 'rejected',
      changedBy: req.user._id,
      notes: notes || rejectionReason
    });

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        ...updateData,
        statusHistory: order.statusHistory
      },
      { new: true }
    )
    .populate('user', 'username email')
    .populate('adminApproval.approvedBy', 'username');

    res.json({ 
      message: `Order ${action}d successfully`, 
      order: updatedOrder 
    });
  } catch (error) {
    console.error('Order approval error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Add to status history
    order.statusHistory.push({
      status,
      changedBy: req.user._id,
      notes
    });

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        statusHistory: order.statusHistory
      },
      { new: true }
    ).populate('user', 'username email');

    res.json({ message: 'Order status updated', order: updatedOrder });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate invoice for order
router.post('/orders/:id/invoice', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'username email')
      .populate('items.recipe', 'title price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update invoice status
    order.invoice.isPaid = order.paymentStatus === 'paid';
    await order.save();

    res.json({ 
      message: 'Invoice generated successfully', 
      invoice: order.invoice,
      order 
    });
  } catch (error) {
    console.error('Generate invoice error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Comprehensive Analytics
router.get('/analytics', async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFilter = new Date();
    switch (period) {
      case '7d':
        dateFilter.setDate(dateFilter.getDate() - 7);
        break;
      case '30d':
        dateFilter.setDate(dateFilter.getDate() - 30);
        break;
      case '90d':
        dateFilter.setDate(dateFilter.getDate() - 90);
        break;
      case '1y':
        dateFilter.setFullYear(dateFilter.getFullYear() - 1);
        break;
      default:
        dateFilter.setDate(dateFilter.getDate() - 30);
    }

    const [
      userGrowth,
      orderStats,
      revenueStats,
      topCuisines,
      paymentMethods,
      orderApprovalStats,
      topCustomers,
      recipePerformance
    ] = await Promise.all([
      User.aggregate([
        { $match: { createdAt: { $gte: dateFilter }, role: { $ne: 'admin' } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: dateFilter } } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      Order.aggregate([
        { 
          $match: { 
            createdAt: { $gte: dateFilter },
            paymentStatus: 'paid'
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: { $sum: '$total' },
            orders: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Recipe.aggregate([
        {
          $group: {
            _id: '$cuisine',
            count: { $sum: 1 },
            avgRating: { $avg: '$averageRating' },
            totalViews: { $sum: '$views' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: dateFilter } } },
        {
          $group: {
            _id: '$paymentMethod',
            count: { $sum: 1 },
            revenue: { $sum: '$total' }
          }
        },
        { $sort: { count: -1 } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: dateFilter } } },
        {
          $group: {
            _id: '$adminApproval.status',
            count: { $sum: 1 }
          }
        }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: dateFilter }, paymentStatus: 'paid' } },
        {
          $group: {
            _id: '$user',
            totalSpent: { $sum: '$total' },
            orderCount: { $sum: 1 }
          }
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        }
      ]),
      Recipe.aggregate([
        {
          $lookup: {
            from: 'orders',
            let: { recipeId: '$_id' },
            pipeline: [
              { $unwind: '$items' },
              { $match: { $expr: { $eq: ['$items.recipe', '$$recipeId'] } } },
              { $group: { _id: null, totalOrders: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } }
            ],
            as: 'orderStats'
          }
        },
        {
          $project: {
            title: 1,
            averageRating: 1,
            totalRatings: 1,
            views: 1,
            totalOrders: { $ifNull: [{ $arrayElemAt: ['$orderStats.totalOrders', 0] }, 0] },
            revenue: { $ifNull: [{ $arrayElemAt: ['$orderStats.revenue', 0] }, 0] }
          }
        },
        { $sort: { revenue: -1 } },
        { $limit: 10 }
      ])
    ]);

    res.json({
      userGrowth,
      orderStats,
      revenueStats,
      topCuisines,
      paymentMethods,
      orderApprovalStats,
      topCustomers,
      recipePerformance
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Real-time activity feed
router.get('/activity', async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const [recentOrders, recentUsers, recentReviews] = await Promise.all([
      Order.find()
        .populate('user', 'username avatar')
        .sort({ createdAt: -1 })
        .limit(20)
        .select('orderNumber total status createdAt user'),
      User.find({ role: { $ne: 'admin' } })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('username avatar createdAt'),
      Recipe.aggregate([
        { $unwind: '$ratings' },
        { $sort: { 'ratings.createdAt': -1 } },
        { $limit: 15 },
        {
          $lookup: {
            from: 'users',
            localField: 'ratings.user',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $project: {
            title: 1,
            'ratings.rating': 1,
            'ratings.review': 1,
            'ratings.createdAt': 1,
            'user.username': 1,
            'user.avatar': 1
          }
        }
      ])
    ]);

    // Combine and sort all activities
    const activities = [
      ...recentOrders.map(order => ({
        type: 'order',
        data: order,
        timestamp: order.createdAt
      })),
      ...recentUsers.map(user => ({
        type: 'user_registration',
        data: user,
        timestamp: user.createdAt
      })),
      ...recentReviews.map(review => ({
        type: 'review',
        data: review,
        timestamp: review.ratings.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);

    res.json({ activities });
  } catch (error) {
    console.error('Activity feed error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;