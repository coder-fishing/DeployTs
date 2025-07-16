import { URLStateManager } from '../utils/URLStateManager';

/**
 * Test URLStateManager functionality
 */
export class URLStateManagerTest {
    private urlManager: URLStateManager;

    constructor() {
        this.urlManager = URLStateManager.getInstance();
    }

    /**
     * Run all tests
     */
    public runAllTests(): void {
        console.log('🧪 Starting URLStateManager Tests...');
        
        this.testBasicState();
        this.testFiltersHandling();
        this.testUpdateState();
        this.testClearAll();
        this.testHasActiveFiltersOrSort();
        
        console.log('✅ All URLStateManager tests completed!');
    }

    /**
     * Test basic state management
     */
    private testBasicState(): void {
        console.log('🔧 Testing basic state management...');
        
        // Clear all first
        this.urlManager.clearAll();
        
        // Test setting basic parameters
        this.urlManager.updateState({
            search: 'test search',
            sortBy: 'name',
            sortOrder: 'asc',
            page: 2
        });
        
        const state = this.urlManager.getCurrentState();
        console.log('Current state:', state);
        
        // Verify state
        if (state.search === 'test search' && 
            state.sortBy === 'name' && 
            state.sortOrder === 'asc' && 
            state.page === 2) {
            console.log('✅ Basic state test passed');
        } else {
            console.log('❌ Basic state test failed');
        }
    }

    /**
     * Test filters object handling
     */
    private testFiltersHandling(): void {
        console.log('🔧 Testing filters handling...');
        
        // Clear all first
        this.urlManager.clearAll();
        
        // Test setting filters object
        this.urlManager.updateState({
            filters: { tag: 'Published' },
            page: 1
        });
        
        const state = this.urlManager.getCurrentState();
        console.log('State with filters:', state);
        
        // Verify filters
        if (state.filters && state.filters.tag === 'Published') {
            console.log('✅ Filters handling test passed');
        } else {
            console.log('❌ Filters handling test failed');
        }
        
        // Check URL manually
        console.log('Current URL:', window.location.href);
    }

    /**
     * Test update state functionality
     */
    private testUpdateState(): void {
        console.log('🔧 Testing updateState...');
        
        // Set initial state
        this.urlManager.updateState({
            search: 'initial',
            sortBy: 'name',
            filters: { tag: 'Draft' }
        });
        
        console.log('Initial state:', this.urlManager.getCurrentState());
        
        // Update partial state
        this.urlManager.updateState({
            search: 'updated',
            sortOrder: 'desc'
        });
        
        const updatedState = this.urlManager.getCurrentState();
        console.log('Updated state:', updatedState);
        
        // Verify partial update preserved other values
        if (updatedState.search === 'updated' && 
            updatedState.sortBy === 'name' && 
            updatedState.sortOrder === 'desc' &&
            updatedState.filters?.tag === 'Draft') {
            console.log('✅ Update state test passed');
        } else {
            console.log('❌ Update state test failed');
        }
    }

    /**
     * Test clear all functionality
     */
    private testClearAll(): void {
        console.log('🔧 Testing clearAll...');
        
        // Set some state first
        this.urlManager.updateState({
            search: 'test',
            sortBy: 'name',
            filters: { tag: 'Published' }
        });
        
        console.log('State before clear:', this.urlManager.getCurrentState());
        
        // Clear all
        this.urlManager.clearAll();
        
        const clearedState = this.urlManager.getCurrentState();
        console.log('State after clear:', clearedState);
        
        // Verify all cleared
        if (!clearedState.search && 
            !clearedState.sortBy && 
            !clearedState.filters &&
            !clearedState.page) {
            console.log('✅ Clear all test passed');
        } else {
            console.log('❌ Clear all test failed');
        }
    }

    /**
     * Test hasActiveFiltersOrSort
     */
    private testHasActiveFiltersOrSort(): void {
        console.log('🔧 Testing hasActiveFiltersOrSort...');
        
        // Clear all first
        this.urlManager.clearAll();
        
        // Should return false when no filters
        let hasActive = this.urlManager.hasActiveFiltersOrSort();
        console.log('Has active (empty):', hasActive);
        
        if (!hasActive) {
            console.log('✅ Empty state test passed');
        } else {
            console.log('❌ Empty state test failed');
        }
        
        // Add some filters
        this.urlManager.updateState({
            filters: { tag: 'Published' }
        });
        
        hasActive = this.urlManager.hasActiveFiltersOrSort();
        console.log('Has active (with filters):', hasActive);
        
        if (hasActive) {
            console.log('✅ Active filters test passed');
        } else {
            console.log('❌ Active filters test failed');
        }
    }

    /**
     * Test filters URL encoding/decoding
     */
    public testFiltersUrlEncoding(): void {
        console.log('🔧 Testing filters URL encoding...');
        
        // Clear all first
        this.urlManager.clearAll();
        
        // Test different filter values
        const testCases: Record<string, string | number | boolean>[] = [
            { tag: 'Published' },
            { tag: 'Draft' },
            { tag: 'Low Stock' },
            { category: 'Electronics', status: 'active' },
            { price: 100, inStock: true }
        ];
        
        testCases.forEach((filters, index) => {
            console.log(`Test case ${index + 1}:`, filters);
            
            this.urlManager.updateState({ filters });
            const state = this.urlManager.getCurrentState();
            
            console.log('Retrieved state:', state);
            console.log('URL:', window.location.href);
            
            // Verify round-trip
            if (JSON.stringify(state.filters) === JSON.stringify(filters)) {
                console.log(`✅ Test case ${index + 1} passed`);
            } else {
                console.log(`❌ Test case ${index + 1} failed`);
            }
        });
    }

    /**
     * Test edge cases
     */
    public testEdgeCases(): void {
        console.log('🔧 Testing edge cases...');
        
        // Test undefined filters
        this.urlManager.updateState({ filters: undefined });
        let state = this.urlManager.getCurrentState();
        console.log('Undefined filters state:', state);
        
        // Test null values
        this.urlManager.updateState({ 
            search: null as any,
            sortBy: undefined 
        });
        state = this.urlManager.getCurrentState();
        console.log('Null/undefined values state:', state);
        
        // Test empty object filters
        this.urlManager.updateState({ filters: {} });
        state = this.urlManager.getCurrentState();
        console.log('Empty object filters state:', state);
        
        console.log('✅ Edge cases test completed');
    }
}

// Create test instance and run tests
if (typeof window !== 'undefined') {
    // Only run in browser environment
    const urlTest = new URLStateManagerTest();
    
    // Expose to global for manual testing
    (window as any).urlTest = urlTest;
    
    console.log('📋 URLStateManager test instance created. Available methods:');
    console.log('- urlTest.runAllTests()');
    console.log('- urlTest.testFiltersUrlEncoding()');
    console.log('- urlTest.testEdgeCases()');
}
