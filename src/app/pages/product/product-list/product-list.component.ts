import { Component, OnInit } from '@angular/core';
import { ProductService } from "../../../services/product.service";
import { filter, Observable, tap } from 'rxjs';
import { Product } from "../../../interfaces/product";
import { sharedImports } from "../../../shared/imports/shared-imports";
import { TableColumn } from "../../../interfaces/table";
import { NavigationEnd, Router } from "@angular/router";
import { CategoryService } from "../../../services/category.service";
import { ToastrService } from "ngx-toastr";
import { TableComponent } from "../../../components/table/table.component";
import { Category } from "../../../interfaces/category";
import { ProductCategoryService } from "../../../services/product-category.service";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    ...sharedImports,
    TableComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})

export class ProductListComponent implements OnInit {
  products$!: Observable<Product[]>;

  columns: TableColumn<Product>[] = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'price', label: 'Price', pipe: 'currency' },
    { key: 'categoryName', label: 'Category Name' },
  ];

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.products$ = this.productService.products$;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      tap(() => {
        // Refetch products with categories when navigating back
        this.productCategoryService.fetchProductsWithCategories().subscribe(
          (updatedProducts) => this.productService.updateProducts(updatedProducts).subscribe()
        );
      })
    ).subscribe();

    // Initial load
    this.productCategoryService.fetchProductsWithCategories().subscribe(
      (updatedProducts) => this.productService.updateProducts(updatedProducts).subscribe()
    );
  }

  deleteProduct(id: string): void {
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
    this.toastr.success('Product deleted successfully');
  }
}
