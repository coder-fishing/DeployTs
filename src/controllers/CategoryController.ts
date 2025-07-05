import CategoryService from "~/services/CategoryService";
import { BaseController } from './BaseController';
import type { Category } from '~/types/category.type';

export class CategoryController extends BaseController<Category> {
    private static instance: CategoryController;
    private categoryService: CategoryService;

    constructor() {
        super();
        this.categoryService = new CategoryService();
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
    public async searchCategories(query: string, page: number, limit: number): Promise<Category[]> {
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
}

export default CategoryController;