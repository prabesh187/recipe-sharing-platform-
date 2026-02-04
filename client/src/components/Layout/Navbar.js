import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiSearch, FiUser, FiPlus, FiMenu, FiX, FiHeart, FiLogOut, FiShoppingCart, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const Nav = styled.nav`
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  position: relative;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 400px;
  margin: 0 40px;
  position: relative;
  
  @media (max-width: 768px) {
    display: ${props => props.$mobileSearchOpen ? 'block' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: 0;
    max-width: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 2px solid #e2e8f0;
  border-radius: 25px;
  font-size: 16px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  font-size: 18px;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  
  @media (max-width: 768px) {
    display: ${props => props.$mobileMenuOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    gap: 16px;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  color: #4a5568;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f7fafc;
    color: #667eea;
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f7fafc;
  }
`;

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  min-width: 200px;
  z-index: 1000;
  
  @media (max-width: 768px) {
    position: static;
    box-shadow: none;
    border: 1px solid #e2e8f0;
    margin-top: 8px;
  }
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  text-decoration: none;
  color: #4a5568;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f7fafc;
  }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  width: 100%;
  border: none;
  background: none;
  color: #4a5568;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f7fafc;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  color: #4a5568;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu')) {
        setUserMenuOpen(false);
      }
      if (!event.target.closest('.mobile-menu')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">
          🍳 RecipeShare
        </Logo>

        <SearchContainer $mobileSearchOpen={mobileSearchOpen}>
          <form onSubmit={handleSearch}>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search recipes, ingredients, cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </SearchContainer>

        <NavLinks $mobileMenuOpen={mobileMenuOpen} className="mobile-menu">
          {user ? (
            <>
              {user.role === 'admin' ? (
                // ADMIN NAVIGATION - Only admin features
                <>
                  <NavLink to="/create-recipe">
                    <FiPlus /> Create Recipe
                  </NavLink>
                  <NavLink to="/admin">
                    <FiSettings /> Admin Dashboard
                  </NavLink>
                  <UserMenu className="user-menu">
                    <UserButton onClick={() => setUserMenuOpen(!userMenuOpen)}>
                      {user.avatar ? (
                        <UserAvatar src={user.avatar} alt={user.username} />
                      ) : (
                        <FiUser size={20} />
                      )}
                      {user.username}
                      <span style={{
                        background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                        color: '#1a202c',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontSize: '10px',
                        fontWeight: '700',
                        marginLeft: '8px'
                      }}>
                        ADMIN
                      </span>
                    </UserButton>
                    {userMenuOpen && (
                      <DropdownMenu>
                        <DropdownItem to={`/user/${user.id}`}>
                          <FiUser /> Admin Profile
                        </DropdownItem>
                        <DropdownItem to="/admin">
                          <FiSettings /> Admin Dashboard
                        </DropdownItem>
                        <DropdownItem to="/create-recipe">
                          <FiPlus /> Create Recipe
                        </DropdownItem>
                        <DropdownButton onClick={handleLogout}>
                          <FiLogOut /> Logout
                        </DropdownButton>
                      </DropdownMenu>
                    )}
                  </UserMenu>
                </>
              ) : (
                // USER NAVIGATION - Only user features
                <>
                  <NavLink to="/recommendations">
                    <FiHeart /> For You
                  </NavLink>
                  <NavLink to="/cart">
                    <FiShoppingCart /> Cart
                  </NavLink>
                  <UserMenu className="user-menu">
                    <UserButton onClick={() => setUserMenuOpen(!userMenuOpen)}>
                      {user.avatar ? (
                        <UserAvatar src={user.avatar} alt={user.username} />
                      ) : (
                        <FiUser size={20} />
                      )}
                      {user.username}
                    </UserButton>
                    {userMenuOpen && (
                      <DropdownMenu>
                        <DropdownItem to={`/user/${user.id}`}>
                          <FiUser /> My Profile
                        </DropdownItem>
                        <DropdownItem to="/cart">
                          <FiShoppingCart /> My Cart
                        </DropdownItem>
                        <DropdownButton onClick={handleLogout}>
                          <FiLogOut /> Logout
                        </DropdownButton>
                      </DropdownMenu>
                    )}
                  </UserMenu>
                </>
              )}
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register" className="btn btn-primary">
                Sign Up
              </NavLink>
            </>
          )}
        </NavLinks>

        <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </MobileMenuButton>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;