import ProductService from '../services/ProductService';
import { BaseController } from './BaseController';
import type { Product } from '../types/product.type';

export class ProductController extends BaseController<Product> {
    private static instance: ProductController;
    private productService: ProductService;

    constructor() {
        super();
        this.productService = new ProductService();
    }

    public static getInstance(): ProductController {
        if (!ProductController.instance) {
            ProductController.instance = new ProductController();
        }
        return ProductController.instance;
    }

    /**
     * Implement abstract method từ BaseController
     */
    protected async getServicePaginated(page: number, limit: number) {
        return this.productService.getProductsPaginated(page, limit) || this.productService.searchProducts('', page, limit);
    }

    /**
     * Get all products
     */
    public async getAllProducts() {
        try {
            const products = await this.productService.getAllProducts();
            console.log('Fetched products:', products);
            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    public async getPublished(){
        try{
            const products = await this.productService.getAllProducts();
            
            const publishedProducts = products.filter(product => {
                return product.status.toLowerCase() === 'published';
            });
            console.log('✅ Fetched published products:', publishedProducts);
            return publishedProducts;
           
        } catch (error) {
            console.error('❌ Error fetching published products:', error);
            throw error;
        }
    }

    /**
     * Alias methods for backward compatibility
     */
    public async loadProductsForPage(page: number) {
        return this.loadDataForPage(page);
    }

    public async loadProductsForPageWithUI(page: number) {
        return this.loadDataForPageWithUI(page);
    }

    /**
     * Get product by ID
     */
    public async getProductById(id: number) {
        try {
            const product = await this.productService.getProductById(id);
            return product;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    }

    /**
     * Create new product
     */
    public async createProduct(productData: any) {
        try {
            const product = await this.productService.createProduct(productData);
            return product;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    /**
     * Update product
     */
    public async updateProduct(id: number, productData: any) {
        try {
            const product = await this.productService.updateProduct(id, productData);
            return product;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    /**
     * Delete product
     */
    public async deleteProduct(id: number) {
        try {
            await this.productService.deleteProduct(id);
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }

    /**
     * Search products by query and trigger success callback to render results
    **/
    public async searchProducts(query: string, page: number, limit: number): Promise<Product[]> {
        return this.productService.searchProducts(query, page, limit);
    }

    /**
     * Search products with pagination support
     */
    public async searchProductsWithPagination(query: string, page: number = 1): Promise<void> {
        try {
            console.log(`🔍 Searching for: "${query}" (page ${page})`);
            
            // Get all search results first
            const allResults = await this.searchProducts(query, 1, 1000);
            console.log(`✅ Found ${allResults.length} total search results`);
            
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
            console.error('❌ Error during paginated search:', error);
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
                console.log(`🔍 Found ${searchInputs.length} search input(s) with selector: ${selector}`);
                foundInputs += searchInputs.length;
                
                // Add event listeners to all found inputs
                searchInputs.forEach((searchInput, index) => {
                    console.log(`✅ Setting up search listener for input ${index + 1}:`, {
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
                                    console.log(`🔍 Searching for: "${query}"`);
                                    // Get all search results first
                                    const allResults = await this.searchProducts(query, 1, 1000); // Get large number to get all results
                                    console.log(`✅ Search completed: found ${allResults.length} products`);
                                    
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
                                    console.error('❌ Error during search:', error);
                                    this.triggerError(error);
                                }
                            } else if (query.length === 0) {
                                console.log('🧹 Search cleared');
                                
                                // Reload original data when search is cleared
                                this.loadDataForPageWithUI(1);
                            }
                        }, debounceDelay);
                    });
                    
                    // Add focus event for debugging
                    searchInput.addEventListener('focus', () => {
                        console.log(`🎯 Search input ${index + 1} focused`);
                    });
                });
            }
        });
    }
    
    /**
     * Initialize search with automatic setup and retry
     */
    public initializeSearch(): void {
        console.log('🚀 Initializing search functionality...');
        
        // Setup search immediately
        this.handleSearch();
        
        // Setup again after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('📄 DOM loaded, setting up search again...');
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
                        console.log('🔄 New search inputs detected, setting up handlers...');
                        setTimeout(() => this.handleSearch(), 500);
                    }
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('✅ Search initialization completed with MutationObserver');
    }

    // /**
    //  * Handle tag filter for products
    //  */
    // public async handleTagFilter(tagText: string): Promise<void> {
    //     try {
    //         console.log(`🔍 ProductController filtering by tag: ${tagText}`);
            
    //         this.triggerLoading();
    //         let filteredData: Product[] = [];

    //         // Handle special Published tag
    //         if (tagText === 'Published') {
    //             console.log('📊 Getting published products...');
    //             filteredData = await this.getPublished();
    //             console.log('✅ Published products loaded:', filteredData.length);
    //         } 
    //         // Handle other tags (category filtering)
    //         else if (tagText !== 'All') {
    //             // Get all products and filter by category
    //             const allData = await this.getAllProducts();
    //             filteredData = allData.filter((item: Product) => {
    //                 const category = item.category || '';
    //                 return category.toLowerCase().includes(tagText.toLowerCase());
    //             });
    //             console.log(`🏷️ Filtered by category "${tagText}":`, filteredData.length);
    //         } 
    //         // Handle "All" tag
    //         else {
    //             filteredData = await this.getAllProducts();
    //             console.log('📦 All products loaded:', filteredData.length);
    //         }

    //         // Create result object similar to pagination result
    //         const result = {
    //             data: filteredData,
    //             paginationInfo: {
    //                 currentPage: 1,
    //                 itemsPerPage: filteredData.length,
    //                 totalItems: filteredData.length,
    //                 totalPages: 1,
    //                 start: 1,
    //                 end: filteredData.length
    //             },
    //             sortInfo: {
    //                 sortField: '',
    //                 sortOrder: 'asc' as const
    //             }
    //         };

    //         this.triggerSuccess(result);

    //     } catch (error) {
    //         console.error('❌ Error filtering by tag:', error);
    //         this.triggerError(error);
    //     }
    // }
}



export default ProductController;