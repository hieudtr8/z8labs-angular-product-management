import { Component, OnInit } from '@angular/core';
import { ProductService } from "../../../shared/services/product.service";
import { forkJoin, Observable } from 'rxjs';
import { Product } from "../../../interfaces/product";
import { sharedImports } from "../../../shared/helpers/shared-imports";
import { TableComponent } from "../../table/table.component";
import { TableColumn } from "../../../interfaces/table";
import { Router } from "@angular/router";
import { CategoryService } from "../../../shared/services/category.service";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    ...sharedImports,
    TableComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})

export class ProductListComponent implements OnInit {
  products$!: Observable<Product[]>;
  columns: TableColumn<Product>[] = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'price', label: 'Price' },
    { key: 'categoryName', label: 'Category Name' },
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
  ) { }

  ngOnInit(): void {
     // Fetch both products and categories using forkJoin
     forkJoin({
      products: this.productService.fetchProducts(),
      categories: this.categoryService.fetchCategories()
    }).subscribe(({ products, categories }) => {
      // Map category names to products
      const categoryMap = categories.reduce((acc, category) => {
        if (!category.id) return acc;

        acc[category.id] = category.name;
        return acc;
      }, {} as { [key: number]: string });

      // Assign category names to products
      const updatedProducts = products.map(product => ({
        ...product,
        categoryName: categoryMap[product.categoryId] || 'Unknown'
      }));

      this.productService.updateProducts(updatedProducts); // Update the product subject

      this.products$ = this.productService.products$;
    });
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe();
  }

  onAdd(): void {
    this.router.navigate(['products', 'new']);
  }

  onEdit(product: Product): void {
    this.router.navigate(['products', 'edit', product.id]);
  }

  onDelete(product: Product): void {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    if (!product.id) return;

    this.deleteProduct(product.id);
  }
}
