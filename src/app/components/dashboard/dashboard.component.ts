import { Component, OnInit } from '@angular/core';
import { Product } from "../../interfaces/product";
import { Category } from "../../interfaces/category";
import { ProductService } from "../../shared/services/product.service";
import { CategoryService } from "../../shared/services/category.service";
import { sharedImports } from "../../shared/helpers/shared-imports";
import { map, Observable } from "rxjs";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ...sharedImports,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  products$!: Observable<Product[]>;  // Observable for product state
  categories$!: Observable<Category[]>;  // Observable for categories state

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.products$ = this.productService.products$;
    this.categories$ = this.categoryService.categories$;

    this.productService.fetchProducts().subscribe();
    this.categoryService.fetchCategories().subscribe();
  }

  // Get product count for each category
  getProductCountForCategory(categoryId: number): Observable<number> {
    const result = this.products$.pipe(
      map((products) => products.filter(p => p.categoryId === categoryId).length)
    );

    return result;
  }

}
