# Recipe Sharing Platform

A modern, full-stack recipe sharing platform built with React.js, Node.js, and MongoDB. Features intelligent recipe recommendations, advanced search capabilities, and a beautiful, responsive user interface.

## 🚀 Features

### Core Features
- **User Authentication** - Secure registration and login system
- **Recipe Management** - Create, edit, delete, and share recipes
- **Advanced Search** - Search by ingredients, cuisine, dietary preferences, and more
- **Recipe Ratings & Reviews** - Rate and review recipes from other users
- **User Profiles** - Customizable profiles with favorite recipes and following system
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices

### Smart Algorithms
- **Collaborative Filtering** - Recommendations based on similar users' preferences
- **Content-Based Filtering** - Suggestions based on recipe similarity
- **Hybrid Recommendation System** - Combines multiple algorithms for better accuracy
- **Trending Algorithm** - Identifies popular recipes based on views, ratings, and favorites
- **Personalized Feed** - Customized recipe suggestions based on user preferences

### Advanced Features
- **Real-time Search** - Instant search results with fuzzy matching
- **Image Upload** - Support for recipe images with Cloudinary integration
- **Dietary Filters** - Filter by vegetarian, vegan, gluten-free, keto, etc.
- **Cooking Time Estimation** - Smart time calculations for meal planning
- **Nutritional Information** - Track calories, protein, carbs, and more
- **Social Features** - Follow users, favorite recipes, and build your cooking community

## 🛠 Tech Stack

### Frontend
- **React.js** - Modern UI library with hooks
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Smooth animations and transitions
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling and validation
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage and optimization
- **Express Rate Limit** - API rate limiting
- **Helmet** - Security middleware

### Development Tools
- **Concurrently** - Run multiple commands simultaneously
- **Nodemon** - Auto-restart server during development
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📦 Quick Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### One-Command Setup
```bash
# Clone and setup everything
git clone <repository-url>
cd recipe-sharing-platform
npm run setup
```

### Manual Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd recipe-sharing-platform
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Configuration**
   
   The setup script creates a `.env` file in the `server` directory. Update it with your settings:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/recipe-platform
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   **Local MongoDB:**
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Ubuntu/Linux
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```
   
   **Or use MongoDB Atlas** (cloud) and update the `MONGODB_URI`

5. **Run the application**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

## 🏗 Project Structure

```
recipe-sharing-platform/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth, etc.)
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # Global styles
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## 🔧 Available Scripts

```bash
# Setup everything (recommended for first time)
npm run setup

# Development mode (runs both client and server)
npm run dev

# Run server only
npm run server

# Run client only  
npm run client

# Build for production
npm run build

# Install all dependencies manually
npm run install-all
```

## 🐛 Troubleshooting

If you encounter issues, check the [TROUBLESHOOTING.md](TROUBLESHOOTING.md) file for common problems and solutions.

**Quick fixes:**
- Ensure MongoDB is running
- Check Node.js version (14+ required)  
- Verify all dependencies are installed
- Check that ports 3000 and 5000 are available

## 🐛 Troubleshooting

If you encounter issues, check the [TROUBLESHOOTING.md](TROUBLESHOOTING.md) file for common problems and solutions.

**Quick fixes:**
- Ensure MongoDB is running
- Check Node.js version (14+ required)
- Verify all dependencies are installed
- Check that ports 3000 and 5000 are available

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Recipes
- `GET /api/recipes` - Get all recipes (with filtering)
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe
- `POST /api/recipes/:id/rate` - Rate a recipe
- `POST /api/recipes/:id/favorite` - Toggle favorite

### Recommendations
- `GET /api/recommendations/for-you` - Personalized recommendations
- `GET /api/recommendations/trending` - Trending recipes
- `GET /api/recommendations/similar/:id` - Similar recipes

### Users
- `GET /api/users/:id` - Get user profile
- `POST /api/users/:id/follow` - Follow/unfollow user
- `GET /api/users/:id/followers` - Get user followers
- `GET /api/users/:id/following` - Get user following

## 🤖 Recommendation Algorithms

### 1. Collaborative Filtering
Uses Pearson correlation coefficient to find users with similar tastes and recommend recipes they liked.

### 2. Content-Based Filtering
Analyzes recipe features (cuisine, difficulty, cooking time, dietary tags) to find similar recipes.

### 3. Hybrid Approach
Combines collaborative and content-based filtering with popularity-based recommendations for optimal results.

### 4. Trending Algorithm
Calculates trending scores based on:
- Views (30% weight)
- Favorites (40% weight)
- Ratings (30% weight)

## 🎨 UI/UX Features

- **Modern Design** - Clean, intuitive interface with smooth animations
- **Responsive Layout** - Optimized for all screen sizes
- **Dark/Light Mode** - User preference-based theming
- **Loading States** - Skeleton screens and spinners for better UX
- **Error Handling** - Graceful error messages and fallbacks
- **Accessibility** - WCAG compliant with keyboard navigation support

## 🚀 Deployment

### Frontend (Netlify/Vercel)
1. Build the client: `cd client && npm run build`
2. Deploy the `build` folder to your hosting service

### Backend (Heroku/Railway)
1. Set environment variables on your hosting platform
2. Deploy the `server` directory
3. Ensure MongoDB connection string is configured

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Update the `MONGODB_URI` in your environment variables
3. Configure network access and database users

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Recipe data and inspiration from various cooking communities
- Icons from React Icons library
- Images from Unsplash and Pexels
- MongoDB for excellent documentation
- React community for amazing tools and libraries

## 📞 Support

If you have any questions or need help with setup, please open an issue or contact the development team.

---

**Happy Cooking! 🍳👨‍🍳👩‍🍳**