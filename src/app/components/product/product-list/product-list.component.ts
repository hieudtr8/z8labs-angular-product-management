import { Component, OnInit } from '@angular/core';
import { ProductService } from "../../../shared/services/product.service";
import { Observable } from 'rxjs';
import { Product } from "../../../interfaces/product";
import { sharedImports } from "../../../shared/helpers/shared-imports";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    ...sharedImports,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products$!: Observable<Product[]>; // Observable for products state

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.products$ = this.productService.products$;

    this.productService.fetchProducts().subscribe();
  }

  // Delete a product
  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe();
  }
}
