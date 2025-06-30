import ProductService from '../services/ProductService';
import { BaseController } from './BaseController';
import type { Product } from '~/types/product.type';

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
        return this.productService.getProductsPaginated(page, limit);
    }

    /**
     * Get all products
     */
    public async getAllProducts() {
        try {
            const products = await this.productService.getAllProducts();
            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    /**
     * Get products with pagination (backward compatibility)
     */
    public async getProductsPaginated(page: number = 1, limit: number = 10) {
        try {
            const result = await this.productService.getProductsPaginated(page, limit);
            return result;
        } catch (error) {
            console.error('Error fetching paginated products:', error);
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
}

export default ProductController;