import { breadCrumbs } from '~/view/components/breadCrumb';
import { groupButton } from '~/view/components/groupButton';
import { TagFilter } from '~/view/components/tagFilter';
import { searchBar } from '~/view/components/searchBar';
import { Pagination } from '~/view/components/pagination';
import { caretLeft } from '~/assets/icon';
import { hideOverlayLoading, showOverlayLoading } from '~/view/components/loading';
import type { BaseController } from '~/controllers/BaseController';

interface BaseListPageConfig<T> {
  controller: BaseController<T>;
  breadcrumbConfig: any;
  buttonConfig: any;
  tableRenderer: (data: T[], sortField?: string, sortOrder?: 'asc' | 'desc') => string;
  tagFilter?: {
    filters: any[];
    currentFilter: any;
  };
  className?: string;
  title?: string;
  pageSize?: number;
}

export class BaseListPage<T> {
  private controller: BaseController<T>;
  private breadcrumbConfig: any;
  private buttonConfig: any;
  private tableRenderer: (data: T[], sortField?: string, sortOrder?: 'asc' | 'desc') => string;
  private tagFilter?: { filters: any[]; currentFilter: any };
  private className: string;
  private title: string;
  private pageSize: number;
  private currentSearchQuery: string = ''; // Track current search query

  constructor(config: BaseListPageConfig<T>) {
    this.controller = config.controller;
    this.breadcrumbConfig = config.breadcrumbConfig;
    this.buttonConfig = config.buttonConfig;
    this.tableRenderer = config.tableRenderer;
    this.tagFilter = config.tagFilter;
    this.className = config.className || 'product-list';
    this.title = config.title || 'List';
    this.pageSize = config.pageSize || 6;
  }

  // Setup UI callbacks for controller
  private setupControllerCallbacks(): void {
    this.controller.registerUICallbacks({
      onLoading: () => {
        const tableContainer = document.querySelector('.product-table-container');
        if (tableContainer) {
          showOverlayLoading();
        }
      },
      onError: (error: any) => {
        console.error('Error loading data:', error);
        const tableContainer = document.querySelector('.product-table-container');
        if (tableContainer) {
          tableContainer.innerHTML = `
            <div class="error-message">
              <h3>Error loading data</h3>
              <p>Unable to load data. Please try again later.</p>
              <button onclick="window.retryLoadData()" class="retry-button">Retry</button>
            </div>
          `;
        }
      },
      onSuccess: (result: any) => {
        // Update table
        const tableContainer = document.querySelector('.product-table-container');
        if (tableContainer) {
          tableContainer.innerHTML = this.tableRenderer(
            result.data, 
            result.sortInfo?.sortField || '', 
            result.sortInfo?.sortOrder || 'asc'
          );
        }
        hideOverlayLoading();
        
        // Check if this is a search result
        if (result.isSearchResult) {
          // Track current search query
          this.currentSearchQuery = result.searchQuery || '';
          // Show search info and pagination
          this.showSearchResults(result.data.length, result.searchQuery);
          this.updatePaginationDisplay(result.paginationInfo);
          console.log('Search pagination info:', result.paginationInfo);
        } else {
          // Clear search query
          this.currentSearchQuery = '';
          // Show pagination and hide search info
          this.hideSearchResults();
          this.showPagination();
          if (result.paginationInfo) {
            this.updatePaginationDisplay(result.paginationInfo);
          }
        }
        
        // Setup sort event listeners
        this.setupSortEventListeners();
      }
    });
  }

  // Function to update only the table and pagination
  private updateTableAndPagination = async (page: number): Promise<void> => {
    // Check if we're in search mode
    if (this.currentSearchQuery) {
      // Use search pagination
      const controller = this.controller as any;
      if (controller.searchProductsWithPagination) {
        await controller.searchProductsWithPagination(this.currentSearchQuery, page);
      } else if (controller.searchCategoriesWithPagination) {
        await controller.searchCategoriesWithPagination(this.currentSearchQuery, page);
      } else {
        console.warn('Controller does not support search pagination');
        await this.controller.loadDataForPageWithUI(page);
      }
    } else {
      // Use regular pagination
      await this.controller.loadDataForPageWithUI(page);
    }
  };

  // Function to update pagination display and add event listeners
  private updatePaginationDisplay(paginationInfo: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    start: number;
    end: number;
  }): void {
    const paginationContainer = document.querySelector('.pagination-container');
    if (paginationContainer) {
      // Clear existing content
      paginationContainer.innerHTML = '';
      
      // Create pagination component
      const paginationElement = Pagination({
        currentPage: paginationInfo.currentPage,
        itemsPerPage: paginationInfo.itemsPerPage,
        totalItems: paginationInfo.totalItems,
        totalPages: paginationInfo.totalPages,
        caretLeft,
        onPageChange: async (page: number) => {
          await this.updateTableAndPagination(page);
        }
      });
      
      // Append to container
      paginationContainer.appendChild(paginationElement);
    }
  }

  // Setup global retry function
  private setupGlobalRetry(): void {
    (window as any).retryLoadData = () => {
      this.controller.retryLoadCurrentPage();
    };
  }

  // Setup sort event listeners
  private setupSortEventListeners(): void {
    const sortableHeaders = document.querySelectorAll('.sortable-header[data-field]');
    sortableHeaders.forEach(header => {
      header.addEventListener('click', async (e) => {
        const field = (e.currentTarget as HTMLElement).dataset.field;
        if (field) {
          await this.controller.sortAndReload(field);
        }
      });
    });
  }

  // Setup tag filter event listeners
  private setupTagFilterListeners(): void {
    if (!this.tagFilter) return;

    const tagItems = document.querySelectorAll('.tag-add-searchbar__tag--item');
    tagItems.forEach(item => {
      item.addEventListener('click', async (e) => {
        const tagElement = e.currentTarget as HTMLElement;
        const tagText = tagElement.querySelector('.tag-add-searchbar__tag--item-element')?.textContent || '';
        
        console.log(`🏷️ Tag clicked: ${tagText}`);
        
        // Remove active class from all tags
        tagItems.forEach(tag => tag.classList.remove('item-active'));
        
        // Add active class to clicked tag
        tagElement.classList.add('item-active');
        
        // Handle different tag filters
        await this.handleTagFilter(tagText);
      });
    });
  }

  // Handle tag filter logic
  private async handleTagFilter(tagText: string): Promise<void> {
    try {
      console.log(`🔍 Filtering by tag: ${tagText}`);
      
      // Show loading
      const tableContainer = document.querySelector('.product-table-container');
      if (tableContainer) {
        showOverlayLoading();
      }

      let filteredData: T[] = [];

      // Handle special Published tag
      if (tagText === 'Published') {
        console.log('📊 Getting published products...');
        
        // Check if controller has getPublished method (for ProductController)
        const controller = this.controller as any;
        if (controller.getPublished && typeof controller.getPublished === 'function') {
          filteredData = await controller.getPublished();
          console.log('✅ Published products loaded:', filteredData.length);
        } else {
          console.warn('⚠️ getPublished method not found on controller');
        }
      } 
      // Handle other tags (category filtering)
      else if (tagText !== 'All') {
        // Get all data and filter by category
        const allData = await (this.controller as any).getAllProducts?.() || [];
        filteredData = allData.filter((item: any) => {
          const category = item.category || '';
          return category.toLowerCase().includes(tagText.toLowerCase());
        });
        console.log(`🏷️ Filtered by category "${tagText}":`, filteredData.length);
      } 
      // Handle "All" tag
      else {
        filteredData = await (this.controller as any).getAllProducts?.() || [];
        console.log('📦 All products loaded:', filteredData.length);
      }

      // Update table with filtered data
      if (tableContainer) {
        tableContainer.innerHTML = this.tableRenderer(filteredData, '', 'asc');
        hideOverlayLoading();
      }

      // Update pagination for filtered data
      // this.updatePaginationForFilteredData(filteredData);

      // Setup sort listeners again
      this.setupSortEventListeners();

    } catch (error) {
      console.error('❌ Error filtering by tag:', error);
      hideOverlayLoading();
      
      const tableContainer = document.querySelector('.product-table-container');
      if (tableContainer) {
        tableContainer.innerHTML = `
          <div class="error-message">
            <h3>Error filtering data</h3>
            <p>Unable to filter by "${tagText}". Please try again.</p>
          </div>
        `;
      }
    }
  }

  // Update pagination for filtered data
  private updatePaginationForFilteredData(filteredData: T[]): void {
    const paginationContainer = document.querySelector('.pagination-container');
    if (paginationContainer) {
      // For simplicity, show all filtered data on one page
      // Or implement client-side pagination
      const totalItems = filteredData.length;
      
      // Clear existing pagination
      paginationContainer.innerHTML = '';
      
      if (totalItems > 0) {
        const paginationInfo = document.createElement('div');
        paginationInfo.className = 'pagination-info';
        paginationInfo.innerHTML = `
          <span>Showing ${totalItems} filtered results</span>
        `;
        paginationContainer.appendChild(paginationInfo);
      }
    }
  }

  // Show search results info
  private showSearchResults(resultCount: number, query?: string): void {
    this.hideSearchResults();
    // this.hidePagination();
  }

  // Hide search results info
  private hideSearchResults(): void {
    const searchInfo = document.querySelector('.search-results-info');
    if (searchInfo) {
      searchInfo.remove();
    }
  }

  // Hide pagination
  private hidePagination(): void {
    const paginationContainer = document.querySelector('.pagination-container') as HTMLElement;
    if (paginationContainer) {
      paginationContainer.style.display = 'none';
    }
  }


  // Show pagination
  private showPagination(): void {
    const paginationContainer = document.querySelector('.pagination-container') as HTMLElement;
    if (paginationContainer) {
      paginationContainer.style.display = 'block';
    }
  }

  // Setup global clear search function
  private setupGlobalClearSearch(): void {
    (window as any).clearSearch = () => {
      // Clear search input
      const searchInput = document.querySelector('.search-bar input') as HTMLInputElement;
      if (searchInput) {
        searchInput.value = '';
      }
      
      // Trigger search with empty query to reset
      this.controller.handleSearch('');
    };
  }

  // Generate the HTML content
  private generateHTML(): string {
    const tagFilterHtml = this.tagFilter ? 
      TagFilter(
        this.tagFilter.filters.map(filter => filter.name || filter),
        this.tagFilter.currentFilter?.name || this.tagFilter.currentFilter
      ) : '';

    const searchSection = this.tagFilter ? `
      <div class="tag-add-searchbar">
        <div class="tag-filter-container">
          ${tagFilterHtml}
        </div>
        <div class="tag-add-searchbar__search">
          ${searchBar("Search").outerHTML}
        </div>
      </div>
    ` : `
      <div class="tag-add-searchbar">
        <div class="tag-add-searchbar-none"></div>
        <div class="tag-add-searchbar__search">
          ${searchBar("Search").outerHTML}
        </div>
      </div>
    `;

    return `
      <div class="product-title">
        <div class="product-title-left">
          <p class="product-title-left__name">${this.title}</p>
          ${breadCrumbs(
            this.breadcrumbConfig.items,
            this.breadcrumbConfig.icon
          )}
        </div>   
        ${groupButton(this.buttonConfig)} 
      </div>
      ${searchSection}
      <div class="product-table-container">
        <div class="loading">Loading data...</div>
      </div>
      <div class="pagination-container"></div>
    `;
  }

  // Main render method
  public async render(): Promise<HTMLElement> {
    const container = document.createElement('div');
    container.className = this.className;

    // Initialize pagination
    this.controller.initializePagination(this.pageSize);

    // Setup callbacks and global functions
    this.setupControllerCallbacks();
    this.setupGlobalRetry();
    this.setupGlobalClearSearch();
    this.setupGlobalClearSearch();

    // Set HTML content
    container.innerHTML = this.generateHTML();

    // Load initial data after DOM is ready
    setTimeout(() => {
      // Setup tag filter listeners
      this.setupTagFilterListeners();
      
      // Load initial data
      this.updateTableAndPagination(1);
    }, 0);

    return container;
  }
}
