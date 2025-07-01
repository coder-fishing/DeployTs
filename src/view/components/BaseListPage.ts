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
        // Update pagination
        this.updatePaginationDisplay(result.paginationInfo);
        // Setup sort event listeners
        this.setupSortEventListeners();
      }
    });
  }

  // Function to update only the table and pagination
  private updateTableAndPagination = async (page: number): Promise<void> => {
    await this.controller.loadDataForPageWithUI(page);
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

  // Generate the HTML content
  private generateHTML(): string {
    const tagFilterHtml = this.tagFilter ? 
      TagFilter(this.tagFilter.filters, this.tagFilter.currentFilter) : '';

    const searchSection = this.tagFilter ? `
      <div class="tag-add-searchbar">
        ${tagFilterHtml}
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

    // Set HTML content
    container.innerHTML = this.generateHTML();

    // Load initial data after DOM is ready
    setTimeout(() => {
      this.updateTableAndPagination(1);
    }, 0);

    return container;
  }
}
