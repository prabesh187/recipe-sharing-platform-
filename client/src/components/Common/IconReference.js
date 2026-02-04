// Icon reference for the Recipe Sharing Platform
// This file documents all the icons we use to prevent import errors

import {
  // Navigation & UI
  FiMenu, FiX, FiSearch, FiFilter, FiHome, FiUser, FiUsers,
  
  // Actions
  FiPlus, FiEdit, FiTrash2, FiSave, FiShare2, FiUpload,
  
  // Content
  FiBook, FiBookmark, FiHeart, FiStar, FiClock, FiCalendar,
  
  // Social
  FiUserPlus, FiUserMinus, FiLogIn, FiLogOut,
  
  // Status & Feedback
  FiTrendingUp, FiTrendingDown, FiActivity, FiAward,
  
  // Food & Recipe Related (using available icons)
  // Note: FiChef is not available, use FiBook for recipes
  // Note: Use FiBook for cooking/recipe related content
  
} from 'react-icons/fi';

// Icon mapping for consistent usage across the app
export const AppIcons = {
  // Navigation
  menu: FiMenu,
  close: FiX,
  search: FiSearch,
  filter: FiFilter,
  home: FiHome,
  
  // User & Social
  user: FiUser,
  users: FiUsers,
  userPlus: FiUserPlus,
  userMinus: FiUserMinus,
  login: FiLogIn,
  logout: FiLogOut,
  
  // Actions
  add: FiPlus,
  edit: FiEdit,
  delete: FiTrash2,
  save: FiSave,
  share: FiShare2,
  upload: FiUpload,
  
  // Content
  recipe: FiBook,        // Use for recipes (FiChef not available)
  bookmark: FiBookmark,
  favorite: FiHeart,
  rating: FiStar,
  time: FiClock,
  calendar: FiCalendar,
  
  // Status
  trending: FiTrendingUp,
  activity: FiActivity,
  award: FiAward,
};

// Usage example:
// import { AppIcons } from '../Common/IconReference';
// <AppIcons.recipe size={20} />

export default AppIcons;