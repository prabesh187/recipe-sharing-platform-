# 🍳 Recipe Sharing Platform

A comprehensive full-stack recipe sharing platform built with React.js, Node.js, Express, and MongoDB. Features a complete admin system, user authentication, premium recipes, shopping cart, and order management with comprehensive billing.

## ✨ Features

### 🔐 User Authentication & Roles
- **User Registration & Login** with JWT authentication
- **Two-role system**: Admin and User
- **Protected routes** with role-based access control
- **Admin dashboard** with comprehensive management tools

### 👨‍🍳 Recipe Management
- **Create, edit, and delete recipes** (Admin only)
- **Premium recipe system** with pricing in Nepali Rupees (Rs)
- **Recipe categories**: Appetizers, Main Course, Desserts, Beverages
- **Difficulty levels**: Easy, Medium, Hard
- **Cooking time and servings** information
- **High-quality recipe images** with proper matching
- **Recipe ratings and reviews** (Users only)

### 🛒 E-commerce Features
- **Shopping cart** with quantity management
- **Professional checkout system** with comprehensive billing
- **Multiple payment methods**: Card, Cash on Delivery, Bank Transfer
- **Order management** with status tracking
- **Invoice generation** with automatic numbering
- **Tax calculation** (8%) and delivery fees

### 👑 Comprehensive Admin System
- **Real-time dashboard** with analytics and statistics
- **Order approval workflow** - Admin must approve all orders
- **User management** with detailed analytics
- **Revenue tracking** in Nepali Rupees
- **Order status management** (Pending → Confirmed → Preparing → Delivered)
- **Activity monitoring** with real-time feeds
- **Business intelligence** with comprehensive reporting

### 🎨 Modern UI/UX
- **Responsive design** for all devices
- **Professional gradient styling** with modern aesthetics
- **Smooth animations** with Framer Motion
- **Styled Components** for consistent theming
- **Loading states** and error handling
- **Toast notifications** for user feedback

## 🚀 Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/recipe-sharing-platform.git
cd recipe-sharing-platform
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Setup
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/recipe-platform
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

### 4. Database Setup
```bash
# Start MongoDB service
# Then seed the database with sample data
cd server
node seeds/seedData.js
```

### 5. Run the application
```bash
# From the root directory
npm run dev
```

## 👥 Default Users

After seeding the database, you can login with:

### Admin Account
- **Email**: admin@recipeplatform.com
- **Password**: admin123
- **Role**: Admin (can create recipes, manage users, approve orders)

### User Account
- **Email**: user@example.com
- **Password**: user123
- **Role**: User (can shop, rate recipes, place orders)

## 🎯 Usage Guide

### For Users
1. **Register/Login** to access the platform
2. **Browse recipes** on the home page
3. **Add premium recipes** to cart
4. **Proceed to checkout** with comprehensive billing
5. **Wait for admin approval** of your order
6. **Rate and review** delivered orders

### For Admins
1. **Login** and get redirected to admin dashboard
2. **Create new recipes** with pricing and images
3. **Manage users** and view their analytics
4. **Approve/reject orders** from users
5. **Update order status** throughout fulfillment
6. **Monitor platform** with real-time analytics

## 📊 Key Features Breakdown

### Order Management System
- **Comprehensive billing** with customer details
- **Admin approval workflow** for all orders
- **Status tracking** with history
- **Invoice generation** with automatic numbering
- **Payment method** support and tracking

### Admin Analytics
- **Revenue tracking** in Nepali Rupees
- **User growth** and activity monitoring
- **Order statistics** by status and time period
- **Recipe performance** analytics
- **Payment method** distribution
- **Top customers** by spending

### Business Features
- **Pricing in Nepali Rupees** (Rs 750 - Rs 4,500)
- **Tax calculation** (8% on all orders)
- **Delivery fees** (Rs 300, free over Rs 5,000)
- **Coupon system** support
- **Professional invoicing**

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Recipes
- `GET /api/recipes` - Get all recipes
- `POST /api/recipes` - Create recipe (Admin only)
- `PUT /api/recipes/:id` - Update recipe (Admin only)
- `DELETE /api/recipes/:id` - Delete recipe (Admin only)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/payment` - Update payment status

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - User management
- `GET /api/admin/orders` - Order management
- `PUT /api/admin/orders/:id/approve` - Approve/reject orders

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:id` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove cart item<br>


###Images<br>
1.Login Page<br>
<img width="1900" height="922" alt="image" src="https://github.com/user-attachments/assets/ef5e30e8-b8ed-4b41-a737-e1f01284a309" /><br>
<img width="1909" height="900" alt="image" src="https://github.com/user-attachments/assets/3ab16947-87f0-4562-a8f7-4c07931a5d67" /><br>
<img width="526" height="722" alt="image" src="https://github.com/user-attachments/assets/ade6c28c-be52-41be-a01d-1860275204cf" /><br>
<img width="1644" height="842" alt="image" src="https://github.com/user-attachments/assets/6fc1fbef-345d-4bfc-8abc-f0e425898680" /><br>
<img width="1091" height="879" alt="image" src="https://github.com/user-attachments/assets/e3b06f18-4913-400f-ae52-6fe047922d29" /><br>
<img width="1906" height="909" alt="image" src="https://github.com/user-attachments/assets/e9987968-015e-49a7-8e74-4825a6519c10" /><br>
<img width="1834" height="913" alt="image" src="https://github.com/user-attachments/assets/78975c23-7290-4729-bf21-9d63da5b9220" /><br>
<img width="1756" height="902" alt="image" src="https://github.com/user-attachments/assets/accc67dd-f077-4661-9e45-dc6cd4d204ec" />














---

⭐ **Star this repository if you found it helpful!**

**Happy Cooking! 🍳👨‍🍳👩‍🍳**
