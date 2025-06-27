import BaseService from './BaseService.js';
import type { Product } from '~/types/product.type.js';

export default class DefaultService extends BaseService {
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
}