import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FiUsers, FiBook, FiShoppingBag, FiDollarSign, 
  FiTrendingUp, FiEye, FiStar, FiSettings, FiMail, FiCalendar,
  FiEdit, FiTrash2, FiCheck, FiX, FiSave
} from 'react-icons/fi';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #1a202c;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #4a5568;
  font-size: 1.1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-left: 4px solid ${props => props.$color || '#667eea'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$color || '#667eea'}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color || '#667eea'};
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  color: #4a5568;
  font-size: 14px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 12px 16px;
  border-bottom: 2px solid #e2e8f0;
  color: #4a5568;
  font-weight: 600;
  font-size: 14px;
`;

const TableRow = styled.tr`
  &:hover {
    background: #f7fafc;
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #1a202c;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.$status) {
      case 'published': return '#c6f6d5';
      case 'draft': return '#fed7d7';
      case 'pending': return '#fef5e7';
      case 'confirmed': return '#bee3f8';
      case 'delivered': return '#c6f6d5';
      default: return '#e2e8f0';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'published': return '#22543d';
      case 'draft': return '#c53030';
      case 'pending': return '#c05621';
      case 'confirmed': return '#2a69ac';
      case 'delivered': return '#22543d';
      default: return '#4a5568';
    }
  }};
`;

const QuickActions = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #4a5568;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  
  &:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
  }
  
  &.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }
`;

const ApprovalButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &.approve {
    background: #c6f6d5;
    color: #22543d;
    
    &:hover {
      background: #9ae6b4;
    }
  }
  
  &.reject {
    background: #fed7d7;
    color: #c53030;
    
    &:hover {
      background: #feb2b2;
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ApprovalControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [editingUser, setEditingUser] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const queryClient = useQueryClient();

  const { data: dashboardData, isLoading } = useQuery(
    'admin-dashboard',
    () => axios.get('/api/admin/dashboard').then(res => res.data),
    {
      refetchInterval: 30000 // Refresh every 30 seconds
    }
  );

  const { data: usersData, isLoading: usersLoading } = useQuery(
    'admin-users',
    () => axios.get('/api/admin/users').then(res => res.data),
    {
      enabled: activeTab === 'users'
    }
  );

  const { data: ordersData, isLoading: ordersLoading } = useQuery(
    'admin-orders',
    () => axios.get('/api/admin/orders').then(res => res.data),
    {
      enabled: activeTab === 'orders'
    }
  );

  const { data: recipesData, isLoading: recipesLoading } = useQuery(
    'admin-recipes',
    () => axios.get('/api/admin/recipes').then(res => res.data),
    {
      enabled: activeTab === 'recipes'
    }
  );

  // Update user status mutation
  const updateUserMutation = useMutation(
    ({ userId, isActive }) => axios.put(`/api/admin/users/${userId}/status`, { isActive }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-users');
        toast.success('User status updated successfully');
        setEditingUser(null);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update user');
      }
    }
  );

  // Update order status mutation
  const updateOrderMutation = useMutation(
    ({ orderId, status, notes }) => axios.put(`/api/admin/orders/${orderId}/status`, { status, notes }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-orders');
        queryClient.invalidateQueries('admin-dashboard');
        toast.success('Order status updated successfully');
        setEditingOrder(null);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update order');
      }
    }
  );

  // Delete recipe mutation
  const deleteRecipeMutation = useMutation(
    (recipeId) => axios.delete(`/api/recipes/${recipeId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-recipes');
        toast.success('Recipe deleted successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete recipe');
      }
    }
  );

  if (isLoading) {
    return (
      <Container>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </Container>
    );
  }

  const { stats, recentOrders, topRecipes } = dashboardData || {};

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <Title>Admin Dashboard</Title>
          <Subtitle>Manage your recipe platform and monitor performance</Subtitle>
        </Header>

        <QuickActions>
          <ActionButton 
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </ActionButton>
          <ActionButton 
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            Users
          </ActionButton>
          <ActionButton 
            className={activeTab === 'recipes' ? 'active' : ''}
            onClick={() => setActiveTab('recipes')}
          >
            Recipes
          </ActionButton>
          <ActionButton 
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </ActionButton>
        </QuickActions>

        <StatsGrid>
          <StatCard $color="#667eea">
            <StatHeader>
              <StatIcon $color="#667eea">
                <FiUsers size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{stats?.totalUsers?.toLocaleString() || 0}</StatValue>
            <StatLabel>Total Users</StatLabel>
          </StatCard>

          <StatCard $color="#48bb78">
            <StatHeader>
              <StatIcon $color="#48bb78">
                <FiBook size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{stats?.totalRecipes?.toLocaleString() || 0}</StatValue>
            <StatLabel>Total Recipes</StatLabel>
          </StatCard>

          <StatCard $color="#ed8936">
            <StatHeader>
              <StatIcon $color="#ed8936">
                <FiShoppingBag size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{stats?.totalOrders?.toLocaleString() || 0}</StatValue>
            <StatLabel>Total Orders</StatLabel>
          </StatCard>

          <StatCard $color="#38b2ac">
            <StatHeader>
              <StatIcon $color="#38b2ac">
                <FiDollarSign size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>Rs {stats?.totalRevenue?.toLocaleString() || 0}</StatValue>
            <StatLabel>Total Revenue</StatLabel>
          </StatCard>
        </StatsGrid>

        <ContentGrid>
          {activeTab === 'overview' && (
            <>
              <Section>
                <SectionTitle>
                  <FiShoppingBag /> Recent Orders
                </SectionTitle>
                
                <Table>
                  <thead>
                    <tr>
                      <TableHeader>Order #</TableHeader>
                      <TableHeader>Customer</TableHeader>
                      <TableHeader>Items</TableHeader>
                      <TableHeader>Total</TableHeader>
                      <TableHeader>Status</TableHeader>
                      <TableHeader>Date</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders?.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>{order.orderNumber}</TableCell>
                        <TableCell>{order.user.username}</TableCell>
                        <TableCell>{order.items.length} items</TableCell>
                        <TableCell>Rs {order.total.toFixed(0)}</TableCell>
                        <TableCell>
                          <StatusBadge $status={order.status}>
                            {order.status}
                          </StatusBadge>
                        </TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
              </Section>

              <Section>
                <SectionTitle>
                  <FiTrendingUp /> Top Recipes
                </SectionTitle>
                
                {topRecipes?.map((recipe, index) => (
                  <div key={recipe._id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 0',
                    borderBottom: index < topRecipes.length - 1 ? '1px solid #e2e8f0' : 'none'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: recipe.images?.[0]?.url ? `url(${recipe.images[0].url})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.2rem'
                    }}>
                      {!recipe.images?.[0]?.url && '🍳'}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>
                        {recipe.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#4a5568' }}>
                        by {recipe.author.username}
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#ed8936' }}>
                        <FiStar size={12} />
                        {recipe.averageRating.toFixed(1)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#4a5568' }}>
                        <FiEye size={12} style={{ marginRight: '4px' }} />
                        {recipe.views}
                      </div>
                    </div>
                  </div>
                ))}
              </Section>
            </>
          )}

          {activeTab === 'users' && (
            <Section style={{ gridColumn: '1 / -1' }}>
              <SectionTitle>
                <FiUsers /> User Management
              </SectionTitle>
              
              {usersLoading ? (
                <div>Loading users...</div>
              ) : (
                <Table>
                  <thead>
                    <tr>
                      <TableHeader>Username</TableHeader>
                      <TableHeader>Email</TableHeader>
                      <TableHeader>Role</TableHeader>
                      <TableHeader>Joined</TableHeader>
                      <TableHeader>Status</TableHeader>
                      <TableHeader>Orders</TableHeader>
                      <TableHeader>Actions</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData?.users?.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {user.avatar ? (
                              <img 
                                src={user.avatar} 
                                alt={user.username}
                                style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                              />
                            ) : (
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: '#667eea',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '14px'
                              }}>
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span style={{ fontWeight: '600' }}>{user.username}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiMail size={14} />
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge $status={user.role}>
                            {user.role}
                          </StatusBadge>
                        </TableCell>
                        <TableCell>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiCalendar size={14} />
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {editingUser === user._id ? (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <select
                                defaultValue={user.isActive}
                                onChange={(e) => {
                                  updateUserMutation.mutate({
                                    userId: user._id,
                                    isActive: e.target.value === 'true'
                                  });
                                }}
                                style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                              >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                              </select>
                              <button
                                onClick={() => setEditingUser(null)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e53e3e' }}
                              >
                                <FiX size={16} />
                              </button>
                            </div>
                          ) : (
                            <StatusBadge $status={user.isActive ? 'active' : 'inactive'}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </StatusBadge>
                          )}
                        </TableCell>
                        <TableCell>
                          <span style={{ color: '#4a5568' }}>
                            {user.orderCount || 0} orders
                          </span>
                        </TableCell>
                        <TableCell>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => setEditingUser(editingUser === user._id ? null : user._id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#667eea',
                                padding: '4px'
                              }}
                              title="Edit Status"
                            >
                              <FiEdit size={16} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
              )}
            </Section>
          )}

          {activeTab === 'recipes' && (
            <Section style={{ gridColumn: '1 / -1' }}>
              <SectionTitle>
                <FiBook /> Recipe Management
              </SectionTitle>
              
              {recipesLoading ? (
                <div>Loading recipes...</div>
              ) : (
                <Table>
                  <thead>
                    <tr>
                      <TableHeader>Recipe</TableHeader>
                      <TableHeader>Author</TableHeader>
                      <TableHeader>Category</TableHeader>
                      <TableHeader>Price</TableHeader>
                      <TableHeader>Rating</TableHeader>
                      <TableHeader>Views</TableHeader>
                      <TableHeader>Actions</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {recipesData?.recipes?.map((recipe) => (
                      <TableRow key={recipe._id}>
                        <TableCell>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '8px',
                              background: recipe.images?.[0]?.url ? `url(${recipe.images[0].url})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '1.2rem'
                            }}>
                              {!recipe.images?.[0]?.url && '🍳'}
                            </div>
                            <div>
                              <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                {recipe.title}
                              </div>
                              <div style={{ fontSize: '12px', color: '#4a5568' }}>
                                {recipe.cuisine} • {recipe.difficulty}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{recipe.author.username}</TableCell>
                        <TableCell>
                          <StatusBadge $status={recipe.category}>
                            {recipe.category}
                          </StatusBadge>
                        </TableCell>
                        <TableCell>
                          {recipe.isPremium ? (
                            <span style={{ color: '#38b2ac', fontWeight: '600' }}>
                              Rs {recipe.price}
                            </span>
                          ) : (
                            <span style={{ color: '#48bb78' }}>Free</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiStar size={14} color="#ed8936" />
                            {recipe.averageRating.toFixed(1)}
                          </div>
                        </TableCell>
                        <TableCell>{recipe.views}</TableCell>
                        <TableCell>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => window.open(`/edit-recipe/${recipe._id}`, '_blank')}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#667eea',
                                padding: '4px'
                              }}
                              title="Edit Recipe"
                            >
                              <FiEdit size={16} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this recipe?')) {
                                  deleteRecipeMutation.mutate(recipe._id);
                                }
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#e53e3e',
                                padding: '4px'
                              }}
                              title="Delete Recipe"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
              )}
            </Section>
          )}

          {activeTab === 'orders' && (
            <Section style={{ gridColumn: '1 / -1' }}>
              <SectionTitle>
                <FiShoppingBag /> Order Management
              </SectionTitle>
              
              {ordersLoading ? (
                <div>Loading orders...</div>
              ) : (
                <Table>
                  <thead>
                    <tr>
                      <TableHeader>Order #</TableHeader>
                      <TableHeader>Customer</TableHeader>
                      <TableHeader>Email</TableHeader>
                      <TableHeader>Items</TableHeader>
                      <TableHeader>Total</TableHeader>
                      <TableHeader>Approval</TableHeader>
                      <TableHeader>Status</TableHeader>
                      <TableHeader>Date</TableHeader>
                      <TableHeader>Actions</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersData?.orders?.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                          {order.orderNumber}
                        </TableCell>
                        <TableCell style={{ fontWeight: '600' }}>
                          {order.user.username}
                        </TableCell>
                        <TableCell>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiMail size={14} />
                            {order.user.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          {order.items.length} items
                        </TableCell>
                        <TableCell>
                          Rs {order.total.toFixed(0)}
                        </TableCell>
                        <TableCell>
                          {order.adminApproval?.status === 'pending' ? (
                            <ApprovalControls>
                              <ApprovalButton
                                className="approve"
                                onClick={() => approveOrderMutation.mutate({
                                  orderId: order._id,
                                  action: 'approve',
                                  notes: 'Order approved by admin'
                                })}
                                disabled={approveOrderMutation.isLoading}
                              >
                                <FiCheck size={12} /> Approve
                              </ApprovalButton>
                              <ApprovalButton
                                className="reject"
                                onClick={() => {
                                  const reason = prompt('Rejection reason:');
                                  if (reason) {
                                    approveOrderMutation.mutate({
                                      orderId: order._id,
                                      action: 'reject',
                                      rejectionReason: reason
                                    });
                                  }
                                }}
                                disabled={approveOrderMutation.isLoading}
                              >
                                <FiX size={12} /> Reject
                              </ApprovalButton>
                            </ApprovalControls>
                          ) : (
                            <StatusBadge $status={order.adminApproval?.status}>
                              {order.adminApproval?.status}
                            </StatusBadge>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingOrder === order._id ? (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <select
                                defaultValue={order.status}
                                onChange={(e) => {
                                  updateOrderMutation.mutate({
                                    orderId: order._id,
                                    status: e.target.value
                                  });
                                }}
                                style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="preparing">Preparing</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              <button
                                onClick={() => setEditingOrder(null)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e53e3e' }}
                              >
                                <FiX size={16} />
                              </button>
                            </div>
                          ) : (
                            <StatusBadge $status={order.status}>
                              {order.status}
                            </StatusBadge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => setEditingOrder(editingOrder === order._id ? null : order._id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#667eea',
                                padding: '4px'
                              }}
                              title="Edit Status"
                            >
                              <FiEdit size={16} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
              )}
            </Section>
          )}
        </ContentGrid>
      </motion.div>
    </Container>
  );
};

export default AdminDashboard;