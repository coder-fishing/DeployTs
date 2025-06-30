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
    public async getCategoriesPaginated(page: number = 1, limit: number = 10) {
        try {
            const result = await this.categoryService.getCategoriesPaginated(page, limit);
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
}

export default CategoryController;