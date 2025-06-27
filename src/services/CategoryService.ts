import type { Category } from "~/types/category.type";
import BaseService from "./BaseService";

export default class CategoryService extends BaseService {
  async getAllCategories(): Promise<Category[]> {
    return this.getAll<Category>();
  }

  async getCategoryById(id: number): Promise<Category> {
    return this.getById<Category>(id.toString());
  }

  async createCategory(category: Category): Promise<Category> {
    return this.create<Category>(category);
  }

  async updateCategory(id: number, category: Category): Promise<Category> {
    return this.update<Category>(id.toString(), category);
  }

  async deleteCategory(id: number): Promise<void> {
    return this.deleteById(id.toString());
  }

  // Có thể thêm method riêng
  async getProductsByCategory(categoryId: string): Promise<Category[]> {
    return this.get<Category[]>(`/category/${categoryId}`);
  }
}