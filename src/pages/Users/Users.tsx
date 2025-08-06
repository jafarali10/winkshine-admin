import React, { useState, useEffect } from 'react';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Block as BlockIcon,
  CheckCircle as ActivateIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { usersAPI } from '../../services/api';
import { User } from '../../types';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [addUserErrors, setAddUserErrors] = useState<{[key: string]: string}>({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUserLoading, setEditUserLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserForm, setEditUserForm] = useState({
    name: '',
    email: '',
    status: 'active' as 'active' | 'inactive'
  });
  const [editUserErrors, setEditUserErrors] = useState<{[key: string]: string}>({});
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Effect to handle search and filter changes
  useEffect(() => {
    // Clear any existing timeout
    if ((window as any).searchTimeout) {
      clearTimeout((window as any).searchTimeout);
    }
    
    // Trigger search after a small delay
    (window as any).searchTimeout = setTimeout(() => {
      fetchUsers(1);
    }, 300);
  }, [searchTerm, filterStatus]);

  const fetchUsers = async (page = currentPage) => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersAPI.getRegularUsers(page, itemsPerPage, searchTerm, filterStatus);
      
      console.log('API Response:', response); // Debug log
      
      if (response.success && response.data) {
        // Handle both direct array and nested users object
        let usersData: User[] = [];
        let totalUsersCount = 0;
        
        if (Array.isArray(response.data)) {
          usersData = response.data;
        } else if (typeof response.data === 'object' && response.data !== null && 'users' in response.data && Array.isArray((response.data as any).users)) {
          usersData = (response.data as any).users;
          if ((response.data as any).pagination && (response.data as any).pagination.total) {
            totalUsersCount = (response.data as any).pagination.total;
          }
        }
        
        console.log('Users Data:', usersData); // Debug log
        setUsers(usersData);
        setTotalUsers(totalUsersCount);
      } else {
        setError(response.error || 'Failed to fetch users');
        setUsers([]);
        setTotalUsers(0);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('An error occurred while fetching users');
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  // Pagination - using server-side total for better accuracy
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    fetchUsers(pageNumber);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Removed role filter function since we only show users

  const handleStatusFilter = (status: 'all' | 'active' | 'inactive') => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    setActionLoading(userId);
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await usersAPI.updateStatus(userId, newStatus as 'active' | 'inactive');
      if (response.success) {
        fetchUsers(); // Refresh the list
      } else {
        alert('Failed to update user status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('An error occurred while updating user status. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const userToDelete = users.find(user => user._id === userId);
    const userName = userToDelete ? userToDelete.name : 'this user';
    
    if (window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      setActionLoading(userId);
      try {
        const response = await usersAPI.delete(userId);
        if (response.success) {
          // Show success message (you can add a toast notification here)
          console.log('User deleted successfully');
          fetchUsers(); // Refresh the list
        } else {
          alert('Failed to delete user. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('An error occurred while deleting the user. Please try again.');
      } finally {
        setActionLoading(null);
      }
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!addUserForm.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!addUserForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(addUserForm.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!addUserForm.password) {
      errors.password = 'Password is required';
    } else if (addUserForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (addUserForm.password !== addUserForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setAddUserErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddUser = async () => {
    if (!validateForm()) {
      return;
    }

    setAddUserLoading(true);
    try {
      const response = await usersAPI.createUser({
        name: addUserForm.name.trim(),
        email: addUserForm.email.trim(),
        password: addUserForm.password,
        role: 'user' // Always create as regular user
      });

      if (response.success) {
        // Reset form and close modal
        setAddUserForm({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setAddUserErrors({});
        setShowAddModal(false);
        
        // Refresh user list
        fetchUsers();
        
        // Show success message
        alert('User created successfully!');
      } else {
        alert(response.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('An error occurred while creating the user. Please try again.');
    } finally {
      setAddUserLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setAddUserForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (addUserErrors[field]) {
      setAddUserErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const openAddModal = () => {
    setShowAddModal(true);
    setAddUserForm({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setAddUserErrors({});
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setAddUserForm({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setAddUserErrors({});
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditUserForm({
      name: user.name,
      email: user.email,
      status: user.status
    });
    setEditUserErrors({});
    setShowEditModal(true);
  };

  const validateEditForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!editUserForm.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!editUserForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editUserForm.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    setEditUserErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateUser = async () => {
    if (!validateEditForm() || !editingUser) {
      return;
    }

    setEditUserLoading(true);
    try {
      let hasChanges = false;
      
      // Update name and email if changed
      if (editUserForm.name !== editingUser.name || editUserForm.email !== editingUser.email) {
        const updateResponse = await usersAPI.updateUser(editingUser._id, {
          name: editUserForm.name.trim(),
          email: editUserForm.email.trim()
        });
        
        if (!updateResponse.success) {
          alert(updateResponse.error || 'Failed to update user details. Please try again.');
          return;
        }
        hasChanges = true;
      }
      
      // Update status if changed
      if (editUserForm.status !== editingUser.status) {
        const statusResponse = await usersAPI.updateStatus(editingUser._id, editUserForm.status);
        if (!statusResponse.success) {
          alert('Failed to update user status. Please try again.');
          return;
        }
        hasChanges = true;
      }

      // Close modal and refresh
      setShowEditModal(false);
      setEditingUser(null);
      setEditUserForm({
        name: '',
        email: '',
        status: 'active'
      });
      setEditUserErrors({});
      
      // Refresh user list
      fetchUsers();
      
      // Show success message
      if (hasChanges) {
        alert('User updated successfully!');
      } else {
        alert('No changes were made.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('An error occurred while updating the user. Please try again.');
    } finally {
      setEditUserLoading(false);
    }
  };

  const handleEditInputChange = (field: string, value: string) => {
    setEditUserForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (editUserErrors[field]) {
      setEditUserErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditUserForm({
      name: '',
      email: '',
      status: 'active'
    });
    setEditUserErrors({});
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 fw-bold text-primary mb-2">Users Management</h1>
              <p className="text-muted mb-0">
                Manage all regular users in the system
              </p>
            </div>
            <button 
              className="btn btn-primary d-flex align-items-center"
              onClick={openAddModal}
            >
              <AddIcon className="me-2" />
              Add New User
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-custom">
            <div className="card-body">
              <div className="row g-3">
                {/* Search */}
                <div className="col-md-4">
                  <div className="position-relative">
                    <SearchIcon 
                      className="position-absolute top-50 start-0 translate-middle-y ms-3"
                      style={{ color: '#6c757d', fontSize: '1.2rem' }}
                    />
                    <input
                      type="text"
                      className="form-control ps-5"
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        className="btn-close position-absolute top-50 end-0 translate-middle-y me-3"
                        onClick={() => setSearchTerm('')}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '1rem',
                          color: '#6c757d',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          borderRadius: '4px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                          e.currentTarget.style.color = '#dc3545';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#6c757d';
                        }}
                      >
                        <CloseIcon style={{ fontSize: '1rem' }} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Filter */}
                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => handleStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Results Count */}
                <div className="col-md-4">
                  <div className="text-end">
                    <small className="text-muted">
                      {totalUsers} users found
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-custom">
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-custom mx-auto mb-3"></div>
                  <p className="text-muted">Loading users...</p>
                </div>
              ) : error ? (
                <div className="text-center py-5">
                  <div className="text-danger mb-3">
                    <FilterIcon style={{ fontSize: '3rem', opacity: 0.5 }} />
                  </div>
                  <h5 className="text-danger mb-2">Error Loading Users</h5>
                  <p className="text-muted mb-3">{error}</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => fetchUsers()}
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="border-0 px-4 py-3">Name</th>
                          <th className="border-0 px-4 py-3">Email</th>
                          <th className="border-0 px-4 py-3">Status</th>
                          <th className="border-0 px-4 py-3">Created</th>
                          <th className="border-0 px-4 py-3 text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center py-5">
                              <div className="text-muted">
                                <FilterIcon style={{ fontSize: '3rem', opacity: 0.5 }} />
                                <p className="mt-2 mb-0">No users found</p>
                                <small>Try adjusting your search or filters</small>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          users.map((user) => (
                            <tr key={user._id}>
                              <td className="px-4 py-3">
                                <div className="d-flex align-items-center">
                                  <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3"
                                       style={{ width: '40px', height: '40px' }}>
                                    <span className="text-white fw-bold">
                                      {user.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <h6 className="mb-0 fw-semibold">{user.name}</h6>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-muted">{user.email}</span>
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  className={`btn btn-sm ${user.status === 'active' ? 'btn-success' : 'btn-danger'}`}
                                  onClick={() => handleStatusToggle(user._id, user.status)}
                                  style={{ minWidth: '80px' }}
                                >
                                  {user.status === 'active' ? 'Active' : 'Inactive'}
                                </button>
                              </td>
                              <td className="px-4 py-3">
                                <small className="text-muted">
                                  {new Date(user.createdAt).toLocaleDateString()}
                                </small>
                              </td>
                              <td className="px-4 py-3 table-actions-column">
                                <div className="action-buttons-container">
                                  {/* Edit Button */}
                                  <button
                                    className="action-btn action-btn-primary"
                                    title="Edit User"
                                    onClick={() => handleEditUser(user)}
                                  >
                                    <EditIcon style={{ fontSize: '1rem' }} />
                                  </button>

                                  {/* Status Toggle Button */}
                                  {user.status === 'active' ? (
                                    <button
                                      className="action-btn action-btn-warning"
                                      title="Deactivate User"
                                      onClick={() => handleStatusToggle(user._id, user.status)}
                                      disabled={actionLoading === user._id}
                                    >
                                      {actionLoading === user._id ? (
                                        <div className="spinner-custom" style={{ width: '1rem', height: '1rem' }}></div>
                                      ) : (
                                        <BlockIcon style={{ fontSize: '1rem' }} />
                                      )}
                                    </button>
                                  ) : (
                                    <button
                                      className="action-btn action-btn-success"
                                      title="Activate User"
                                      onClick={() => handleStatusToggle(user._id, user.status)}
                                      disabled={actionLoading === user._id}
                                    >
                                      {actionLoading === user._id ? (
                                        <div className="spinner-custom" style={{ width: '1rem', height: '1rem' }}></div>
                                      ) : (
                                        <ActivateIcon style={{ fontSize: '1rem' }} />
                                      )}
                                    </button>
                                  )}

                                  {/* Delete Button */}
                                  <button
                                    className="action-btn action-btn-danger"
                                    title="Delete User"
                                    onClick={() => handleDeleteUser(user._id)}
                                    disabled={actionLoading === user._id}
                                  >
                                    {actionLoading === user._id ? (
                                      <div className="spinner-custom" style={{ width: '1rem', height: '1rem' }}></div>
                                    ) : (
                                      <DeleteIcon style={{ fontSize: '1rem' }} />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top">
                      <div>
                        <small className="text-muted">
                          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalUsers)} of {totalUsers} users
                        </small>
                      </div>
                      <nav>
                        <ul className="pagination pagination-sm mb-0">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              Previous
                            </button>
                          </li>
                          
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </button>
                            </li>
                          ))}
                          
                          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div 
          className="modal fade show" 
          style={{ 
            display: 'block', 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1050
          }} 
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '500px' }}>
            <div className="modal-content border-0 shadow-custom" style={{ borderRadius: '12px' }}>
              <div className="modal-header border-0 pb-0" style={{ padding: '1.5rem 1.5rem 0.5rem 1.5rem' }}>
                <h5 className="modal-title fw-bold text-primary mb-0">Add New User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeAddModal}
                  disabled={addUserLoading}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    color: '#6c757d',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                    e.currentTarget.style.color = '#dc3545';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#6c757d';
                  }}
                >
                  <CloseIcon style={{ fontSize: '1.25rem' }} />
                </button>
              </div>
              <div className="modal-body" style={{ padding: '1rem 1.5rem' }}>
                <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }}>
                  {/* Name Field */}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-semibold text-dark">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${addUserErrors.name ? 'is-invalid' : ''}`}
                      id="name"
                      placeholder="Enter full name"
                      value={addUserForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={addUserLoading}
                      style={{ 
                        borderRadius: '8px',
                        border: addUserErrors.name ? '1px solid #dc3545' : '1px solid #dee2e6',
                        padding: '0.75rem 1rem'
                      }}
                    />
                    {addUserErrors.name && (
                      <div className="invalid-feedback d-block" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        {addUserErrors.name}
                      </div>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold text-dark">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control ${addUserErrors.email ? 'is-invalid' : ''}`}
                      id="email"
                      placeholder="Enter email address"
                      value={addUserForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={addUserLoading}
                      style={{ 
                        borderRadius: '8px',
                        border: addUserErrors.email ? '1px solid #dc3545' : '1px solid #dee2e6',
                        padding: '0.75rem 1rem'
                      }}
                    />
                    {addUserErrors.email && (
                      <div className="invalid-feedback d-block" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        {addUserErrors.email}
                      </div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold text-dark">
                      Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className={`form-control ${addUserErrors.password ? 'is-invalid' : ''}`}
                      id="password"
                      placeholder="Enter password (min 6 characters)"
                      value={addUserForm.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      disabled={addUserLoading}
                      style={{ 
                        borderRadius: '8px',
                        border: addUserErrors.password ? '1px solid #dc3545' : '1px solid #dee2e6',
                        padding: '0.75rem 1rem'
                      }}
                    />
                    {addUserErrors.password && (
                      <div className="invalid-feedback d-block" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        {addUserErrors.password}
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label fw-semibold text-dark">
                      Confirm Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className={`form-control ${addUserErrors.confirmPassword ? 'is-invalid' : ''}`}
                      id="confirmPassword"
                      placeholder="Confirm password"
                      value={addUserForm.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      disabled={addUserLoading}
                      style={{ 
                        borderRadius: '8px',
                        border: addUserErrors.confirmPassword ? '1px solid #dc3545' : '1px solid #dee2e6',
                        padding: '0.75rem 1rem'
                      }}
                    />
                    {addUserErrors.confirmPassword && (
                      <div className="invalid-feedback d-block" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        {addUserErrors.confirmPassword}
                      </div>
                    )}
                  </div>

                  {/* Modal Footer */}
                  <div className="modal-footer border-0 px-0 pb-0" style={{ padding: '1rem 0 0 0' }}>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={closeAddModal}
                      disabled={addUserLoading}
                      style={{ 
                        borderRadius: '8px',
                        padding: '0.75rem 1.5rem',
                        fontWeight: '500'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={addUserLoading}
                      style={{ 
                        borderRadius: '8px',
                        padding: '0.75rem 1.5rem',
                        fontWeight: '500',
                        minWidth: '120px'
                      }}
                    >
                      {addUserLoading ? (
                        <>
                          <div className="spinner-custom me-2" style={{ width: '1rem', height: '1rem' }}></div>
                          Creating...
                        </>
                      ) : (
                        'Create User'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div 
          className="modal fade show" 
          style={{ 
            display: 'block', 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1050
          }} 
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '500px' }}>
            <div className="modal-content border-0 shadow-custom" style={{ borderRadius: '12px' }}>
              <div className="modal-header border-0 pb-0" style={{ padding: '1.5rem 1.5rem 0.5rem 1.5rem' }}>
                <h5 className="modal-title fw-bold text-primary mb-0">Edit User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeEditModal}
                  disabled={editUserLoading}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    color: '#6c757d',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                    e.currentTarget.style.color = '#dc3545';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#6c757d';
                  }}
                >
                  <CloseIcon style={{ fontSize: '1.25rem' }} />
                </button>
              </div>
              <div className="modal-body" style={{ padding: '1rem 1.5rem' }}>
                <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(); }}>
                  {/* Name Field */}
                  <div className="mb-3">
                    <label htmlFor="edit-name" className="form-label fw-semibold text-dark">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${editUserErrors.name ? 'is-invalid' : ''}`}
                      id="edit-name"
                      placeholder="Enter full name"
                      value={editUserForm.name}
                      onChange={(e) => handleEditInputChange('name', e.target.value)}
                      disabled={editUserLoading}
                      style={{ 
                        borderRadius: '8px',
                        border: editUserErrors.name ? '1px solid #dc3545' : '1px solid #dee2e6',
                        padding: '0.75rem 1rem'
                      }}
                    />
                    {editUserErrors.name && (
                      <div className="invalid-feedback d-block" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        {editUserErrors.name}
                      </div>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="mb-3">
                    <label htmlFor="edit-email" className="form-label fw-semibold text-dark">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control ${editUserErrors.email ? 'is-invalid' : ''}`}
                      id="edit-email"
                      placeholder="Enter email address"
                      value={editUserForm.email}
                      onChange={(e) => handleEditInputChange('email', e.target.value)}
                      disabled={editUserLoading}
                      style={{ 
                        borderRadius: '8px',
                        border: editUserErrors.email ? '1px solid #dc3545' : '1px solid #dee2e6',
                        padding: '0.75rem 1rem'
                      }}
                    />
                    {editUserErrors.email && (
                      <div className="invalid-feedback d-block" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        {editUserErrors.email}
                      </div>
                    )}
                  </div>

                  {/* Status Field */}
                  <div className="mb-4">
                    <label htmlFor="edit-status" className="form-label fw-semibold text-dark">
                      Status <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="edit-status"
                      value={editUserForm.status}
                      onChange={(e) => handleEditInputChange('status', e.target.value)}
                      disabled={editUserLoading}
                      style={{ 
                        borderRadius: '8px',
                        border: '1px solid #dee2e6',
                        padding: '0.75rem 1rem'
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Modal Footer */}
                  <div className="modal-footer border-0 px-0 pb-0" style={{ padding: '1rem 0 0 0' }}>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={closeEditModal}
                      disabled={editUserLoading}
                      style={{ 
                        borderRadius: '8px',
                        padding: '0.75rem 1.5rem',
                        fontWeight: '500'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={editUserLoading}
                      style={{ 
                        borderRadius: '8px',
                        padding: '0.75rem 1.5rem',
                        fontWeight: '500',
                        minWidth: '120px'
                      }}
                    >
                      {editUserLoading ? (
                        <>
                          <div className="spinner-custom me-2" style={{ width: '1rem', height: '1rem' }}></div>
                          Updating...
                        </>
                      ) : (
                        'Update User'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users; 