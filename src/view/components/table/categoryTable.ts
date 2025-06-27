import { CategoryHeader } from "./categoryHeader";
import { CategoryRow } from "./categoryRow";
import type { Category } from "~/types/category.type";

export function CategoryTable(categorys: Category[]): string {
  return `
        <table class="product-table">
            ${CategoryHeader()}
            <tbody>
                ${categorys.map((category) => CategoryRow({ category })).join("")}
            </tbody>
        </table>
    `;
}
