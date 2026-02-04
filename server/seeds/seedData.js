const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Recipe = require('../models/Recipe');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recipe-platform');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Recipe.deleteMany({});
    console.log('Cleared existing data');

    // Create Admin User - FIXED PASSWORD HASHING
    const admin = new User({
      username: 'admin',
      email: 'admin@recipeplatform.com',
      password: 'admin123', // Will be hashed by pre-save middleware
      role: 'admin',
      bio: 'Platform Administrator',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    });
    await admin.save();
    console.log('✅ Admin user created - Email: admin@recipeplatform.com, Password: admin123');

    // Create Regular Users
    const users = [
      {
        username: 'foodlover',
        email: 'user@recipeplatform.com',
        password: 'user123', // Will be hashed by pre-save middleware
        role: 'user',
        bio: 'Love trying new recipes!',
        dietaryPreferences: ['vegetarian'],
        cuisinePreferences: ['Italian', 'Mediterranean'],
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      {
        username: 'homecook',
        email: 'homecook@recipeplatform.com',
        password: 'user123', // Will be hashed by pre-save middleware
        role: 'user',
        bio: 'Cooking enthusiast and food blogger',
        dietaryPreferences: ['gluten-free'],
        cuisinePreferences: ['American', 'Mexican'],
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('✅ Regular users created - Email: user@recipeplatform.com, Password: user123');

    // Sample Recipe Data with AUTHENTIC RECIPES AND HIGHER PRICES
    const sampleRecipes = [
      {
        title: 'Traditional Dal Bhat Tarkari',
        description: 'The quintessential meal with lentil soup, rice, and mixed vegetables. A complete nutritious meal that represents authentic home cooking.',
        ingredients: [
          { name: 'Basmati Rice', amount: '2', unit: 'cups', cost: 200 },
          { name: 'Masoor Dal (Red Lentils)', amount: '1', unit: 'cup', cost: 150 },
          { name: 'Cauliflower', amount: '1', unit: 'medium head', cost: 120 },
          { name: 'Potatoes', amount: '3', unit: 'medium', cost: 80 },
          { name: 'Green Beans', amount: '200', unit: 'grams', cost: 100 },
          { name: 'Onions', amount: '2', unit: 'medium', cost: 60 },
          { name: 'Tomatoes', amount: '2', unit: 'medium', cost: 80 },
          { name: 'Garlic', amount: '6', unit: 'cloves', cost: 40 },
          { name: 'Ginger', amount: '2', unit: 'inch piece', cost: 30 },
          { name: 'Turmeric Powder', amount: '1', unit: 'tsp', cost: 20 },
          { name: 'Cumin Seeds', amount: '1', unit: 'tsp', cost: 25 },
          { name: 'Mustard Oil', amount: '3', unit: 'tbsp', cost: 50 }
        ],
        instructions: [
          { step: 1, description: 'Wash and soak rice for 30 minutes. Cook dal with turmeric until soft and mushy.', duration: 25 },
          { step: 2, description: 'Heat mustard oil in a pan. Add cumin seeds and let them splutter.', duration: 2 },
          { step: 3, description: 'Add chopped onions, ginger-garlic paste. Sauté until golden brown.', duration: 8 },
          { step: 4, description: 'Add tomatoes and cook until they break down completely.', duration: 10 },
          { step: 5, description: 'Add all vegetables with salt and spices. Cook covered for 15-20 minutes.', duration: 20 },
          { step: 6, description: 'Cook rice separately until fluffy. Serve hot with dal and vegetables.', duration: 20 }
        ],
        images: [
          { 
            url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop',
            caption: 'Traditional Dal Bhat Tarkari - Complete meal with rice, lentils and vegetables'
          }
        ],
        cookingTime: 45,
        prepTime: 20,
        servings: 4,
        difficulty: 'medium',
        cuisine: 'Asian',
        category: 'lunch',
        dietaryTags: ['vegetarian', 'gluten-free'],
        nutritionInfo: {
          calories: 420,
          protein: 18,
          carbs: 65,
          fat: 12,
          fiber: 8,
          sugar: 6,
          sodium: 580
        },
        author: admin._id,
        isPremium: true,
        price: 1200,
        originalPrice: 1500,
        discount: 20,
        tags: ['dal-bhat', 'traditional', 'vegetarian', 'healthy'],
        chefTips: [
          'Use mustard oil for authentic flavor',
          'Cook dal until completely soft for best texture',
          'Adjust spice level according to preference'
        ],
        equipment: ['Pressure cooker', 'Heavy-bottomed pan', 'Rice cooker'],
        videoUrl: 'https://www.youtube.com/watch?v=traditional-dal-bhat'
      },
      {
        title: 'Authentic Chicken Momos',
        description: 'Steamed dumplings filled with spiced chicken, served with spicy tomato chutney. A beloved street food with tender filling.',
        ingredients: [
          { name: 'All-purpose Flour', amount: '2', unit: 'cups', cost: 100 },
          { name: 'Chicken Mince', amount: '500', unit: 'grams', cost: 600 },
          { name: 'Onions', amount: '2', unit: 'medium', cost: 60 },
          { name: 'Garlic', amount: '8', unit: 'cloves', cost: 50 },
          { name: 'Ginger', amount: '2', unit: 'inch piece', cost: 30 },
          { name: 'Green Chilies', amount: '3', unit: 'pieces', cost: 20 },
          { name: 'Coriander Leaves', amount: '1/2', unit: 'cup', cost: 40 },
          { name: 'Soy Sauce', amount: '2', unit: 'tbsp', cost: 60 },
          { name: 'Salt', amount: '1', unit: 'tsp', cost: 10 },
          { name: 'Black Pepper', amount: '1/2', unit: 'tsp', cost: 30 },
          { name: 'Oil', amount: '2', unit: 'tbsp', cost: 40 }
        ],
        instructions: [
          { step: 1, description: 'Make dough with flour, salt, and water. Knead until smooth and rest for 30 minutes.', duration: 35 },
          { step: 2, description: 'Mix chicken mince with finely chopped onions, garlic, ginger, and green chilies.', duration: 15 },
          { step: 3, description: 'Add soy sauce, salt, pepper, and coriander leaves to the chicken mixture.', duration: 5 },
          { step: 4, description: 'Roll small portions of dough into thin circles.', duration: 20 },
          { step: 5, description: 'Place filling in center, fold and seal edges to form momos.', duration: 25 },
          { step: 6, description: 'Steam for 15-20 minutes until cooked through. Serve hot with chutney.', duration: 20 }
        ],
        images: [
          { 
            url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&h=600&fit=crop',
            caption: 'Fresh steamed chicken momos with spicy chutney'
          }
        ],
        cookingTime: 25,
        prepTime: 60,
        servings: 6,
        difficulty: 'hard',
        cuisine: 'Asian',
        category: 'snack',
        dietaryTags: [],
        nutritionInfo: {
          calories: 280,
          protein: 22,
          carbs: 35,
          fat: 8,
          fiber: 2,
          sugar: 3,
          sodium: 650
        },
        author: admin._id,
        isPremium: true,
        price: 950,
        originalPrice: 1200,
        discount: 21,
        tags: ['momos', 'dumplings', 'chicken', 'street-food'],
        chefTips: [
          'Keep dough covered to prevent drying',
          'Don\'t overfill the momos',
          'Steam on high heat for best results'
        ],
        equipment: ['Steamer', 'Rolling pin', 'Large mixing bowl']
      },
      {
        title: 'Vegetable Chowmein',
        description: 'Stir-fried noodles with fresh vegetables and aromatic spices. A popular fusion dish perfect for any meal.',
        ingredients: [
          { name: 'Chowmein Noodles', amount: '400', unit: 'grams', cost: 120 },
          { name: 'Cabbage', amount: '2', unit: 'cups shredded', cost: 80 },
          { name: 'Carrots', amount: '2', unit: 'medium', cost: 60 },
          { name: 'Bell Peppers', amount: '2', unit: 'medium', cost: 100 },
          { name: 'Onions', amount: '2', unit: 'medium', cost: 60 },
          { name: 'Garlic', amount: '6', unit: 'cloves', cost: 40 },
          { name: 'Ginger', amount: '1', unit: 'inch piece', cost: 20 },
          { name: 'Soy Sauce', amount: '3', unit: 'tbsp', cost: 90 },
          { name: 'Tomato Ketchup', amount: '2', unit: 'tbsp', cost: 50 },
          { name: 'Oil', amount: '3', unit: 'tbsp', cost: 60 },
          { name: 'Green Onions', amount: '3', unit: 'stalks', cost: 40 }
        ],
        instructions: [
          { step: 1, description: 'Boil noodles according to package instructions. Drain and set aside.', duration: 8 },
          { step: 2, description: 'Heat oil in a large wok or pan over high heat.', duration: 2 },
          { step: 3, description: 'Add garlic and ginger, stir-fry for 30 seconds until fragrant.', duration: 1 },
          { step: 4, description: 'Add onions and cook for 2 minutes until slightly softened.', duration: 2 },
          { step: 5, description: 'Add all vegetables and stir-fry for 3-4 minutes until crisp-tender.', duration: 4 },
          { step: 6, description: 'Add noodles, soy sauce, and ketchup. Toss everything together for 2-3 minutes.', duration: 3 },
          { step: 7, description: 'Garnish with green onions and serve hot.', duration: 1 }
        ],
        images: [
          { 
            url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&h=600&fit=crop',
            caption: 'Colorful vegetable chowmein with fresh herbs'
          }
        ],
        cookingTime: 15,
        prepTime: 20,
        servings: 4,
        difficulty: 'easy',
        cuisine: 'Asian',
        category: 'dinner',
        dietaryTags: ['vegetarian'],
        nutritionInfo: {
          calories: 320,
          protein: 12,
          carbs: 55,
          fat: 8,
          fiber: 5,
          sugar: 8,
          sodium: 720
        },
        author: createdUsers[0]._id,
        isPremium: true,
        price: 750,
        originalPrice: 900,
        discount: 17,
        tags: ['chowmein', 'noodles', 'vegetarian', 'stir-fry'],
        chefTips: [
          'Keep vegetables crisp for better texture',
          'Use high heat for authentic wok flavor',
          'Don\'t overcook the noodles'
        ],
        equipment: ['Large wok or pan', 'Large pot for boiling']
      },
      {
        title: 'Premium Gourmet Pizza',
        description: 'Artisanal pizza with premium toppings and hand-stretched dough. A restaurant-quality meal featuring the finest ingredients.',
        ingredients: [
          { name: 'Premium Pizza Dough', amount: '1', unit: 'ball', cost: 150 },
          { name: 'San Marzano Tomatoes', amount: '1', unit: 'cup', cost: 200 },
          { name: 'Buffalo Mozzarella', amount: '200', unit: 'grams', cost: 400 },
          { name: 'Prosciutto', amount: '100', unit: 'grams', cost: 500 },
          { name: 'Arugula', amount: '50', unit: 'grams', cost: 80 },
          { name: 'Parmesan Cheese', amount: '50', unit: 'grams', cost: 150 },
          { name: 'Extra Virgin Olive Oil', amount: '2', unit: 'tbsp', cost: 100 },
          { name: 'Fresh Basil', amount: '10', unit: 'leaves', cost: 60 }
        ],
        instructions: [
          { step: 1, description: 'Preheat oven to 500°F with pizza stone inside for 1 hour.', duration: 60 },
          { step: 2, description: 'Hand-stretch dough to 12-inch circle, maintaining even thickness.', duration: 10 },
          { step: 3, description: 'Spread San Marzano tomatoes evenly, leaving border for crust.', duration: 3 },
          { step: 4, description: 'Add torn buffalo mozzarella pieces across the surface.', duration: 2 },
          { step: 5, description: 'Bake for 10-12 minutes until crust is golden and cheese bubbles.', duration: 12 },
          { step: 6, description: 'Top with prosciutto, arugula, parmesan, and drizzle with olive oil.', duration: 3 }
        ],
        images: [
          { 
            url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
            caption: 'Gourmet pizza with premium toppings and artisanal crust'
          }
        ],
        cookingTime: 12,
        prepTime: 20,
        servings: 2,
        difficulty: 'medium',
        cuisine: 'Italian',
        category: 'dinner',
        dietaryTags: [],
        nutritionInfo: {
          calories: 650,
          protein: 35,
          carbs: 45,
          fat: 35,
          fiber: 3,
          sugar: 5,
          sodium: 1200
        },
        author: admin._id,
        isPremium: true,
        price: 1800,
        originalPrice: 2200,
        discount: 18,
        tags: ['pizza', 'gourmet', 'premium', 'italian'],
        chefTips: [
          'Use a pizza stone for authentic crispy crust',
          'High-quality ingredients make all the difference',
          'Don\'t overload with toppings'
        ],
        equipment: ['Pizza stone', 'Pizza peel', 'Oven'],
        videoUrl: 'https://www.youtube.com/watch?v=gourmet-pizza'
      },
      {
        title: 'Wagyu Beef Steak',
        description: 'Premium Wagyu beef steak cooked to perfection with herb butter. An ultra-premium dining experience with the world\'s finest beef.',
        ingredients: [
          { name: 'Wagyu Beef Steak', amount: '300', unit: 'grams', cost: 2500 },
          { name: 'Sea Salt', amount: '1', unit: 'tsp', cost: 20 },
          { name: 'Black Pepper', amount: '1', unit: 'tsp', cost: 30 },
          { name: 'Butter', amount: '50', unit: 'grams', cost: 100 },
          { name: 'Fresh Thyme', amount: '3', unit: 'sprigs', cost: 50 },
          { name: 'Garlic', amount: '2', unit: 'cloves', cost: 20 },
          { name: 'Olive Oil', amount: '2', unit: 'tbsp', cost: 80 }
        ],
        instructions: [
          { step: 1, description: 'Bring steak to room temperature for 30 minutes before cooking.', duration: 30 },
          { step: 2, description: 'Season generously with sea salt and freshly cracked black pepper.', duration: 2 },
          { step: 3, description: 'Heat cast iron pan over high heat until smoking hot.', duration: 5 },
          { step: 4, description: 'Sear steak for 2-3 minutes per side for medium-rare.', duration: 6 },
          { step: 5, description: 'Add butter, thyme, and garlic. Baste steak with herb butter.', duration: 3 },
          { step: 6, description: 'Rest for 5 minutes before slicing. Serve immediately.', duration: 5 }
        ],
        images: [
          { 
            url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop',
            caption: 'Premium Wagyu beef steak with herb butter'
          }
        ],
        cookingTime: 10,
        prepTime: 35,
        servings: 1,
        difficulty: 'hard',
        cuisine: 'International',
        category: 'dinner',
        dietaryTags: ['gluten-free'],
        nutritionInfo: {
          calories: 850,
          protein: 55,
          carbs: 2,
          fat: 68,
          fiber: 0,
          sugar: 0,
          sodium: 450
        },
        author: admin._id,
        isPremium: true,
        price: 4500,
        originalPrice: 5500,
        discount: 18,
        tags: ['wagyu', 'premium', 'steak', 'luxury'],
        chefTips: [
          'Never press down on the steak while cooking',
          'Use a meat thermometer for perfect doneness',
          'Let the steak rest to redistribute juices'
        ],
        equipment: ['Cast iron pan', 'Meat thermometer', 'Tongs']
      },
      {
        title: 'Truffle Risotto',
        description: 'Luxurious risotto with black truffles and aged Parmesan. An elegant dish featuring premium ingredients and traditional Italian technique.',
        ingredients: [
          { name: 'Arborio Rice', amount: '300', unit: 'grams', cost: 200 },
          { name: 'Black Truffles', amount: '20', unit: 'grams', cost: 1500 },
          { name: 'Aged Parmesan', amount: '100', unit: 'grams', cost: 300 },
          { name: 'White Wine', amount: '150', unit: 'ml', cost: 200 },
          { name: 'Chicken Stock', amount: '1', unit: 'liter', cost: 150 },
          { name: 'Shallots', amount: '2', unit: 'medium', cost: 60 },
          { name: 'Butter', amount: '50', unit: 'grams', cost: 100 },
          { name: 'Olive Oil', amount: '2', unit: 'tbsp', cost: 80 }
        ],
        instructions: [
          { step: 1, description: 'Heat chicken stock in a separate pan and keep warm.', duration: 5 },
          { step: 2, description: 'Sauté finely chopped shallots in olive oil until translucent.', duration: 5 },
          { step: 3, description: 'Add Arborio rice and toast for 2 minutes until edges are translucent.', duration: 2 },
          { step: 4, description: 'Add white wine and stir until absorbed completely.', duration: 3 },
          { step: 5, description: 'Add warm stock one ladle at a time, stirring constantly for 18-20 minutes.', duration: 20 },
          { step: 6, description: 'Finish with butter, Parmesan, and shaved truffles. Serve immediately.', duration: 3 }
        ],
        images: [
          { 
            url: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&h=600&fit=crop',
            caption: 'Luxurious truffle risotto with aged Parmesan'
          }
        ],
        cookingTime: 25,
        prepTime: 15,
        servings: 4,
        difficulty: 'hard',
        cuisine: 'Italian',
        category: 'dinner',
        dietaryTags: ['vegetarian', 'gluten-free'],
        nutritionInfo: {
          calories: 520,
          protein: 18,
          carbs: 65,
          fat: 22,
          fiber: 2,
          sugar: 3,
          sodium: 680
        },
        author: admin._id,
        isPremium: true,
        price: 3200,
        originalPrice: 4000,
        discount: 20,
        tags: ['truffle', 'risotto', 'luxury', 'italian'],
        chefTips: [
          'Stir constantly for creamy texture',
          'Use warm stock to maintain temperature',
          'Shave truffles just before serving'
        ],
        equipment: ['Heavy-bottomed pan', 'Ladle', 'Truffle shaver']
      }
    ];

    const createdRecipes = await Recipe.insertMany(sampleRecipes);
    console.log(`✅ Created ${createdRecipes.length} premium recipes with high-quality images`);

    console.log('\n🎉 === PREMIUM RECIPE PLATFORM READY ===');
    console.log('\n🔐 Login Credentials:');
    console.log('👑 ADMIN: admin@recipeplatform.com / admin123');
    console.log('👤 USER: user@recipeplatform.com / user123');
    console.log('\n🌐 Access Points:');
    console.log('• Platform: http://localhost:3000');
    console.log('• Admin Dashboard: http://localhost:3000/admin');
    console.log('• Shopping Cart: http://localhost:3000/cart');
    console.log('\n🍽️ Featured Premium Recipes:');
    console.log('• Traditional Dal Bhat - Rs 1,200');
    console.log('• Chicken Momos - Rs 950');
    console.log('• Vegetable Chowmein - Rs 750');
    console.log('• Premium Gourmet Pizza - Rs 1,800');
    console.log('• Wagyu Beef Steak - Rs 4,500');
    console.log('• Truffle Risotto - Rs 3,200');
    console.log('\n💰 All prices are in Rupees (Rs)');
    console.log('✅ Database seeded successfully with premium recipes!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;