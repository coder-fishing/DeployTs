import type { PaginatedResponse } from "~/services/BaseService";

export abstract class BaseController<T> {
    // Pagination state
    protected currentPage: number = 1;
    protected itemsPerPage: number = 6;
    protected totalItems: number = 0;
    protected totalPages: number = 0;

    // UI state management
    protected loadingCallbacks: (() => void)[] = [];
    protected errorCallbacks: ((error: any) => void)[] = [];
    protected successCallbacks: ((data: any) => void)[] = [];

    /**
     * Abstract method để subclass implement service call
     */
    protected abstract getServicePaginated(page: number, limit: number): Promise<PaginatedResponse<T>>;

    /**
     * Initialize pagination with page size
     */
    public initializePagination(itemsPerPage: number = 6): void {
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
    }

    /**
     * Get current pagination state
     */
    public getPaginationState() {
        return {
            currentPage: this.currentPage,
            itemsPerPage: this.itemsPerPage,
            totalItems: this.totalItems,
            totalPages: this.totalPages,
        };
    }

    /**
     * Register UI callbacks
     */
    public registerUICallbacks(callbacks: {
        onLoading?: () => void;
        onError?: (error: any) => void;
        onSuccess?: (data: any) => void;
    }): void {
        if (callbacks.onLoading) this.loadingCallbacks.push(callbacks.onLoading);
        if (callbacks.onError) this.errorCallbacks.push(callbacks.onError);
        if (callbacks.onSuccess) this.successCallbacks.push(callbacks.onSuccess);
    }

    /**
     * Trigger loading state
     */
    protected triggerLoading(): void {
        this.loadingCallbacks.forEach(callback => callback());
    }

    /**
     * Trigger error state
     */
    protected triggerError(error: any): void {
        this.errorCallbacks.forEach(callback => callback(error));
    }

    /**
     * Trigger success state
     */
    protected triggerSuccess(data: any): void {
        this.successCallbacks.forEach(callback => callback(data));
    }

    /**
     * Load data for specific page and update pagination state
     */
    public async loadDataForPage(page: number): Promise<{
        data: T[];
        paginationInfo: {
            currentPage: number;
            itemsPerPage: number;
            totalItems: number;
            totalPages: number;
            start: number;
            end: number;
        };
    }> {
        try {
            const result = await this.getServicePaginated(page, this.itemsPerPage);
            
            // Update internal state
            this.currentPage = result.currentPage;
            this.totalItems = result.totalItems;
            this.totalPages = result.totalPages;

            const start = (this.currentPage - 1) * this.itemsPerPage + 1;
            const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);

            return {
                data: result.data,
                paginationInfo: {
                    currentPage: this.currentPage,
                    itemsPerPage: this.itemsPerPage,
                    totalItems: this.totalItems,
                    totalPages: this.totalPages,
                    start,
                    end,
                },
            };
        } catch (error) {
            console.error('Error loading data for page:', error);
            throw error;
        }
    }

    /**
     * Load data for specific page with UI state management
     */
    public async loadDataForPageWithUI(page: number): Promise<void> {
        try {
            // Trigger loading state
            this.triggerLoading();

            const result = await this.loadDataForPage(page);
            
            // Trigger success state
            this.triggerSuccess(result);
        } catch (error) {
            // Trigger error state
            this.triggerError(error);
        }
    }

    /**
     * Generate page numbers for pagination display
     */
    public generatePageNumbers(maxVisible: number = 5): number[] {
        const pageNumbers = [];
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(this.totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        
        return pageNumbers;
    }

    /**
     * Check if can go to previous page
     */
    public canGoPrevious(): boolean {
        return this.currentPage > 1;
    }

    /**
     * Check if can go to next page
     */
    public canGoNext(): boolean {
        return this.currentPage < this.totalPages;
    }

    /**
     * Get previous page number
     */
    public getPreviousPage(): number {
        return Math.max(1, this.currentPage - 1);
    }

    /**
     * Get next page number
     */
    public getNextPage(): number {
        return Math.min(this.totalPages, this.currentPage + 1);
    }

    /**
     * Retry loading current page
     */
    public async retryLoadCurrentPage(): Promise<void> {
        await this.loadDataForPageWithUI(this.currentPage);
    }
}
