import { Component, OnInit } from '@angular/core';
import { Product } from "../../interfaces/product";
import { Category } from "../../interfaces/category";
import { ProductService } from "../../shared/services/product.service";
import { CategoryService } from "../../shared/services/category.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
  }

  getProducts(): void {
    this.productService.getProducts()
      .subscribe((products) => this.products = products);
  }

  getCategories(): void {
    this.categoryService.getCategories()
      .subscribe((categories) => this.categories = categories);
  }

  getProductCountForCategory(categoryId: number): number {
    return this.products.filter((product) => product.categoryId === categoryId).length;
  }

}
