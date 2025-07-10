// Notification modal for concurrency conflicts
export const concurrencyConflictModal = (): string => {
    return `
        <div id="concurrencyConflictModal" class="modal-overlay" style="display: none;">
            <div class="modal-content concurrency-conflict-modal">
                <div class="modal-header">
                    <div class="modal-icon warning">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <h3>Data Conflict Detected</h3>
                </div>
                <div class="modal-body">
                    <p>The product has been modified by another user since you started editing.</p>
                    <p>Your changes cannot be saved to prevent data loss.</p>
                    <div class="conflict-actions">
                        <div class="conflict-action">
                            <strong>1.</strong> Refresh the page to see the latest changes
                        </div>
                        <div class="conflict-action">
                            <strong>2.</strong> Make your changes again
                        </div>
                        <div class="conflict-action">
                            <strong>3.</strong> Save the product
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="refreshPageBtn" class="btn btn-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 4V10H7M23 20V14H17M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Refresh Page
                    </button>
                    <button id="dismissConflictBtn" class="btn btn-secondary">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    `;
};

// Function to show concurrency conflict modal
export const showConcurrencyConflictModal = (): void => {
    const modal = document.getElementById('concurrencyConflictModal') as HTMLElement;
    if (modal) {
        modal.style.display = 'flex';
        
        // Setup event listeners
        const refreshBtn = document.getElementById('refreshPageBtn') as HTMLButtonElement;
        const dismissBtn = document.getElementById('dismissConflictBtn') as HTMLButtonElement;
        
        refreshBtn?.addEventListener('click', () => {
            window.location.reload();
        });
        
        dismissBtn?.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
};

// Function to inject modal into DOM if not exists
export const injectConcurrencyConflictModal = (): void => {
    if (!document.getElementById('concurrencyConflictModal')) {
        document.body.insertAdjacentHTML('beforeend', concurrencyConflictModal());
    }
};
