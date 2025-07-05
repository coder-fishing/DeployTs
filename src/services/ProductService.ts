import BaseService from './BaseService.js';
import type { Product } from '../types/product.type.js';

export default class ProductService extends BaseService {
  constructor() {
    super("https://67c09c48b9d02a9f224a690e.mockapi.io/api/product");
  }


  async getAllProducts(): Promise<Product[]> {
    return this.getAll<Product>();
  }

  async getProductById(id: number): Promise<Product> {
    return this.getById<Product>(id.toString());
  }

  async createProduct(product: Product): Promise<Product> {
    return this.create<Product>(product);
  }

  async updateProduct(id: number, product: Product): Promise<Product> {
    return this.update<Product>(id.toString(), product);
  }

  async deleteProduct(id: number): Promise<void> {
    return this.deleteById(id.toString());
  }

  // Có thể thêm method riêng
  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return this.get<Product[]>(`/category/${categoryId}`);
  }

  // Server-side pagination method
  async getProductsPaginated(page: number = 1, limit: number = 10) {
    return this.getPaginated<Product>(page, limit);
  }

  // Filter products by status
  async getProductsByStatus(status: string): Promise<Product[]> {
    const allProducts = await this.getAllProducts();
    
    // If status is 'All Status' or empty, return all products
    if (!status || status === 'All Status' || status === 'All') {
      return allProducts;
    }
    
    // Filter products by status
    return allProducts.filter(product => {
      // Use the status field from Product type
      const productStatus = product.status || 'Draft';
      return productStatus.toLowerCase() === status.toLowerCase();
    });
  }

  // Filter products by multiple criteria
  async getFilteredProducts(filters: {
    status?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    searchTerm?: string;
  }): Promise<Product[]> {
    let products = await this.getAllProducts();

    // Filter by status
    if (filters.status && filters.status !== 'All Status' && filters.status !== 'All') {
      products = products.filter(product => {
        const productStatus = product.status || 'Draft';
        return productStatus.toLowerCase() === filters.status!.toLowerCase();
      });
    }

    // Filter by category
    if (filters.category && filters.category !== 'All') {
      products = products.filter(product => {
        const productCategory = product.category || '';
        return productCategory.toLowerCase().includes(filters.category!.toLowerCase());
      });
    }

    // Filter by price range
    if (filters.minPrice !== undefined) {
      products = products.filter(product => 
        (product.price || 0) >= filters.minPrice!
      );
    }

    if (filters.maxPrice !== undefined) {
      products = products.filter(product => 
        (product.price || 0) <= filters.maxPrice!
      );
    }

    // Filter by search term (name or description)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      products = products.filter(product => {
        const name = (product.name || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        const sku = (product.sku || '').toLowerCase();
        return name.includes(searchLower) || 
               description.includes(searchLower) || 
               sku.includes(searchLower);
      });
    }

    return products;
  }

  // Get unique status values from all products
  async getAvailableStatuses(): Promise<string[]> {
    const products = await this.getAllProducts();
    const statuses = new Set<string>();
    
    products.forEach(product => {
      const status = product.status || 'Draft';
      statuses.add(status);
    });

    return ['All Status', ...Array.from(statuses).sort()];
  }

  async searchProducts(query: string, page: number , limit: number ): Promise<Product[]> {
    const paginated = await this.search<Product>(query, page, limit);
    return paginated.items || paginated.data || [];
  }
}