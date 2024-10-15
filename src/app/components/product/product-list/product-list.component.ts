import { Component, OnInit } from '@angular/core';
import { ProductService } from "../../../shared/services/product.service";
import { Observable } from 'rxjs';
import { Product } from "../../../interfaces/product";
import { sharedImports } from "../../../shared/helpers/shared-imports";
import { TableComponent } from "../../table/table.component";
import { TableColumn } from "../../../interfaces/table";
import { Router } from "@angular/router";

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
    { key: 'categoryId', label: 'Category ID' },
  ];

  constructor(
    private productService: ProductService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.products$ = this.productService.products$;
    this.productService.fetchProducts().subscribe();
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
