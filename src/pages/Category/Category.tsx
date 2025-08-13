import React, { useState, useEffect } from 'react';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Close as CloseIcon,
    FilterList as FilterIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Block as BlockIcon,
    CheckCircle as ActivateIcon,
} from '@mui/icons-material';
import { categoryAPI, usersAPI } from '../../services/api';
import { Category } from '../../types';

const Categorys: React.FC = () => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [totalUsers, setTotalUsers] = useState(0);
    const totalPages = Math.ceil(totalUsers / itemsPerPage);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [editingCategory, setEditingUser] = useState<Category | null>(null);
    const [editCategoryForm, setEditUserForm] = useState({
        name: '',
        status: 'active' as 'active' | 'inactive'
    });
    const [editUserErrors, setEditUserErrors] = useState<{ [key: string]: string }>({});
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addUserForm, setAddUserForm] = useState({
        name: '',
    });
    const [addUserErrors, setAddUserErrors] = useState<{ [key: string]: string }>({});
    const [addUserLoading, setAddUserLoading] = useState(false);
    const [editUserLoading, setEditUserLoading] = useState(false);

    useEffect(() => {
        fetchCategory();
    }, []);

    // Effect to handle search and filter changes
    useEffect(() => {
        // Clear any existing timeout
        if ((window as any).searchTimeout) {
            clearTimeout((window as any).searchTimeout);
        }

        // Trigger search after a small delay
        (window as any).searchTimeout = setTimeout(() => {
            fetchCategory(1);
        }, 300);
    }, [searchTerm, filterStatus]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleStatusFilter = (status: 'all' | 'active' | 'inactive') => {
        setFilterStatus(status);
        setCurrentPage(1);
    };

    const fetchCategory = async (page = currentPage) => {
        try {
            setLoading(true);
            setError(null);
            const response = await categoryAPI.getAllCategory(page, itemsPerPage, searchTerm, filterStatus);
            if (response.success && response.data) {
                // Handle both direct array and nested categories object
                let categoryData: Category[] = [];
                let totalUsersCount = 0;

                if (Array.isArray(response.data)) {
                    categoryData = response.data;
                } else
                    if (typeof response.data === 'object' && response.data !== null && Array.isArray((response.data as any).categories)) {
                        categoryData = (response.data as any).categories;
                        if ((response.data as any).pagination && (response.data as any).pagination.total) {
                            totalUsersCount = (response.data as any).pagination.total;
                        }
                    }

                console.log('categories Data:', categoryData); // Debug log
                setCategories(categoryData);
                setTotalUsers(totalUsersCount);
            } else {
                setError(response.error || 'Failed to fetch categories');
                setCategories([]);
                setTotalUsers(0);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('An error occurred while fetching categories');
            setCategories([]);
            setTotalUsers(0);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (userId: string, currentStatus: string) => {
        setActionLoading(userId);
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            const response = await categoryAPI.updateStatus(userId, newStatus as 'active' | 'inactive');
            if (response.success) {
                fetchCategory(); // Refresh the list
            } else {
                alert('Failed to update category status. Please try again.');
            }
        } catch (error) {
            console.error('Error updating category status:', error);
            alert('An error occurred while updating category status. Please try again.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteCategory = async (categoryId: string) => {
        const categoryToDelete = categories.find(category => category._id === categoryId);
        const categoryName = categoryToDelete ? categoryToDelete.name : 'this category';

        if (window.confirm(`Are you sure you want to delete ${categoryName}? This action cannot be undone.`)) {
            setActionLoading(categoryId);
            try {
                const response = await categoryAPI.delete(categoryId);
                if (response.success) {
                    console.log('Category deleted successfully');
                    fetchCategory(); // Refresh the list
                } else {
                    alert('Failed to delete category. Please try again.');
                }
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('An error occurred while deleting the category. Please try again.');
            } finally {
                setActionLoading(null);
            }
        }
    };

    const handleEditUser = (category: Category) => {
        setEditingUser(category);
        setEditUserForm({
            name: category.name,
            status: category.status
        });
        setEditUserErrors({});
        setShowEditModal(true);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        fetchCategory(pageNumber);
    };

    const closeAddModal = () => {
        setShowAddModal(false);
        setAddUserForm({
            name: '',
        });
        setAddUserErrors({});
    };

    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!addUserForm.name.trim()) {
            errors.name = 'Name is required';
        }

        setAddUserErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddCategory = async () => {
        if (!validateForm()) {
            return;
        }

        setAddUserLoading(true);
        try {
            const response = await categoryAPI.createCategory({
                name: addUserForm.name.trim(),
            });

            if (response.success) {
                // Reset form and close modal
                setAddUserForm({
                    name: '',
                });
                setAddUserErrors({});
                setShowAddModal(false);

                // Refresh category list
                fetchCategory();

                // Show success message
                alert('Category created successfully!');
            } else {
                alert(response.error || 'Failed to create category');
            }
        } catch (error) {
            console.error('Error creating category:', error);
            alert('An error occurred while creating the category. Please try again.');
        } finally {
            setAddUserLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setAddUserForm(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when category starts typing
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
        });
        setAddUserErrors({});
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setEditingUser(null);
        setEditUserForm({
            name: '',
            status: 'active'
        });
        setEditUserErrors({});
    };

    const validateEditForm = () => {
        const errors: { [key: string]: string } = {};

        if (!editCategoryForm.name.trim()) {
            errors.name = 'Name is required';
        }

        setEditUserErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleUpdateUser = async () => {
        if (!validateEditForm() || !editingCategory) {
            return;
        }

        setEditUserLoading(true);
        try {
            let hasChanges = false;

            // Update name and email if changed
            if (editCategoryForm.name !== editingCategory.name) {
                const updateResponse = await categoryAPI.updateCategory(editingCategory._id, {
                    name: editCategoryForm.name.trim(),
                });

                if (!updateResponse.success) {
                    alert(updateResponse.error || 'Failed to update category details. Please try again.');
                    return;
                }
                hasChanges = true;
            }

            // Update status if changed
            if (editCategoryForm.status !== editingCategory.status) {
                const statusResponse = await categoryAPI.updateStatus(editingCategory._id, editCategoryForm.status);
                if (!statusResponse.success) {
                    alert('Failed to update category status. Please try again.');
                    return;
                }
                hasChanges = true;
            }

            // Close modal and refresh
            setShowEditModal(false);
            setEditingUser(null);
            setEditUserForm({
                name: '',
                status: 'active'
            });
            setEditUserErrors({});
            fetchCategory();

            // Show success message
            if (hasChanges) {
                alert('Category updated successfully!');
            } else {
                alert('No changes were made.');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            alert('An error occurred while updating the category. Please try again.');
        } finally {
            setEditUserLoading(false);
        }
    };

    const handleEditInputChange = (field: string, value: string) => {
        setEditUserForm(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when category starts typing
        if (editUserErrors[field]) {
            setEditUserErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    return (
        <div className="container-fluid">
            {/* Header */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 className="h3 fw-bold text-primary mb-2">Categor Management</h1>
                            <p className="text-muted mb-0">
                                Manage all regular category in the system
                            </p>
                        </div>
                        <button
                            className="btn btn-primary d-flex align-items-center"
                            onClick={openAddModal}
                        >
                            <AddIcon className="me-2" />
                            Add Category
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
                                            placeholder="Search category name"
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
                                            {totalUsers} category found
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Table */}
            <div className="row">
                <div className="col-12">
                    <div className="card border-0 shadow-custom">
                        <div className="card-body p-0">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-custom mx-auto mb-3"></div>
                                    <p className="text-muted">Loading categories...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center py-5">
                                    <div className="text-danger mb-3">
                                        <FilterIcon style={{ fontSize: '3rem', opacity: 0.5 }} />
                                    </div>
                                    <h5 className="text-danger mb-2">Error Loading Categories</h5>
                                    <p className="text-muted mb-3">{error}</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => fetchCategory()}
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
                                                    <th className="border-0 px-4 py-3">Status</th>
                                                    <th className="border-0 px-4 py-3">Created</th>
                                                    <th className="border-0 px-4 py-3 text-end">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {categories.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className="text-center py-5">
                                                            <div className="text-muted">
                                                                <FilterIcon style={{ fontSize: '3rem', opacity: 0.5 }} />
                                                                <p className="mt-2 mb-0">No category found</p>
                                                                <small>Try adjusting your search or filters</small>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    categories.map((category) => (
                                                        <tr key={category._id}>
                                                            <td className="px-4 py-3">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3"
                                                                        style={{ width: '40px', height: '40px' }}>
                                                                        <span className="text-white fw-bold">
                                                                            {category.name.charAt(0).toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <h6 className="mb-0 fw-semibold">{category.name}</h6>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <button
                                                                    className={`btn btn-sm ${category.status === 'active' ? 'btn-success' : 'btn-danger'}`}
                                                                    onClick={() => handleStatusToggle(category._id, category.status)}
                                                                    style={{ minWidth: '80px' }}
                                                                >
                                                                    {category.status === 'active' ? 'Active' : 'Inactive'}
                                                                </button>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <small className="text-muted">
                                                                    {new Date(category.createdAt).toLocaleDateString()}
                                                                </small>
                                                            </td>
                                                            <td className="px-4 py-3 table-actions-column">
                                                                <div className="action-buttons-container">
                                                                    {/* Edit Button */}
                                                                    <button
                                                                        className="action-btn action-btn-primary"
                                                                        title="Edit category"
                                                                        onClick={() => handleEditUser(category)}
                                                                    >
                                                                        <EditIcon style={{ fontSize: '1rem' }} />
                                                                    </button>

                                                                    {/* Status Toggle Button */}
                                                                    {category.status === 'active' ? (
                                                                        <button
                                                                            className="action-btn action-btn-warning"
                                                                            title="Deactivate category"
                                                                            onClick={() => handleStatusToggle(category._id, category.status)}
                                                                            disabled={actionLoading === category._id}
                                                                        >
                                                                            {actionLoading === category._id ? (
                                                                                <div className="spinner-custom" style={{ width: '1rem', height: '1rem' }}></div>
                                                                            ) : (
                                                                                <BlockIcon style={{ fontSize: '1rem' }} />
                                                                            )}
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            className="action-btn action-btn-success"
                                                                            title="Activate category"
                                                                            onClick={() => handleStatusToggle(category._id, category.status)}
                                                                            disabled={actionLoading === category._id}
                                                                        >
                                                                            {actionLoading === category._id ? (
                                                                                <div className="spinner-custom" style={{ width: '1rem', height: '1rem' }}></div>
                                                                            ) : (
                                                                                <ActivateIcon style={{ fontSize: '1rem' }} />
                                                                            )}
                                                                        </button>
                                                                    )}

                                                                    {/* Delete Button */}
                                                                    <button
                                                                        className="action-btn action-btn-danger"
                                                                        title="Delete category"
                                                                        onClick={() => handleDeleteCategory(category._id)}
                                                                        disabled={actionLoading === category._id}
                                                                    >
                                                                        {actionLoading === category._id ? (
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
                                                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalUsers)} of {totalUsers} categories
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

            {/* Add Category Modal */}
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
                                <h5 className="modal-title fw-bold text-primary mb-0">Add New Category</h5>
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
                                <form onSubmit={(e) => { e.preventDefault(); handleAddCategory(); }}>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label fw-semibold text-dark">
                                            Category Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${addUserErrors.name ? 'is-invalid' : ''}`}
                                            id="name"
                                            placeholder="Enter category name"
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
                                                'Create Category'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Category Modal */}
            {showEditModal && editingCategory && (
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
                                <h5 className="modal-title fw-bold text-primary mb-0">Edit Category</h5>
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
                                            Category Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${editUserErrors.name ? 'is-invalid' : ''}`}
                                            id="edit-name"
                                            placeholder="Enter full name"
                                            value={editCategoryForm.name}
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

                                    {/* Status Field */}
                                    <div className="mb-4">
                                        <label htmlFor="edit-status" className="form-label fw-semibold text-dark">
                                            Status <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className="form-select"
                                            id="edit-status"
                                            value={editCategoryForm.status}
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
                                                'Update Category'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div >


    );
};

export default Categorys; 