import { Injectable } from "@angular/core";
import { ProductService } from "./product.service";
import { CategoryService } from "./category.service";
import { combineLatest, map, Observable } from "rxjs";
import { Product } from "../interfaces/product";

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  fetchProductsWithCategories(): Observable<Product[]> {
    return combineLatest([
      this.productService.fetchProducts(),
      this.categoryService.fetchCategories()
    ]).pipe(
      map(([products, categories]) => {
        const categoryMap = new Map<string, string>();
        categories.forEach(category => {
          if (category.id) {
            categoryMap.set(category.id, category.name);
          }
        });

        return products.map(product => ({
          ...product,
          categoryName: categoryMap.get(product.categoryId) || 'Unknown'
        }));
      })
    );
  }
}
