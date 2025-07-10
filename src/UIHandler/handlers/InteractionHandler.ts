// Interaction handler for managing table interactions (edit, delete buttons)
export class InteractionHandler {
    private handleGlobalClick: (event: Event) => Promise<void>;
    private onEdit: (id: string) => void;
    private onDelete: (id: number) => Promise<void>;
    private contextPath: string; // e.g., '/category', '/product'
    
    constructor(
        onEdit: (id: string) => void,
        onDelete: (id: number) => Promise<void>,
        contextPath: string
    ) {
        this.onEdit = onEdit;
        this.onDelete = onDelete;
        this.contextPath = contextPath;
        this.handleGlobalClick = this.createGlobalClickHandler();
    }

    /**
     * Create global click handler with event delegation
     */
    private createGlobalClickHandler() {
        return async (event: Event): Promise<void> => {
            if (!event.target) return;

            const target = event.target as Element;
            
            // Check if we're in the correct context
            const contextTable = target.closest(`.${this.getContextClass()}-table, [data-context="${this.getContextClass()}"]`);
            const contextPage = window.location.pathname.includes(this.contextPath);
            
            // Only handle actions when in correct context
            if (!contextTable && !contextPage) {
                return;
            }

            // Edit button handler
            const editButton = target.closest('.product-table__item--action--edit, .product-table__edit, .edit-btn, [data-action="edit"]');
            
            if (editButton) {
                event.preventDefault();
                
                const itemId = editButton.getAttribute('data-id') || 
                             editButton.closest('[data-id]')?.getAttribute('data-id');
                
                if (itemId) {
                    this.onEdit(itemId);
                }
                return;
            }

            // Delete button handler
            const deleteButton = target.closest('.product-table__item--action--delete, .delete-btn');
            if (deleteButton) {
                event.preventDefault();
                
                const itemId = deleteButton.getAttribute('data-id') || 
                             deleteButton.closest('[data-id]')?.getAttribute('data-id');
                
                if (itemId) {
                    const confirmDelete = confirm(`Are you sure you want to delete this ${this.getContextClass()}?`);
                    if (confirmDelete) {
                        try {
                            await this.onDelete(parseInt(itemId));
                        } catch (error) {
                            console.error('❌ Error in delete handler:', error);
                        }
                    }
                }
                return;
            }
        };
    }

    /**
     * Get context class name from path
     */
    private getContextClass(): string {
        return this.contextPath.replace('/', '');
    }

    /**
     * Setup table interactions
     */
    public setupTableInteractions(): void {
        // Check if we're in correct context
        const contextPage = window.location.pathname.includes(this.contextPath);
        
        if (!contextPage) {
            return;
        }
        
        // Remove any existing listeners to prevent duplicates
        document.removeEventListener('click', this.handleGlobalClick);
        
        // Add global click listener using event delegation
        document.addEventListener('click', this.handleGlobalClick);
        
        console.log(`✅ ${this.getContextClass()} table interactions setup`);
    }

    /**
     * Cleanup interaction handlers
     */
    public cleanup(): void {
        document.removeEventListener('click', this.handleGlobalClick);
    }
}
