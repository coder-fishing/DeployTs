import CategoryService from "~/services/CategoryService";
import { BaseController } from './BaseController';
import type { Category as CategoryType } from '~/types/category.type';
import { Category } from '~/model/category.model';
import CategoryUIHandler from "../UIHandler/CategoryUIHandler";
import uploadToCloudinary from "../utils/uploadToCloudinary";
import { hideOverlayLoading, showOverlayLoading } from '~/view/components/loading';
import { router } from "../router/Router";


export class CategoryController extends BaseController<CategoryType> {
    private static instance: CategoryController;
    private categoryService: CategoryService;
    uiHandler: CategoryUIHandler;
    private hasFormChanges: boolean = false;
    private originalFormData: any = null;

    constructor() {
        super();
        this.categoryService = new CategoryService();
        this.uiHandler = new CategoryUIHandler();
    }

    public static getInstance(): CategoryController {
        if (!CategoryController.instance) {
            CategoryController.instance = new CategoryController();
        }
        return CategoryController.instance;
    }

    /**
     * Implement abstract method từ BaseController
     */
    protected async getServicePaginated(page: number, limit: number) {
        return this.categoryService.getCategoriesPaginated(page, limit);
    }

    /**
     * Get all categories
     */
    public async getAllCategories() {
        try {
            const categories = await this.categoryService.getAllCategories();
            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }

    /**
     * Get categories with pagination (backward compatibility)
     */
    public async getCategoriesPaginated(page: number = 1, limit: number = 10, sort?: string , order?: string  ) {
        try {
            const result = await this.categoryService.getCategoriesPaginated(page, limit, sort, order);
            return result;
        } catch (error) {
            console.error('Error fetching paginated categories:', error);
            throw error;
        }
    }

    /**
     * Alias methods for backward compatibility
     */
    public async loadCategoriesForPage(page: number) {
        return this.loadDataForPage(page);
    }

    public async loadCategoriesForPageWithUI(page: number) {
        return this.loadDataForPageWithUI(page);
    }

    /**
     * Get category by ID
     */
    public async getCategoryById(id: number) {
        try {
            const category = await this.categoryService.getCategoryById(id);
            return category;
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error;
        }
    }

    /**
     * Create new category
     */
    public async createCategory(categoryData: any) {
        try {
            const category = await this.categoryService.createCategory(categoryData);
            return category;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    }

    /**
     * Update category
     */
    public async updateCategory(id: number, categoryData: any) {
        try {
            const category = await this.categoryService.updateCategory(id, categoryData);
            return category;
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    }

    /**
     * Delete category
     */
    public async deleteCategory(id: number) {
        try {
            await this.categoryService.deleteCategory(id);
            return true;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }

    /**
     * Search categories by query
     */
    public async searchCategories(query: string, page: number, limit: number): Promise<CategoryType[]> {
        return this.categoryService.searchCategories(query, page, limit);
    }

    /**
     * Search categories with pagination support
     */
    public async searchCategoriesWithPagination(query: string, page: number = 1): Promise<void> {
        try {
            console.log(`🔍 Searching categories for: "${query}" (page ${page})`);
            
            // Get all search results first
            const allResults = await this.searchCategories(query, 1, 1000);
            console.log(`✅ Found ${allResults.length} total category search results`);
            
            // Apply pagination
            const pageSize = this.itemsPerPage || 6;
            const totalItems = allResults.length;
            const totalPages = Math.ceil(totalItems / pageSize);
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedResults = allResults.slice(startIndex, endIndex);
            
            // Create result object
            const searchResult = {
                data: paginatedResults,
                paginationInfo: {
                    currentPage: page,
                    itemsPerPage: pageSize,
                    totalItems: totalItems,
                    totalPages: totalPages,
                    start: startIndex + 1,
                    end: Math.min(endIndex, totalItems)
                },
                sortInfo: {
                    sortField: this.sortField,
                    sortOrder: this.sortOrder
                },
                isSearchResult: true,
                searchQuery: query,
                allSearchResults: allResults
            };

            this.triggerSuccess(searchResult);
            
        } catch (error) {
            console.error('❌ Error during category paginated search:', error);
            this.triggerError(error);
        }
    }

    /**
     * Enhanced search handler for multiple search components with debounce
     */
    public handleSearch(): void {
        // Multiple selectors to find all search inputs on the page
        const searchSelectors = [
            '.search-input',
            '.search-bar_input', 
            '.search-bar-input',
            'input[placeholder*="Search"]',
            'input[placeholder*="search"]',
            'input[type="search"]',
            '[data-search="true"]'
        ];
        
        let foundInputs = 0;
        const debounceDelay = 300;
        let searchTimeout: number | null = null;
        
        // Try each selector to find all search inputs
        searchSelectors.forEach(selector => {
            const searchInputs = document.querySelectorAll<HTMLInputElement>(selector);
            
            if (searchInputs.length > 0) {
                console.log(`🔍 Found ${searchInputs.length} category search input(s) with selector: ${selector}`);
                foundInputs += searchInputs.length;
                
                // Add event listeners to all found inputs
                searchInputs.forEach((searchInput, index) => {
                    console.log(`✅ Setting up category search listener for input ${index + 1}:`, {
                        class: searchInput.className,
                        placeholder: searchInput.placeholder,
                        id: searchInput.id
                    });
                    
                    // Add debounced search listener
                    searchInput.addEventListener('input', async (event) => {
                        const query = (event.target as HTMLInputElement).value.trim();
                        
                        // Clear previous timeout
                        if (searchTimeout) {
                            clearTimeout(searchTimeout);
                        }
                        
                        // Set new timeout for debounced search
                        searchTimeout = window.setTimeout(async () => {
                            if (query.length >= 2) {
                                try {
                                    console.log(`🔍 Searching categories for: "${query}"`);
                                    // Get all search results first
                                    const allResults = await this.searchCategories(query, 1, 1000); // Get large number to get all results
                                    console.log(`✅ Category search completed: found ${allResults.length} categories`);
                                    
                                    // Apply pagination to search results
                                    const pageSize = this.itemsPerPage || 6;
                                    const totalItems = allResults.length;
                                    const totalPages = Math.ceil(totalItems / pageSize);
                                    const paginatedResults = allResults.slice(0, pageSize); // Show only first page
                                    
                                    // Trigger success callback to update table with search results
                                    const searchResult = {
                                        data: paginatedResults, // Show only first 6 items
                                        paginationInfo: {
                                            currentPage: 1,
                                            itemsPerPage: pageSize,
                                            totalItems: totalItems,
                                            totalPages: totalPages,
                                            start: 1,
                                            end: Math.min(pageSize, totalItems)
                                        },
                                        sortInfo: {
                                            sortField: '',
                                            sortOrder: 'asc' as const
                                        },
                                        isSearchResult: true,
                                        searchQuery: query,
                                        allSearchResults: allResults // Store all results for pagination
                                    };
                                    
                                    this.triggerSuccess(searchResult);
                                    
                                } catch (error) {
                                    console.error('❌ Error during category search:', error);
                                    this.triggerError(error);
                                }
                            } else if (query.length === 0) {
                                console.log('🧹 Category search cleared');
                                
                                // Reload original data when search is cleared
                                this.loadDataForPageWithUI(1);
                            }
                        }, debounceDelay);
                    });
                    
                    // Add focus event for debugging
                    searchInput.addEventListener('focus', () => {
                        console.log(`🎯 Category search input ${index + 1} focused`);
                    });
                });
            }
        });
    }
    
    /**
     * Initialize search with automatic setup and retry
     */
    public initializeSearch(): void {
        console.log('🚀 Initializing category search functionality...');
        
        // Setup search immediately
        this.handleSearch();
        
        // Setup again after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('📄 DOM loaded, setting up category search again...');
                setTimeout(() => this.handleSearch(), 100);
            });
        }
        
        // Watch for new search inputs being added dynamically
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const addedNodes = Array.from(mutation.addedNodes);
                    const hasSearchInputs = addedNodes.some(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const element = node as Element;
                            return element.matches('input') || 
                                   element.querySelector('input') ||
                                   element.matches('.search-input') ||
                                   element.querySelector('.search-input');
                        }
                        return false;
                    });
                    
                    if (hasSearchInputs) {
                        console.log('🔄 New category search inputs detected, setting up handlers...');
                        setTimeout(() => this.handleSearch(), 500);
                    }
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('✅ Category search initialization completed with MutationObserver');
    }

    /** 
     * Upload Image Preview
     */  
    setupImageHandling(elements: any) {
        this.uiHandler.setupImageHandling(elements);
    }

    /**
     * Get UI handler instance
     */
    initializeImageHandling() {
        const elements = {
            emptyState: document.getElementById('emptyState'),
            previewState: document.getElementById('previewState'),
            imageInput: document.getElementById('imageInput'),
            previewImage: document.getElementById('previewImage'),
            uploadArea: document.querySelector('.thumbnail__upload-area')
        };

        if (elements.emptyState && elements.previewState && elements.imageInput) {
            console.log('Setting up image handling for add category');
            this.setupImageHandling(elements);
        } else {
            console.error('Image elements not found for setup');
        }
    }

    /**
     * Validate category data before creating or updating
     */
    validateCategoryData(categoryData: any): boolean {
        // Basic validation for category data
        if (!categoryData.name || typeof categoryData.name !== 'string' || categoryData.name.trim() === '') {
            console.error('Invalid category name');
            return false;
        }
        if (categoryData.description && typeof categoryData.description !== 'string') {
            console.error('Invalid category description');
            return false;
        }
        if (categoryData.image && typeof categoryData.image !== 'string') {
            console.error('Invalid category image URL');
            return false;
        }
        return true;
    }

    /**
     * 
     */
    async handleUploadImage(file: File): Promise<string> {
        if (!file) {
            throw new Error('No file provided for upload');
        }
        try {
            const imageUrl = await uploadToCloudinary(file);
            console.log('Image uploaded successfully:', imageUrl);
            return imageUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    /**
     * Setup event listener for save category button (works for both add and edit)
     */
    setupSaveCategoryButton(): void {
        const submitBtn = document.querySelector('#saveCategoryBtn') as HTMLButtonElement;
        
        if (!submitBtn) {
            console.error('Save category button not found');
            return;
        }

        console.log('✅ Setting up save category button listener');
        
        submitBtn.addEventListener('click', async () => {
            await this.handleSaveCategory();
        });
    }

    /**
     * Handle save category form submission (unified for both add and edit)
     */
    async handleSaveCategory(): Promise<void> {
        console.log('🚀 Starting category save process...');
        
        const submitBtn = document.querySelector('#saveCategoryBtn') as HTMLButtonElement;
        const imageInput = document.getElementById('imageInput') as HTMLInputElement;
        const descriptionInput = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
        const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
        
        // Check if we're in edit mode by looking for category ID in form or URL
        const categoryIdInput = document.querySelector('[data-category-id]') as HTMLElement;
        const categoryId = categoryIdInput?.getAttribute('data-category-id') || 
                          new URLSearchParams(window.location.search).get('id') ||
                          window.location.pathname.split('/').pop();
        
        const isEditMode = !!(categoryId && categoryId !== 'addcategory' && !isNaN(parseInt(categoryId)));
        
        console.log(isEditMode ? `📝 Edit mode - Category ID: ${categoryId}` : '➕ Add mode');

        // Validation
        if (!nameInput?.value.trim()) {
            alert('Please enter category name');
            nameInput?.focus();
            return;
        }

        if (!descriptionInput?.value.trim()) {
            alert('Please enter category description');
            descriptionInput?.focus();
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        showOverlayLoading();

        try {
            // Prepare category data
            const categoryData: any = {
                name: nameInput.value.trim(),
                description: descriptionInput.value.trim(),
                image: '',
                sold: 0,
                stock: 0,
                createdAt: Date.now()
            };

            // Handle image upload if file is selected
            if (imageInput.files && imageInput.files[0]) {
                console.log('📤 Uploading image...');
                const imageUrl = await this.handleUploadImage(imageInput.files[0]);
                categoryData.image = imageUrl;
                console.log('✅ Image uploaded successfully:', imageUrl);
            } else if (isEditMode) {
                // In edit mode, keep existing image if no new image uploaded
                const previewImg = document.getElementById('previewImage') as HTMLImageElement;
                if (previewImg?.src && !previewImg.src.includes('data:')) {
                    categoryData.image = previewImg.src;
                }
            }

            // Create Category instance for validation
            const categoryInstance = new Category(categoryData);
            console.log('🏗️ Created category instance:', categoryInstance);

            // Validate category data
            if (!this.validateCategoryData(categoryInstance)) {
                alert('Invalid category data. Please check your inputs.');
                return;
            }

            let result;
            if (isEditMode) {
                // Check if there are actually changes before updating
                const hasChanges = this.checkFormChanges();
                
                if (!hasChanges) {
                    console.log('🚫 No changes detected, skipping API call');
                    alert('No changes to save');
                    hideOverlayLoading();
                    return;
                }
                
                // UPDATE: Use PUT method only when there are changes
                console.log(`💾 Updating category with ID ${categoryId}...`);
                result = await this.updateCategory(parseInt(categoryId), categoryData);
                console.log('✅ Category updated successfully:', result);
                alert('Category updated successfully!');
            } else {
                // CREATE: Use POST method
                console.log('💾 Creating new category...');
                result = await this.createCategory(categoryData);
                console.log('✅ Category created successfully:', result);
                alert('Category created successfully!');
            }

            hideOverlayLoading();
            
            // Navigate back to category list
            router.navigate('/category'); 
            
        } catch (error) {
            console.error(`❌ Error ${isEditMode ? 'updating' : 'creating'} category:`, error);
            alert(`Failed to ${isEditMode ? 'update' : 'create'} category. Please try again.`);
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            hideOverlayLoading();
        }
    }

    /**
     * @deprecated Use handleSaveCategory instead
     */
    async handleAddCategory(): Promise<void> {
        console.warn('⚠️ handleAddCategory is deprecated, use handleSaveCategory instead');
        return this.handleSaveCategory();
    }

    /**
     *  Handle delete category
     */ 

    async handleDeleteCategory(categoryId: number): Promise<void> {
        console.log(`🗑️ Deleting category with ID: ${categoryId}`);
        
        if (!categoryId) {
            console.error('❌ Invalid category ID for deletion');
            return;
        }

        try {
            // Show loading state
            showOverlayLoading();
            
            // Delete category
            await this.deleteCategory(categoryId);
            console.log(`✅ Category with ID ${categoryId} deleted successfully`);
            
            // Refresh category list
            this.loadDataForPageWithUI(1);
            
            alert('Category deleted successfully!');
        } catch (error) {
            console.error('❌ Error deleting category:', error);
            alert('Failed to delete category. Please try again.');
        } finally {
            hideOverlayLoading();
        }
    }

    /**
     * Store original form data để kiểm tra changes
     */
    storeOriginalFormData(): void {
        const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
        const descriptionInput = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
        const previewImage = document.getElementById('previewImage') as HTMLImageElement;
        
        this.originalFormData = {
            name: nameInput?.value?.trim() || '',
            description: descriptionInput?.value?.trim() || '',
            image: previewImage?.src || ''
        };
        
        console.log('📋 Stored original form data:', this.originalFormData);
    }

    /**
     * Kiểm tra xem form có thay đổi không
     */
    checkFormChanges(): boolean {
        if (!this.originalFormData) {
            console.log('🔍 No original data stored, assuming changes exist');
            return true;
        }
        
        const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
        const descriptionInput = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
        const previewImage = document.getElementById('previewImage') as HTMLImageElement;
        const imageInput = document.getElementById('imageInput') as HTMLInputElement;
        
        const currentData = {
            name: nameInput?.value?.trim() || '',
            description: descriptionInput?.value?.trim() || '',
            image: previewImage?.src || ''
        };
        
        const hasNewImage = imageInput?.files && imageInput.files[0];
        
        this.hasFormChanges = 
            currentData.name !== this.originalFormData.name ||
            currentData.description !== this.originalFormData.description ||
            currentData.image !== this.originalFormData.image ||
            !!hasNewImage;
        
        console.log('🔍 Form changes detected:', {
            nameChanged: currentData.name !== this.originalFormData.name,
            descriptionChanged: currentData.description !== this.originalFormData.description,
            imageChanged: currentData.image !== this.originalFormData.image,
            hasNewImage: !!hasNewImage,
            hasChanges: this.hasFormChanges
        });
        
        return this.hasFormChanges;
    }

    /**
     * Global click handler for all category interactions using event delegation
     */
    handleGlobalClick = async (event: Event): Promise<void> => {
        if (!event.target) return;

        const target = event.target as Element;
        console.log('🔍 Click detected:', target);

        // Edit button handler - Support nhiều selector khác nhau
        const editButton = target.closest('.product-table__item--action--edit, .product-table__edit, .edit-btn, [data-action="edit"]');
        
        if (editButton) {
            event.preventDefault();
            console.log('✏️ Edit button clicked:', editButton);
            
            const categoryId = editButton.getAttribute('data-id') || 
                             editButton.closest('[data-id]')?.getAttribute('data-id');
            
            if (categoryId) {
                console.log(`✏️ Navigating to edit category with ID: ${categoryId}`);
                router.navigate(`/editcategory/${categoryId}`);
            }
            return;
        }

        // Delete button handler
        const deleteButton = target.closest('.product-table__item--action--delete, .delete-btn');
        if (deleteButton) {
            event.preventDefault();
            console.log('🗑️ Delete button clicked:', deleteButton);
            
            const categoryId = deleteButton.getAttribute('data-id') || 
                             deleteButton.closest('[data-id]')?.getAttribute('data-id');
            
            if (categoryId) {
                // Confirm deletion
                const confirmDelete = confirm(`Are you sure you want to delete this category?`);
                if (confirmDelete) {
                    console.log(`🗑️ Deleting category with ID: ${categoryId}`);
                    try {
                        await this.handleDeleteCategory(parseInt(categoryId));
                    } catch (error) {
                        console.error('❌ Error in delete button handler:', error);
                    }
                }
            }
            return;
        }
    }

    /**
     * Setup global event delegation for all category interactions
     */
    setupTableInteractions(): void {
        console.log('🔧 Setting up global click handler for category interactions...');
        
        // Remove any existing listeners to prevent duplicates
        document.removeEventListener('click', this.handleGlobalClick);
        
        // Add global click listener using event delegation
        document.addEventListener('click', this.handleGlobalClick);
        
        console.log('✅ Global click handler setup completed');
        
        // Debug - tìm tất cả nút edit/delete có thể có
        setTimeout(() => {
            console.log('🔍 Scanning for edit/delete buttons...');
            
            // Check for edit buttons
            const editButtons = document.querySelectorAll('.product-table__item--action--edit, .product-table__edit');
            console.log(`Found ${editButtons.length} edit buttons`);
            
            // Check for delete buttons
            const deleteButtons = document.querySelectorAll('.product-table__item--action--delete');
            console.log(`Found ${deleteButtons.length} delete buttons`);
            
            // Check for table rows with data-id
            const rows = document.querySelectorAll('tr[data-id]');
            console.log(`Found ${rows.length} rows with data-id`);
        }, 1000);
    }

    /**
     * Initialize category controller with all necessary event handlers
     */
    initializeController(): void {
       
        this.setupTableInteractions();
        
        // Initialize search functionality
        this.initializeSearch();
        
        // Setup save button if on form page
        const saveBtn = document.querySelector('#saveCategoryBtn');
        if (saveBtn) {
            this.setupSaveCategoryButton();
        }
        
        // Initialize image handling if on form page
        const imageElements = document.querySelector('#imageInput');
        if (imageElements) {
            this.initializeImageHandling();
        }
        
        console.log('✅ Category Controller initialized successfully');
    }

}
export default CategoryController;