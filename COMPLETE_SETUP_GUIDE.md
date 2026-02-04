# 🚀 Complete Setup Guide - Recipe Platform

## 📋 **What You'll Get**

A complete recipe sharing platform with:
- ✅ **Proper Login System** - No auto-login, users must sign in
- ✅ **User Registration** - Users can create their own accounts
- ✅ **Admin Dashboard** - Admin can see all user details and orders
- ✅ **Separate Experiences** - Admin and users have different interfaces

## 🔧 **Step-by-Step Setup**

### **1. Start the Platform**
```bash
npm run dev
```

### **2. Seed the Database (Create Admin Account)**
```bash
cd server
npm run seed
```

### **3. Open Browser**
```
http://localhost:3000
```

## 🎯 **How It Works**

### **🏠 Homepage (Not Logged In)**
- Shows "Discover Amazing Recipes" 
- Has "Login" and "Sign Up" buttons
- Users must login to access features

### **👤 User Registration**
1. Click **"Sign Up"** button
2. Fill in:
   - Username
   - Email  
   - Password
3. Click **"Create Account"**
4. Automatically logged in as **user**

### **👑 Admin Login**
1. Click **"Login"** button
2. Use admin credentials:
   - **Email**: `admin@recipeplatform.com`
   - **Password**: `admin123`
3. Click **"Sign In"**
4. Automatically logged in as **admin**

## 🔐 **Login Credentials**

### **Admin Account (Pre-created)**
- **Email**: `admin@recipeplatform.com`
- **Password**: `admin123`
- **Role**: Admin

### **User Accounts (Users Create Their Own)**
- Users register with their own email/password
- **Role**: User (automatic)
- Can shop, rate, and order recipes

## 👑 **Admin Features**

When admin logs in, they see:

### **Different Homepage**
- "👑 Admin Dashboard" hero section
- "Create Recipe" and "Admin Dashboard" buttons
- Management-focused content

### **Admin Dashboard** (`/admin`)
- **Overview Tab**: Recent orders and top recipes
- **Users Tab**: All registered users with details:
  - Username, email, join date
  - Order count and activity status
  - User avatars and profiles
- **Orders Tab**: All user orders with:
  - Customer names and emails
  - Order details and status
  - Payment information

### **Admin Navigation**
- Create Recipe (only admins)
- Admin Dashboard (only admins)
- Admin Profile
- No cart or shopping features

## 👤 **User Features**

When users log in, they see:

### **Shopping Homepage**
- "Discover Amazing Recipes" hero section
- "Browse Recipes" and "For You" buttons
- Recipe discovery focused

### **User Navigation**
- For You (recommendations)
- Cart (shopping)
- My Profile
- No admin features

### **Full Shopping Experience**
- Add recipes to cart
- Checkout and place orders
- Rate and review recipes
- Manage favorites

## 📊 **Admin Can See User Details**

In the **Admin Dashboard → Users Tab**, admin sees:

### **User Information**
- ✅ **Username** with avatar
- ✅ **Email address**
- ✅ **Registration date**
- ✅ **Account status** (Active/Inactive)
- ✅ **Order count** (how many orders they've placed)
- ✅ **User role** (always "user" for regular users)

### **User Orders**
In the **Admin Dashboard → Orders Tab**, admin sees:
- ✅ **Customer names** for each order
- ✅ **Customer emails**
- ✅ **Order details** and items purchased
- ✅ **Order status** and payment info
- ✅ **Order dates** and amounts

## 🎯 **Testing the System**

### **Test User Registration**
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Create account with:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
4. Should login automatically as user

### **Test Admin Login**
1. Logout if logged in
2. Click "Login"
3. Use: `admin@recipeplatform.com` / `admin123`
4. Should see admin dashboard

### **Test Admin Viewing Users**
1. Login as admin
2. Go to Admin Dashboard
3. Click "Users" tab
4. Should see all registered users including the test user you created

## 🔄 **User Flow**

### **New User Journey**
1. **Visit Site** → See homepage with login/signup
2. **Register** → Create account with email/password
3. **Auto-Login** → Logged in as user
4. **Shop** → Browse recipes, add to cart, place orders
5. **Rate** → Give reviews and ratings

### **Admin Journey**
1. **Login** → Use admin credentials
2. **Dashboard** → See platform overview
3. **Manage Users** → View all user details and activity
4. **Manage Orders** → See all customer orders
5. **Create Content** → Add new recipes

## ✅ **Verification Checklist**

- ✅ **No Auto-Login**: Users must login manually
- ✅ **User Registration**: Works and creates user accounts
- ✅ **Admin Login**: Works with admin credentials
- ✅ **Different Interfaces**: Admin vs user see different content
- ✅ **Admin Sees Users**: Can view all user details in dashboard
- ✅ **Admin Sees Orders**: Can view all customer orders
- ✅ **Proper Separation**: Admin can't shop, users can't admin

## 🎉 **Success!**

Your platform now has:
- **Proper authentication system**
- **User self-registration**
- **Admin management dashboard**
- **Complete user detail visibility for admin**
- **Separate admin and user experiences**

The system is ready for real-world use! 🚀

---

*Setup Guide Created: February 4, 2026*
*Status: ✅ PRODUCTION READY*