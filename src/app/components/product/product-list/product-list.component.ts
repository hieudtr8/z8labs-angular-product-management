import { Component } from '@angular/core';
import { Product } from "../../../interfaces/product";
import { ProductService } from "../../../shared/services/product.service";
import { sharedImports } from "../../../shared/helpers/shared-imports";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    ...sharedImports,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  products: Product[] = [];

  constructor(private productService: ProductService  ) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts()
      .subscribe((products) => this.products = products);
  }
}
