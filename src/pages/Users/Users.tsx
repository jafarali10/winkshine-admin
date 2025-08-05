import React, { useState, useEffect } from 'react';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterIcon,
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
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersAPI.getAll();
      
      console.log('API Response:', response); // Debug log
      
      if (response.success && response.data) {
        // Handle both direct array and nested users object
        let usersData: User[] = [];
        if (Array.isArray(response.data)) {
          usersData = response.data;
        } else if (typeof response.data === 'object' && response.data !== null && 'users' in response.data && Array.isArray((response.data as any).users)) {
          usersData = (response.data as any).users;
        }
        
        console.log('Users Data:', usersData); // Debug log
        setUsers(usersData);
      } else {
        setError(response.error || 'Failed to fetch users');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('An error occurred while fetching users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term, role, and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus && !user.isDeleted;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleRoleFilter = (role: 'all' | 'admin' | 'user') => {
    setFilterRole(role);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: 'all' | 'active' | 'inactive') => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await usersAPI.updateStatus(userId, newStatus as 'active' | 'inactive');
      if (response.success) {
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await usersAPI.delete(userId);
        if (response.success) {
          fetchUsers(); // Refresh the list
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
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
                Manage all users in the system
              </p>
            </div>
            <button className="btn btn-primary d-flex align-items-center">
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
                  </div>
                </div>

                {/* Role Filter */}
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={filterRole}
                    onChange={(e) => handleRoleFilter(e.target.value as 'all' | 'admin' | 'user')}
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="col-md-3">
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
                <div className="col-md-2">
                  <div className="text-end">
                    <small className="text-muted">
                      {filteredUsers.length} users found
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
                    onClick={fetchUsers}
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
                          <th className="border-0 px-4 py-3">Role</th>
                          <th className="border-0 px-4 py-3">Status</th>
                          <th className="border-0 px-4 py-3">Created</th>
                          <th className="border-0 px-4 py-3 text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentUsers.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-5">
                              <div className="text-muted">
                                <FilterIcon style={{ fontSize: '3rem', opacity: 0.5 }} />
                                <p className="mt-2 mb-0">No users found</p>
                                <small>Try adjusting your search or filters</small>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          currentUsers.map((user) => (
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
                                <span className={`badge ${user.role === 'admin' ? 'bg-primary' : 'bg-secondary'}`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  className={`btn btn-sm ${user.status === 'active' ? 'btn-success' : 'btn-danger'}`}
                                  onClick={() => handleStatusToggle(user._id, user.status)}
                                  style={{ minWidth: '80px' }}
                                >
                                  {user.status}
                                </button>
                              </td>
                              <td className="px-4 py-3">
                                <small className="text-muted">
                                  {new Date(user.createdAt).toLocaleDateString()}
                                </small>
                              </td>
                              <td className="px-4 py-3 text-end">
                                <div className="dropdown">
                                  <button
                                    className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <MoreVertIcon style={{ fontSize: '1rem' }} />
                                  </button>
                                  <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                      <button className="dropdown-item">
                                        <EditIcon className="me-2" style={{ fontSize: '1rem' }} />
                                        Edit
                                      </button>
                                    </li>
                                    <li>
                                      <button 
                                        className="dropdown-item text-danger"
                                        onClick={() => handleDeleteUser(user._id)}
                                      >
                                        <DeleteIcon className="me-2" style={{ fontSize: '1rem' }} />
                                        Delete
                                      </button>
                                    </li>
                                  </ul>
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
                          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
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
    </div>
  );
};

export default Users; 